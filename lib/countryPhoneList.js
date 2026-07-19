import { countries } from "countries-list";

// Built once at module load — {code, name, dial} for every country that
// actually has a dial code (countries-list has a couple of edge entries
// without one, e.g. Antarctica; filtered out since they'd break the picker).
export const COUNTRY_PHONE_LIST = Object.entries(countries)
  .filter(([, c]) => !!c.phone)
  .map(([code, c]) => ({
    code,
    name: c.name,
    dial: `+${c.phone}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export function findCountryByCode(isoAlpha2) {
  return COUNTRY_PHONE_LIST.find(c => c.code === isoAlpha2);
}
