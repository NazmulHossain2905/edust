import { http, HttpResponse } from "msw";
import { apiUrlV0 } from "../../api-url";
import {
  organizationByIdDB,
  organizationsListDB,
  organizationsOrgRolesDB,
  organizationsRolesDB,
  organizationsSiteDataDB,
} from "./organization-db";
import { hasToken } from "../../../../has-token";

const getListOfOrg = http.get(`${apiUrlV0}/organizations`, ({ cookies }) => {
  hasToken(cookies.access_token);
  return HttpResponse.json(organizationsListDB);
});

const getListOfOrgById = http.get(`${apiUrlV0}/organizations/:id`, () => {
  return HttpResponse.json(organizationByIdDB);
});

const getOrganizationsRoles = http.get(
  `${apiUrlV0}/organizations/roles`,
  () => {
    return HttpResponse.json(organizationsRolesDB);
  },
);

const getOrganizationsOrgRoles = http.get(
  `${apiUrlV0}/organizations/:orgId/users/org-roles`,
  () => {
    return HttpResponse.json(organizationsOrgRolesDB);
  },
);

const getSiteBuilderMe = http.get(
  `${apiUrlV0}/organizations/site-builder/me`,
  ({ cookies }) => {
    hasToken(cookies.access_token);

    if (cookies.access_token !== "organizer") {
      return new HttpResponse(
        JSON.stringify({
          status: "error",
          message: "Unauthorized access",
        }),
        { status: 403 },
      );
    }

    return HttpResponse.json(organizationsSiteDataDB);
  },
);

export const organizations = [
  getListOfOrg,
  getSiteBuilderMe,
  getListOfOrgById,
  getOrganizationsRoles,
  getOrganizationsOrgRoles,
];
