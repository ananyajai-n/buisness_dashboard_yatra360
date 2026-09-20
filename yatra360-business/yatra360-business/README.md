# Yatra 360 — Business console (Person 6)

Business-side registration, login and analytics dashboard for Yatra 360.
Built against `yatra_360_context_sheet.md` and `Civic_Tourism_Dashboard_Architecture.md`.

There was no existing repo attached, so this is a self-contained module written to
drop into the shared frontend. Every selector is `y-` prefixed and every path is
built through one helper, so it collides with nothing Person 2 has already written.

## The deployment question, deliberately left open

You haven't decided whether Business lives at `/business/*` inside the main app or
on its own origin later. Nothing here commits you either way:

| | Embedded (default) | Standalone |
|---|---|---|
| Build | `npm run build` | `npm run build:standalone` |
| Mount | `<Route path="/business">{businessRoutes}</Route>` (see `src/shell/AppRoutes.jsx`) | `createBrowserRouter(businessRoutes)` (see `src/standalone-main.jsx`) |
| Base path | `/business` | `` (root) |
| "Back to Yatra 360" | in-app `<Link>` to `/` | `<a href>` to the tourist origin |

Three things make that possible, and they're the parts worth not breaking:

1. **`config.js`** — the only file that knows about paths. `businessPath("app/overview")`
   returns `/business/app/overview` or `/app/overview` depending on `VITE_BUSINESS_MODE`.
   No component hard-codes a URL.
2. **`routes.jsx`** — routes declared *relative* as plain objects, so the parent path is
   the only thing that changes between the two modes.
3. **Injected adapters** — `BusinessAuthProvider` takes an auth adapter and `data/client.js`
   takes an API base. A separate deployment can point at a different Supabase project or
   API host without touching a single component.

Splitting it out later is a routing change, not a rewrite.

## Flow

`/` role gate → **Business** → `/business/login` (or `/business/register`) → `/business/app/*`

`RoleProtectedRoute` reads the `user_role` claim already decoded from the JWT — no
database round-trip after sign-in, so there's no flash of the wrong layout. A `tourist`
claim that lands on a business route is bounced back to the tourist app.

## Registration

Split screen: three-step form on the left, live panel on the right. The panel rotates
four line-drawn plates (Shaniwar Wada, Aga Khan Palace, Sinhagad, Metro Line 1), each
carrying a real figure. They're drawn as SVG rather than photographed so there's no
remote image host, no licensing question, and no stock-photo look — and the panel argues
for the product while someone fills in the form. Auto-advances every 6s, pauses on
hover, respects `prefers-reduced-motion`, and the dots are keyboard-reachable.

The three steps are identity → location → offering. Location and capacity aren't
decoration: the 1.5 km demand radius is drawn from the pin, and capacity is what turns
a crowd forecast into an actual recommendation.

## Dashboard modules (from §"The Business Flow" of the research file)

| Module | File | Notes |
|---|---|---|
| Ledger strip | `components/LedgerStrip.jsx` | Footfall, peak window, dominant segment, spillover index |
| Hyper-local demand forecast | `components/DemandAreaChart.jsx` | Recharts area, `<linearGradient>` in `<defs>`, segment toggles, peak `ReferenceLine` |
| Visitor profiling / comfort index | `components/ComfortBarChart.jsx` | Sharp bars, `activeBar` outline, non-active cells dim to 0.4 |
| Street-level foot traffic | `components/FootTrafficHeat.jsx` | Gaussian KDE surface, palette ramp teal → turmeric → brick, hour scrubber |
| AI opportunity ledger | `components/OpportunityCard.jsx` | Source Serif 4 prose, named signal, confidence bar, add-to-plan state |
| Conditions on your block | `pages/DemandOverview.jsx` | Crowdsourced civic alerts, severity-keyed |

Charts follow the blueprint's Recharts rules: transparent backgrounds, `CartesianGrid`
at `#3A3F3C` with `strokeDasharray="0"`, no radius on any bar, IBM Plex Sans tick text,
and a paper-label tooltip with a Source Serif 4 header. `ResponsiveContainer` uses the
`aspect` prop rather than a flexed height — the ResizeObserver intermittently measures 0
inside grid parents in React 18, which would blank a chart mid-demo.

### About MapLibre / deck.gl

`FootTrafficHeat` is the slot for deck.gl's `HeatmapLayer` over a restyled MapLibre
basemap: same weighted points, same palette ramp, same 1.5 km clip. It's drawn on a 2D
canvas so the module carries zero WebGL dependency until Person 4's live ping feed
exists — replace the body of that one component, not its callers. When you do, keep the
cleanup discipline the blueprint calls for: `map.remove()` in the effect's return, an
`isMounted` ref guarding every async `setState`, and a `webglcontextlost` handler. The
H3 hexagon layer belongs to the Authority view, which isn't in this build.

## Data

`data/client.js` is the single read path. With `VITE_USE_MOCK=1` (default) it serves
`data/mock.js` so the UI is fully demoable today; flip it off and the same components
read Person 3's FastAPI endpoints:

```
GET /api/business/demand?scenario=&radius_km=
GET /api/business/opportunities?scenario=
POST /api/business/opportunities/:id/accept
```

Keep the response shapes in `mock.js` as the contract when those land.

## Run it

```bash
npm install
npm run dev
```

Set `VITE_USE_MOCK=0`, `VITE_API_BASE`, `VITE_BUSINESS_MODE` and `VITE_TOURIST_ORIGIN` as needed.

## Demo notes

- The Weekend / Weekday switch in the top bar re-runs every module at once — the
  segment mix genuinely inverts (family-led → commuter-led) and the opportunity ledger
  changes with it. It's the fastest way to show judges the dashboard is modelling
  something rather than displaying a fixture.
- Drag the hour scrubber on Foot traffic to show the wave arriving.
- "Add to plan" persists per browser, so a recommendation you accept stays accepted
  across a reload if you need to reset mid-presentation.
