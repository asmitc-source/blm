import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    // Soft navigations: prefetch on hover/focus, keep loaders warm so clicks feel instant.
    defaultPreload: "intent",
    defaultPreloadDelay: 0,
    defaultStaleTime: 60_000,
    defaultPreloadStaleTime: 30_000,
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
  });
}
