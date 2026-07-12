// Response permission keys are inconsistent between agencies (e.g. one agency
// returns "chat_with_client", another "chat_permission" for the same thing).
// `aliases` covers both so the card renders correctly either way.
export const PERMISSION_DEFS = [
  {
    key: "chat",
    label: "Chat permission",
    aliases: ["chat_with_client", "chat_permission"],
  },
  {
    key: "portfolio",
    label: "Portfolio permission",
    aliases: ["portfolio_permission"],
  },
  {
    key: "voucher",
    label: "Voucher add permission",
    aliases: ["voucher_add_permission"],
  },
  {
    key: "deal",
    label: "Deal manage permission",
    aliases: ["deal_manage_permission"],
  },
  {
    key: "event",
    label: "Create Event/Contest permission",
    aliases: ["create_event_permission"],
  },
];

export function getActivePermissionLabels(permissions) {
  if (!permissions) return [];
  return PERMISSION_DEFS.filter(def =>
    def.aliases.some(alias => permissions[alias] === true),
  ).map(def => def.label);
}
