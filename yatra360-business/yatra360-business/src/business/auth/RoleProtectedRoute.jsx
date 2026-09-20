import { Navigate, useLocation } from "react-router-dom";
import { useBusinessAuth } from "./AuthContext.jsx";
import { businessPath, EXIT_TO_TOURIST } from "../config.js";

/**
 * Reads the role claim already decoded from the JWT — no database round-trip,
 * so there is no flash of the wrong layout.
 */
export default function RoleProtectedRoute({ allowedRoles = ["business"], children }) {
  const { session, role, ready } = useBusinessAuth();
  const loc = useLocation();

  if (!ready) return <div className="y-boot">Checking your access…</div>;
  if (!session) return <Navigate to={businessPath("login")} replace state={{ from: loc.pathname }} />;
  if (!allowedRoles.includes(role)) {
    // A tourist claim landing on a business route goes back to the tourist app.
    if (EXIT_TO_TOURIST.startsWith("http")) { window.location.href = EXIT_TO_TOURIST; return null; }
    return <Navigate to={EXIT_TO_TOURIST} replace />;
  }
  return children;
}
