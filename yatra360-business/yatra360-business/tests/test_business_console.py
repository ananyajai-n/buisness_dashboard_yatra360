"""
Person 6 — end-to-end integration suite for the Business console.

Covers the four checks the architecture blueprint asks for in Phase 5:
  1. RBAC     — a business claim mounts the console; a tourist claim is bounced.
  2. Flow     — gate -> login -> dashboard, and the three-step registration.
  3. Payload  — the demand/opportunity requests are intercepted and asserted on
                shape, not on a pixel snapshot (WebGL and SVG diffs are brittle).
  4. Render   — the Recharts SVG actually changes when the scenario changes.

Run:
    pip install pytest pytest-playwright
    playwright install chromium
    npm run dev &            # or point BASE_URL at a preview build
    pytest tests/ -v

Set BASE_URL to test a deployed standalone build; the fixtures below derive
every path from BASE_PATH so the same suite runs against either deployment
mode without edits.
"""

import json
import os
import re

import pytest
from playwright.sync_api import Page, expect

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5173")
# "" when the console is deployed standalone, "/business" when embedded.
BASE_PATH = os.environ.get("BASE_PATH", "/business")

LOGIN = f"{BASE_URL}{BASE_PATH}/login"
REGISTER = f"{BASE_URL}{BASE_PATH}/register"
OVERVIEW = f"{BASE_URL}{BASE_PATH}/app/overview"


def seed_session(page: Page, role: str = "business") -> None:
    """
    Inject the session the mock adapter reads, standing in for a Supabase JWT
    whose app_metadata.user_role claim was set by Person 5's access-token hook.
    Written before any script runs so there is no flash of the login screen.
    """
    session = {
        "token": "header.payload.signature",
        "role": role,
        "user": {"email": "owner@kakahalwai.in"},
        "business": {
            "name": "Kaka Halwai",
            "category": "Sweets & snacks",
            "locality": "Kasba Peth",
            "email": "owner@kakahalwai.in",
            "capacity": 40,
        },
    }
    page.add_init_script(
        f"localStorage.setItem('y360.session', {json.dumps(json.dumps(session))})"
    )


# --------------------------------------------------------------------------
# 1. Role-based access control
# --------------------------------------------------------------------------

def test_unauthenticated_user_is_sent_to_login(page: Page):
    page.goto(OVERVIEW)
    expect(page).to_have_url(re.compile(r"/login"))
    expect(page.get_by_label("Work email")).to_be_visible()


def test_business_claim_mounts_the_console(page: Page):
    seed_session(page, role="business")
    page.goto(OVERVIEW)
    expect(page.get_by_role("heading", name="Demand overview")).to_be_visible()
    expect(page.get_by_text("BUSINESS CONSOLE")).to_be_visible()


def test_tourist_claim_is_bounced_off_business_routes(page: Page):
    seed_session(page, role="tourist")
    page.goto(OVERVIEW)
    # RoleProtectedRoute redirects out of the module entirely.
    expect(page.get_by_role("heading", name="Demand overview")).not_to_be_visible()
    assert "/app/" not in page.url


# --------------------------------------------------------------------------
# 2. Flow: sign-in and registration
# --------------------------------------------------------------------------

def test_sign_in_lands_on_the_dashboard(page: Page):
    page.goto(LOGIN)
    page.get_by_label("Work email").fill("owner@kakahalwai.in")
    page.get_by_label("Password").fill("demo-account")
    page.get_by_role("button", name="Sign in").click()
    expect(page).to_have_url(re.compile(r"/app/overview"))
    expect(page.get_by_role("heading", name="Demand overview")).to_be_visible()


def test_login_rejects_an_empty_submission(page: Page):
    page.goto(LOGIN)
    page.get_by_role("button", name="Sign in").click()
    expect(page.get_by_text(re.compile("Enter both"))).to_be_visible()
    assert "/app/" not in page.url


def test_registration_walks_three_steps_and_blocks_bad_input(page: Page):
    page.goto(REGISTER)

    # Step 1 refuses a malformed email rather than silently advancing.
    page.get_by_label("Business name").fill("Ganesh Bhel")
    page.get_by_label("Work email").fill("not-an-email")
    page.get_by_role("button", name="Continue").click()
    expect(page.get_by_text(re.compile("email address is incomplete"))).to_be_visible()

    page.get_by_label("Work email").fill("owner@ganeshbhel.in")
    page.get_by_role("button", name="Continue").click()

    # Step 2
    expect(page.get_by_label("Locality")).to_be_visible()
    page.get_by_label("Street address").fill("412 Laxmi Road, near Belbaug Chowk")
    page.get_by_role("button", name="Continue").click()

    # Step 3
    page.get_by_label("Create a password").fill("short")
    page.get_by_role("button", name="Create business account").click()
    expect(page.get_by_text(re.compile("at least 8 characters"))).to_be_visible()

    page.get_by_label("Create a password").fill("monsoon-teal-2026")
    page.get_by_role("button", name="Create business account").click()
    expect(page).to_have_url(re.compile(r"/app/overview"))


def test_registration_panel_rotates_and_is_keyboard_reachable(page: Page):
    page.goto(REGISTER)
    dots = page.locator(".y-dots button")
    expect(dots).to_have_count(4)
    first = page.locator(".y-vis-caption h3").inner_text()
    dots.nth(2).click()
    expect(page.locator(".y-vis-caption h3")).not_to_have_text(first)


# --------------------------------------------------------------------------
# 3. Payload shape — intercept, don't snapshot
# --------------------------------------------------------------------------

def test_demand_payload_has_the_contracted_shape(page: Page):
    """
    Asserts the contract in data/mock.js, which is what Person 3's FastAPI
    endpoints have to match. Runs against either the mock or the live API.
    """
    captured = {}

    def record(route):
        response = route.fetch()
        try:
            captured[route.request.url] = response.json()
        except Exception:
            pass
        route.fulfill(response=response)

    page.route("**/api/business/**", record)
    seed_session(page)
    page.goto(OVERVIEW)
    expect(page.get_by_role("heading", name="Demand overview")).to_be_visible()

    if not captured:
        pytest.skip("running against the bundled mock; no network layer to intercept")

    demand = next(v for k, v in captured.items() if "demand" in k)
    assert len(demand["series"]) == 24, "one row per hour of the day"
    assert {"hour", "family", "solo", "transit"} <= set(demand["series"][0])
    assert {"footfall", "peak", "segment", "spill"} <= set(demand["kpi"])
    assert all(0 <= row["hour"] <= 23 for row in demand["series"])


# --------------------------------------------------------------------------
# 4. The charts respond to the model, not to a fixture
# --------------------------------------------------------------------------

def test_scenario_switch_redraws_the_demand_area(page: Page):
    seed_session(page)
    page.goto(OVERVIEW)
    area = page.locator(".recharts-area-area").first
    expect(area).to_be_visible()
    weekend_path = area.get_attribute("d")

    page.get_by_role("button", name="Weekday").click()
    expect(page.locator(".recharts-area-area").first).not_to_have_attribute(
        "d", weekend_path
    )


def test_segment_toggle_removes_a_series_but_never_all_of_them(page: Page):
    seed_session(page)
    page.goto(OVERVIEW)
    areas = page.locator(".recharts-area-area")
    expect(areas).to_have_count(3)

    page.get_by_role("button", name="Families").click()
    expect(areas).to_have_count(2)
    page.get_by_role("button", name="Solo travellers").click()
    page.get_by_role("button", name="Transit / commuter").click()
    expect(areas).to_have_count(1), "the last visible segment cannot be switched off"


def test_accepting_an_opportunity_survives_a_reload(page: Page):
    seed_session(page)
    page.goto(f"{BASE_URL}{BASE_PATH}/app/opportunities")
    page.get_by_role("button", name="Add to plan").first.click()
    expect(page.get_by_text("Added to your plan").first).to_be_visible()
    page.reload()
    expect(page.get_by_text("Added to your plan").first).to_be_visible()


# --------------------------------------------------------------------------
# 5. Layout survives a resize — the failure mode the blueprint calls out
# --------------------------------------------------------------------------

@pytest.mark.parametrize("width,height", [(1440, 900), (1024, 768), (390, 844)])
def test_no_chart_collapses_to_zero_height(page: Page, width, height):
    seed_session(page)
    page.set_viewport_size({"width": width, "height": height})
    page.goto(OVERVIEW)
    svg = page.locator(".recharts-surface").first
    expect(svg).to_be_visible()
    box = svg.bounding_box()
    assert box["height"] > 80, (
        f"ResponsiveContainer measured {box['height']}px at {width}x{height} — "
        "the aspect fallback is not holding"
    )


def test_rail_collapses_behind_a_menu_button_on_mobile(page: Page):
    seed_session(page)
    page.set_viewport_size({"width": 390, "height": 844})
    page.goto(OVERVIEW)
    menu = page.get_by_role("button", name="Menu")
    expect(menu).to_be_visible()
    menu.click()
    expect(page.get_by_role("link", name="AI opportunities")).to_be_visible()
