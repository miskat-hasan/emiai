// lib/socialAuth.js
// Next.js can only statically replace process.env.NEXT_PUBLIC_* when the
// full reference appears literally in the source — no dynamic/bracket access.
const CLIENT_IDS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || "",
  tiktok: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || "",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  snapchat: process.env.NEXT_PUBLIC_SNAPCHAT_CLIENT_ID || "",
  youtube: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
};

export const SOCIAL_PLATFORMS = {
  instagram: {
    name: "Instagram",
    authUrl: "https://api.instagram.com/oauth/authorize",
    scope: "user_profile",
  },
  tiktok: {
    name: "TikTok",
    authUrl: "https://www.tiktok.com/v2/auth/authorize",
    scope: "user.info.basic",
  },
  facebook: {
    name: "Facebook",
    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    scope: "public_profile",
  },
  snapchat: {
    name: "Snapchat",
    authUrl: "https://accounts.snapchat.com/accounts/oauth2/auth",
    scope: "user.display_name",
  },
  youtube: {
    name: "YouTube",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
  },
};

function buildAuthorizeUrl(platformKey, redirectUri) {
  const cfg = SOCIAL_PLATFORMS[platformKey];
  const clientId = CLIENT_IDS[platformKey];

  if (!clientId) {
    throw new Error(
      `Missing client ID for ${cfg.name}. Check your .env file and restart the dev server.`,
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: cfg.scope,
    state: platformKey,
  });

  return `${cfg.authUrl}?${params.toString()}`;
}

export function openSocialOAuthPopup(platformKey) {
  return new Promise((resolve, reject) => {
    const cfg = SOCIAL_PLATFORMS[platformKey];
    if (!cfg) {
      reject(new Error("Unknown platform"));
      return;
    }

    const redirectUri = `${window.location.origin}/onboarding/social/callback/${platformKey}`;

    let authorizeUrl;
    try {
      authorizeUrl = buildAuthorizeUrl(platformKey, redirectUri);
    } catch (err) {
      reject(err);
      return;
    }

    const width = 480;
    const height = 640;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authorizeUrl,
      `${cfg.name}-connect`,
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      reject(new Error("Popup blocked. Please allow popups for this site."));
      return;
    }

    let pollTimer;

    const handleMessage = event => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "social-oauth-callback") return;
      if (event.data.platform !== platformKey) return;

      window.removeEventListener("message", handleMessage);
      clearInterval(pollTimer);

      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve({ platform: platformKey, code: event.data.code });
      }
    };

    window.addEventListener("message", handleMessage);

    pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer);
        window.removeEventListener("message", handleMessage);
        reject(new Error("cancelled"));
      }
    }, 500);
  });
}
