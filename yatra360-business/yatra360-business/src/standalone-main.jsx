/**
 * STANDALONE MODE — entry point if the Business console ships as its own
 * deployment (business.yatra360.in). Build with VITE_BUSINESS_MODE=standalone.
 * No component changes; the routes mount at "/" instead of "/business".
 */
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { BusinessAuthProvider, businessRoutes, mockAdapter } from "./business/index.js";

const router = createBrowserRouter(businessRoutes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BusinessAuthProvider adapter={mockAdapter()}>
      <Suspense fallback={<div className="y-boot">Loading…</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </BusinessAuthProvider>
  </StrictMode>
);
