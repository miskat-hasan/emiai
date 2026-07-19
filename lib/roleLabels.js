export const ROLE_LABELS = {
  influencer: "Influencer",
  advertiser: "Advertiser",
  agency: "Advertising Agency",
  business_manager: "Business Manager",
  guest: "Guest",
};

export function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? role ?? "—";
}

export const ROLE_FILTER_OPTIONS = [
  { value: "", label: "All" },
  ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
];
