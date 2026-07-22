// components/dashboard/smart-feed/SmartFeedPage.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, RotateCcw, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetSmartFeedSuggestionMutation,
  useGetSmartFeedHistoryQuery,
} from "@/redux/api/services/smartFeedApi";
import SmartFeedResult from "./SmartFeedResult";
import GoalDropdown from "./GoalDropdown";

export const smartFeedContent = {
  title: "Looking for inspiration",
  description:
    "Set your goal, and let AI suggest content ideas, trending topics, and collaboration opportunities to keep your audience engaged.",
  placeholder: "Ask me anything...",
};

export const smartFeedGoals = [
  { id: 1, label: "Grow", value: "grow" },
  { id: 2, label: "Boost", value: "boost" },
  { id: 3, label: "Monetize", value: "monetize" },
];

let idCounter = 0;
const nextId = () => `sf-${Date.now()}-${idCounter++}`;

export default function SmartFeedPage() {
  const [activeGoal, setActiveGoal] = useState("grow");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState([]);
  const [hasSeededHistory, setHasSeededHistory] = useState(false);
  const scrollRef = useRef(null);

  const { data: historyResponse, isLoading: isLoadingHistory } =
    useGetSmartFeedHistoryQuery(1);
  const [getSuggestion, { isLoading: isGenerating }] =
    useGetSmartFeedSuggestionMutation();

  useEffect(() => {
    if (hasSeededHistory || !historyResponse?.data?.data) return;

    const historyEntries = [...historyResponse.data.data]
      .reverse()
      .map(item => ({
        id: `history-${item.id}`,
        goal: item.goal,
        message: item.message,
        status: "done",
        result: {
          ideas: item.ideas,
          trending_topics: item.trending_topics,
          tip: item.tip,
        },
      }));

    setEntries(prev => [...historyEntries, ...prev]);
    setHasSeededHistory(true);
  }, [historyResponse, hasSeededHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [entries]);

  const runSuggestion = async (goal, msg, entryId) => {
    try {
      const response = await getSuggestion({ goal, message: msg }).unwrap();
      setEntries(prev =>
        prev.map(e =>
          e.id === entryId
            ? { ...e, status: "done", result: response?.data }
            : e,
        ),
      );
    } catch (error) {
      setEntries(prev =>
        prev.map(e =>
          e.id === entryId
            ? {
                ...e,
                status: "error",
                error:
                  error?.data?.message ||
                  "Failed to generate ideas. Please try again.",
              }
            : e,
        ),
      );
    }
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please write something first");
      return;
    }
    if (isGenerating) return;

    const msg = message.trim();
    const goal = activeGoal;
    const entryId = nextId();

    setEntries(prev => [
      ...prev,
      { id: entryId, goal, message: msg, status: "loading" },
    ]);
    setMessage("");
    runSuggestion(goal, msg, entryId);
  };

  const handleRetry = entryId => {
    if (isGenerating) return;
    const target = entries.find(e => e.id === entryId);
    if (!target) return;
    setEntries(prev =>
      prev.map(e =>
        e.id === entryId ? { ...e, status: "loading", error: null } : e,
      ),
    );
    runSuggestion(target.goal, target.message, entryId);
  };

  const hasStarted = entries.length > 0 || isLoadingHistory;

  return (
    <section className="flex h-[calc(100vh-96px)] w-full flex-col bg-[linear-gradient(180deg,_#FFFFFF_0%,_#FFFFFF_58%,_#FFF6EE_100%)] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[820px] flex-1 flex-col min-h-0">
        {/* Scrollable thread */}
        <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto py-8">
          {!hasStarted ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <h1 className="mb-3 text-[30px] font-medium leading-tight tracking-[0.02em] text-[#202326] sm:text-[34px]">
                {smartFeedContent.title}
              </h1>
              <p className="mx-auto max-w-[575px] text-[13px] font-medium leading-[1.6] tracking-[0.01em] text-[#737D7A] sm:text-[14px]">
                {smartFeedContent.description}
              </p>

              <div className="mx-auto mt-9 grid w-full max-w-[700px] grid-cols-1 gap-3 sm:grid-cols-3">
                {smartFeedGoals.map(goal => {
                  const isActive = activeGoal === goal.value;
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setActiveGoal(goal.value)}
                      className={`h-[52px] rounded-[9px] border bg-white text-[15px] font-medium text-[#202326] transition-all duration-300 ${
                        isActive
                          ? "border-primary text-primary shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                          : "border-[#E7E7E7] hover:border-primary hover:text-primary"
                      }`}
                    >
                      {goal.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : isLoadingHistory ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map(entry => (
                <div key={entry.id} className="space-y-3">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gradient-to-br from-primary to-secondary px-5 py-3 text-white shadow-sm">
                      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-white/70">
                        Goal: {entry.goal}
                      </p>
                      <p className="text-sm">{entry.message}</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="w-full">
                      {entry.status === "loading" ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#ECECEC] bg-[#FBFBFB] py-14">
                          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          <p className="text-sm text-[#63716E]">
                            Coming up with ideas...
                          </p>
                        </div>
                      ) : entry.status === "error" ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#ECECEC] bg-[#FBFBFB] py-10 text-center">
                          <p className="text-sm text-red-500">{entry.error}</p>
                          <button
                            onClick={() => handleRetry(entry.id)}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <RotateCcw size={13} /> Try again
                          </button>
                        </div>
                      ) : (
                        <SmartFeedResult result={entry.result} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky input, outside the scroll area */}
        <div className="shrink-0 w-full pb-[30px] pt-3 sm:pb-[38px]">
          <div className="relative rounded-[8px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.025)]">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder={smartFeedContent.placeholder}
              rows={hasStarted ? 2 : 3}
              className="w-full resize-none rounded-t-[8px] border border-transparent bg-transparent px-4 pt-4 text-[13px] font-medium leading-relaxed text-[#202326] outline-none placeholder:text-[#6F7774] focus:border-[#F57802]/40"
            />

            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              {hasStarted ? (
                <GoalDropdown
                  goals={smartFeedGoals}
                  value={activeGoal}
                  onChange={setActiveGoal}
                />
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isGenerating || !message.trim()}
                className="flex h-[29px] w-[29px] items-center justify-center rounded-[8px] bg-gradient-to-r from-primary to-secondary text-white transition-all duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                aria-label="Send smart feed message"
              >
                <ArrowUpRight size={14} strokeWidth={2.4} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
