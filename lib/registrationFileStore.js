// File objects can't survive JSON.stringify + sessionStorage, which is how
// the rest of the registration flow persists data between steps. This
// module-level store holds the actual File in memory for the duration of
// the SPA session — same lifetime constraint as sessionStorage here (lost
// on a hard refresh), so behavior is consistent with the rest of the flow.
let files = {};

export function setRegistrationFile(key, file) {
  files[key] = file;
}

export function getRegistrationFile(key) {
  return files[key];
}

export function clearRegistrationFiles() {
  files = {};
}
