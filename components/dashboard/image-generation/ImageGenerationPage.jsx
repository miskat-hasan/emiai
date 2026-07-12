"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Download, RotateCcw, Sparkles } from "lucide-react";

let idCounter = 0;
const nextId = () => `msg-${Date.now()}-${idCounter++}`;

export default function ImageGenerationPage({ role }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Auto-scroll to newest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const requestImage = async prompt => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          prompt,
        )}&per_page=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await res.json();

      return data.results?.[0]?.urls?.regular ?? null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const runGeneration = async (prompt, assistantId) => {
    setIsLoading(true);
    try {
      const imageUrl = await requestImage(prompt);
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? imageUrl
              ? { ...m, status: "done", imageUrl }
              : {
                  ...m,
                  status: "error",
                  error: "No matching image found. Try a different prompt.",
                }
            : m,
        ),
      );
    } catch (err) {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId
            ? {
                ...m,
                status: "error",
                error: "Something went wrong. Please try again.",
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText("");
    const userMsg = { id: nextId(), role: "user", text };
    const assistantId = nextId();
    const assistantMsg = {
      id: assistantId,
      role: "assistant",
      prompt: text,
      status: "loading",
    };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    runGeneration(text, assistantId);
  };

  const handleRetry = assistantId => {
    if (isLoading) return;
    const target = messages.find(m => m.id === assistantId);
    if (!target) return;
    setMessages(prev =>
      prev.map(m =>
        m.id === assistantId ? { ...m, status: "loading", error: null } : m,
      ),
    );
    runGeneration(target.prompt, assistantId);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-6rem)] max-w-3xl mx-auto py-4 font-dm-sans">
      {/* Heading */}
      <div className="text-center w-full flex flex-col items-start lg:items-center shrink-0">
        <p className="text-sm text-gray self-start lg:hidden mb-4">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Image Generation</span>
        </p>
        <h1 className="text-3xl font-bold text-[#203430]">
          AI Image Generation
        </h1>
        <p className="text-[#63716E] mt-2">
          Describe what you want to see, and keep refining it turn by turn.
        </p>
      </div>

      {/* Chat thread */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto mt-6 space-y-6 px-1 -mx-1"
      >
        {!hasMessages ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <p className="text-[#203430] font-medium">Nothing here yet</p>
            <p className="text-sm text-[#63716E] max-w-sm">
              Type a prompt below to generate your first image. Try something
              specific, like &quot;a golden retriever running on a beach at
              sunset.&quot;
            </p>
          </div>
        ) : (
          messages.map(msg =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-gradient-to-br from-primary to-secondary text-white rounded-2xl rounded-br-sm px-5 py-3 max-w-[80%] shadow-sm">
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[80%] w-full sm:w-auto">
                  <div
                    className="relative rounded-2xl rounded-bl-sm overflow-hidden border border-white/60 bg-white/70 backdrop-blur-sm"
                    style={{
                      minHeight: msg.status === "loading" ? 220 : "auto",
                    }}
                  >
                    {msg.status === "loading" ? (
                      <div className="flex flex-col items-center justify-center h-56 w-full sm:w-[420px] gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-sm text-[#63716E]">
                          Generating your image...
                        </p>
                      </div>
                    ) : msg.status === "error" ? (
                      <div className="flex flex-col items-center justify-center h-56 w-full sm:w-[420px] gap-3 px-4 text-center">
                        <p className="text-sm text-red-500">{msg.error}</p>
                        <button
                          onClick={() => handleRetry(msg.id)}
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
                        >
                          <RotateCcw size={13} /> Try again
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={getImageUrl(msg.imageUrl)}
                          alt={msg.prompt}
                          width={800}
                          height={500}
                          className="w-full h-auto sm:max-w-[420px]"
                          unoptimized
                        />
                        <a
                          href={msg.imageUrl}
                          download="generated-image.jpg"
                          target="_blank"
                          rel="noreferrer"
                          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center text-[#63716E] hover:text-primary transition-colors shadow-sm cursor-pointer"
                          title="Download"
                        >
                          <Download size={15} />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ),
          )
        )}
      </div>

      {/* Input box */}
      <div className="w-full shrink-0 pt-4">
        <div className="relative bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm overflow-hidden focus-within:border-primary/40 transition-all">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe an image..."
            rows={2}
            className="w-full bg-transparent text-sm text-[#203430] placeholder:text-[#63716E]/60 outline-none resize-none px-5 pt-4 pb-12"
          />
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-sm cursor-pointer"
            >
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-[#63716E]/60 text-center mt-2">
          Press Enter to generate · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
