/**
 * EMBEDDED MODE — how the main Yatra 360 app mounts the Business module.
 * Person 2 owns this file; the only Business import is the route array.
 */
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BusinessAuthProvider, businessRoutes, mockAdapter } from "../business/index.js";
import RoleGate from "./RoleGate.jsx";
// import { supabaseAdapter } from "../business/index.js";
// import { supabase } from "../lib/supabase";

const adapter = mockAdapter();            // swap for supabaseAdapter(supabase)

const renderRoutes = (routes, prefix = "") =>
  routes.map((r, i) => (
    <Route key={prefix + (r.path ?? i)} path={r.path} index={r.index} element={r.element}>
      {r.children ? renderRoutes(r.children, prefix + (r.path ?? "") + "/") : null}
    </Route>));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <BusinessAuthProvider adapter={adapter}>
        <Suspense fallback={<div className="y-boot">Loading…</div>}>
          <Routes>
            <Route path="/" element={<RoleGate />} />
            {/* Person 1 & 2's tourist routes live here: /plan, /itinerary, ... */}
            <Route path="/business">{renderRoutes(businessRoutes)}</Route>
          </Routes>
        </Suspense>
      </BusinessAuthProvider>
    </BrowserRouter>
  );
}
