import { countries } from "countries-list";

// countries-list stores codes without the leading "+", so it's added here.
export function getCallingCode(isoAlpha2) {
  if (!isoAlpha2) return "";
  const entry = countries[isoAlpha2];
  return entry?.phone ? `+${entry.phone}` : "";
}
