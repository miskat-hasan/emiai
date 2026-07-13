"use client";

import { useEffect, useRef } from "react";
import { getEcho } from "@/lib/echo";
import { getStoredToken } from "@/lib/auth-storage";

// Presence channel: conversation.{id} — gives .here()/.joining()/.leaving()
// (who's currently in the conversation) plus custom events like
// .MessageEvent and .ConversationEvent.
export function usePresenceChannel(
  channelName,
  { here, joining, leaving, events } = {},
  deps = [],
) {
  const cbRef = useRef({ here, joining, leaving, events });
  cbRef.current = { here, joining, leaving, events };

  useEffect(() => {
    // Don't attempt a subscription without a token — this is what produced
    // "Authorization: Bearer null" previously. The authorizer in echo.js
    // also guards this, but failing here avoids even opening the socket
    // connection for a logged-out visitor.
    console.log(
      process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      process.env.NEXT_PUBLIC_REVERB_HOST,
    );

    console.log("[Echo] usePresenceChannel effect ran:", {
      channelName,
      hasToken: !!getStoredToken(),
    });
    if (!channelName || !getStoredToken()) return;
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.join(channelName);
    channel.error(err => {
      console.error(
        `[Echo] presence channel "${channelName}" auth error:`,
        err,
      );
    });

    if (cbRef.current.here)
      channel.here(members => cbRef.current.here?.(members));
    if (cbRef.current.joining)
      channel.joining(member => cbRef.current.joining?.(member));
    if (cbRef.current.leaving)
      channel.leaving(member => cbRef.current.leaving?.(member));

    Object.entries(cbRef.current.events ?? {}).forEach(
      ([eventName, handler]) => {
        // Leading dot required — broadcastAs() overrides the namespaced
        // event name, so Echo must be told to match it literally.
        channel.listen(`.${eventName}`, payload => handler(payload));
      },
    );

    return () => {
      echo.leave(channelName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, ...deps]);
}

// Private channel: user.{id} — targeted single-user notifications
// (e.g. added to a group, a DM from someone whose conversation isn't open).
export function usePrivateChannel(channelName, events = {}, deps = []) {
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    if (!channelName || !getStoredToken()) return;
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(channelName);

    Object.entries(eventsRef.current).forEach(([eventName, handler]) => {
      channel.listen(`.${eventName}`, payload => handler(payload));
    });

    return () => {
      echo.leave(channelName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, ...deps]);
}
