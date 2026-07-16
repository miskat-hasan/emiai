"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMarkMessagesSeenMutation } from "@/redux/api/services/chatApi";

// Marks messages seen once they've actually been visible for a moment, using
// IntersectionObserver — not just "loaded". Batches ids and flushes once per
// BATCH_DELAY_MS so fast scrolling doesn't fire a request per message.
const BATCH_DELAY_MS = 800;
const VISIBILITY_THRESHOLD = 0.6;

export function useMarkMessagesSeenOnView(conversationId) {
  const [markMessagesSeen] = useMarkMessagesSeenMutation();
  const observerRef = useRef(null);
  const pendingIdsRef = useRef(new Set());
  const seenIdsRef = useRef(new Set());
  const flushTimerRef = useRef(null);

  const flush = useCallback(() => {
    if (pendingIdsRef.current.size === 0) return;
    const ids = Array.from(pendingIdsRef.current);
    pendingIdsRef.current.clear();
    markMessagesSeen({
      message_ids: ids,
      conversation_id: conversationId,
    }).catch(() => {});
  }, [conversationId, markMessagesSeen]);

  useEffect(() => {
    seenIdsRef.current = new Set();
    pendingIdsRef.current = new Set();

    observerRef.current = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = Number(entry.target.dataset.messageId);
          const isMine = entry.target.dataset.isMine === "true";
          if (!id || isMine || seenIdsRef.current.has(id)) return;

          seenIdsRef.current.add(id);
          pendingIdsRef.current.add(id);
          observerRef.current?.unobserve(entry.target);

          clearTimeout(flushTimerRef.current);
          flushTimerRef.current = setTimeout(flush, BATCH_DELAY_MS);
        });
      },
      { threshold: VISIBILITY_THRESHOLD },
    );

    return () => {
      observerRef.current?.disconnect();
      clearTimeout(flushTimerRef.current);
    };
  }, [conversationId, flush]);

  const observeMessage = useCallback(el => {
    if (el && observerRef.current) observerRef.current.observe(el);
  }, []);

  return observeMessage;
}
