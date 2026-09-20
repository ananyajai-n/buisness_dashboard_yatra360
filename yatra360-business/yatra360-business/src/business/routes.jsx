import { lazy } from "react";
import RoleProtectedRoute from "./auth/RoleProtectedRoute.jsx";

const BusinessLogin    = lazy(() => import("./pages/BusinessLogin.jsx"));
const BusinessRegister = lazy(() => import("./pages/BusinessRegister.jsx"));
const DashboardShell   = lazy(() => import("./components/DashboardShell.jsx"));
const DemandOverview   = lazy(() => import("./pages/DemandOverview.jsx"));
const VisitorProfiles  = lazy(() => import("./pages/VisitorProfiles.jsx"));
const FootTraffic      = lazy(() => import("./pages/FootTraffic.jsx"));
const Opportunities    = lazy(() => import("./pages/Opportunities.jsx"));
const Settings         = lazy(() => import("./pages/Settings.jsx"));

/**
 * Route objects, declared RELATIVE so they can be spliced in anywhere.
 *
 *   embedded:   <Route path="/business/*"> {businessRoutes} </Route>
 *   standalone: createBrowserRouter(businessRoutes)
 *
 * The only thing that changes between deployments is the parent path.
 */
export const businessRoutes = [
  { index: true, element: <BusinessLogin /> },
  { path: "login", element: <BusinessLogin /> },
  { path: "register", element: <BusinessRegister /> },
  {
    path: "app",
    element: (
      <RoleProtectedRoute allowedRoles={["business", "authority"]}>
        <DashboardShell />
      </RoleProtectedRoute>
    ),
    children: [
      { index: true, element: <DemandOverview /> },
      { path: "overview", element: <DemandOverview /> },
      { path: "visitors", element: <VisitorProfiles /> },
      { path: "footfall", element: <FootTraffic /> },
      { path: "opportunities", element: <Opportunities /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];

export const BUSINESS_NAV = [
  { to: "overview", label: "Demand overview" },
  { to: "visitors", label: "Visitor profiles" },
  { to: "footfall", label: "Foot traffic" },
  { to: "opportunities", label: "AI opportunities" },
  { to: "settings", label: "Settings" },
];
