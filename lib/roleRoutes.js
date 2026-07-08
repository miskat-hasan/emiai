export const ROLE_ROUTES = {
  influencer: "/dashboard/influencer",
  advertiser: "/dashboard/advertiser",
  agency: "/dashboard/agency",
  business_manager: "/dashboard/business_manager",
  guest: "/dashboard/guest/explore",
};

export function getRoleHomeRoute(role) {
  return ROLE_ROUTES[role] ?? "/dashboard";
}
