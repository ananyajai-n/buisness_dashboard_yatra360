/** Public surface of the Business module. Import nothing else from outside. */
export { businessRoutes, BUSINESS_NAV } from "./routes.jsx";
export { BusinessAuthProvider, useBusinessAuth } from "./auth/AuthContext.jsx";
export { default as RoleProtectedRoute } from "./auth/RoleProtectedRoute.jsx";
export { supabaseAdapter, mockAdapter } from "./auth/adapters.js";
export { businessPath, MODE, BASE } from "./config.js";
import "./styles/tokens.css";
import "./styles/business.css";
