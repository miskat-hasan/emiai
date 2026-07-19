"use client";

let scriptLoadingPromise = null;

function loadAppleScript() {
  if (typeof window === "undefined")
    return Promise.reject(new Error("No window"));
  if (window.AppleID) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Sign in with Apple"));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export async function signInWithApple() {
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  const redirectURI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

  if (!clientId || !redirectURI) {
    throw new Error(
      "Missing NEXT_PUBLIC_APPLE_CLIENT_ID or NEXT_PUBLIC_APPLE_REDIRECT_URI. Check your .env file.",
    );
  }

  await loadAppleScript();

  window.AppleID.auth.init({
    clientId,
    scope: "name email",
    redirectURI,
    usePopup: true,
  });

  try {
    const res = await window.AppleID.auth.signIn();
    const idToken = res?.authorization?.id_token;
    if (!idToken) throw new Error("Apple sign-in did not return a token.");

    const givenName = res?.user?.name?.firstName ?? "";
    const familyName = res?.user?.name?.lastName ?? "";
    const email = res?.user?.email ?? "";

    return {
      idToken,
      username: [givenName, familyName].filter(Boolean).join(" "),
      email,
      avatar: "",
    };
  } catch (err) {
    if (err?.error === "popup_closed_by_user") {
      throw new Error("cancelled");
    }
    throw new Error(err?.error ?? "Apple sign-in failed.");
  }
}
