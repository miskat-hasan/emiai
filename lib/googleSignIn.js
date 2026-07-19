"use client";

let scriptLoadingPromise = null;

function loadGoogleScript() {
  if (typeof window === "undefined")
    return Promise.reject(new Error("No window"));
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function signInWithGoogle() {
  return new Promise(async (resolve, reject) => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      reject(
        new Error(
          "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. Check your .env file.",
        ),
      );
      return;
    }

    try {
      await loadGoogleScript();
    } catch (err) {
      reject(err);
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: async tokenResponse => {
        if (!tokenResponse?.access_token) {
          reject(new Error("Google sign-in was cancelled or failed."));
          return;
        }
        try {
          const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            },
          );
          if (!res.ok) throw new Error("userinfo request failed");
          const profile = await res.json();
          resolve({
            idToken: tokenResponse.access_token,
            username: profile?.name ?? "",
            email: profile?.email ?? "",
            avatar: profile?.picture ?? "",
          });
        } catch {
          reject(new Error("Couldn't retrieve your Google profile."));
        }
      },
      error_callback: err => {
        if (err?.type === "popup_closed") {
          reject(new Error("cancelled"));
        } else {
          reject(
            new Error(
              "Google sign-in was blocked. Please allow popups for this site.",
            ),
          );
        }
      },
    });

    client.requestAccessToken();
  });
}
