"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getStoredToken, clearAuthSession } from "@/lib/auth-storage";

let echoInstance = null;

function handleUnauthorized() {
  // A 401 here means the token is missing/expired/invalid — retrying the
  // same request forever (pusher-js's default behavior) just spams the
  // endpoint. Treat it the same as an API 401: clear the session and bounce
  // to login, mirroring whatever apiSlice's baseQuery already does on 401.
  teardownEcho();
  clearAuthSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export function getEcho() {
  if (typeof window === "undefined") return null;
  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 80,
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "https") === "https",
    enabledTransports: ["ws", "wss"],
    authorizer: channel => ({
      authorize: (socketId, callback) => {
        const token = getStoredToken();

        // No token yet — fail fast locally instead of sending
        // "Authorization: Bearer null" to the server. This is the fix for
        // the exact bug in the screenshot.
        if (!token) {
          callback(true, { error: "Not authenticated" });
          return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/broadcasting/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        })
          .then(res => {
            if (res.status === 401) {
              handleUnauthorized();
              throw new Error("Broadcast auth: unauthorized");
            }
            if (!res.ok)
              throw new Error(`Broadcast auth failed: ${res.status}`);
            return res.json();
          })
          .then(data => callback(false, data))
          .catch(err => callback(true, err));
      },
    }),
  });

  // Temporary — remove once real-time is confirmed stable. This makes
  // connection failures visible instead of silently doing nothing.
  const pusher = echoInstance.connector.pusher;
  pusher.connection.bind("state_change", states => {
    console.log(`[Echo] ${states.previous} -> ${states.current}`);
  });
  pusher.connection.bind("error", err => {
    console.error("[Echo] connection error:", err);
  });

  return echoInstance;
}

// Call after a successful login so any pre-login socket state (there
// shouldn't be any now, but belt-and-suspenders) doesn't linger, and the
// next getEcho() call builds fresh.
export function rebuildEcho() {
  teardownEcho();
  return getEcho();
}

export function teardownEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
