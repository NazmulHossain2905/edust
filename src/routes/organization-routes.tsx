import {
  CreateOrganization,
  Dashboard,
  Site,
  SiteEdit,
} from "@/organizations/features";
import { Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "@/components/loading";
import IsAuthenticated from "./is-authenticated";
import { Role } from "@/types";
import { AppShell } from "@/organizations";

export const organizationRoutes = (
  <Route>
    <Route
      path="/"
      element={
        <IsAuthenticated role={Role.OWNER}>
          <Suspense fallback={<Loading.Spinner />}>
            <AppShell />
          </Suspense>
        </IsAuthenticated>
      }
    >
      <Route path="" element={<Dashboard />} />
      <Route
        path="site"
        element={
          <Suspense fallback={<Loading.Spinner />}>
            <Site />
          </Suspense>
        }
      />
      <Route
        path="settings"
        element={
          <Suspense fallback={<Loading.Spinner />}>
            <h1>Setting</h1>
          </Suspense>
        }
      />
    </Route>
    <Route
      path="/site/edit"
      element={
        <Suspense fallback={<Loading.Spinner />}>
          <SiteEdit />
        </Suspense>
      }
    />

    <Route
      path="/create"
      element={
        <IsAuthenticated>
          <Suspense fallback={<Loading.Spinner />}>
            <CreateOrganization />
          </Suspense>
        </IsAuthenticated>
      }
    />
  </Route>
);
