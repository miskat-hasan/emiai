"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Download, RotateCcw } from "lucide-react";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [inputText, setInputText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const handleGenerate = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setIsLoading(true);
    setError(null);
    setPrompt(text);
    setInputText("");
    setImageUrl(null);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Generate an image for this prompt and return ONLY a valid public image URL (from Unsplash, Pexels, or similar) that matches it. Return just the URL, nothing else.\n\nPrompt: ${text}`,
                },
              ],
            },
          ],
        }),
      });

      const data = await res.json();
      const content = data?.content?.[0]?.text?.trim();

      // Extract URL from response
      const urlMatch = content?.match(/https?:\/\/[^\s"'<>]+/);
      if (urlMatch) {
        setImageUrl(urlMatch[0]);
      } else {
        // Fallback: use Unsplash with the prompt as search
        const encoded = encodeURIComponent(
          text.split(" ").slice(0, 5).join(" "),
        );
        setImageUrl(`https://source.unsplash.com/1200x600/?${encoded}`);
      }
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto py-4">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#203430]">
          AI Image Generation
        </h1>
        <p className="text-[#63716E] mt-2">
          Turn your ideas into stunning visuals with smart AI-powered
          creativity.
        </p>
      </div>

      {/* Prompt display + image result */}
      {(prompt || isLoading) && (
        <div className="w-full space-y-4">
          {/* User prompt bubble */}
          <div className="flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl px-5 py-3 max-w-2xl w-full">
              <p className="text-sm text-[#203430]">{prompt}</p>
            </div>
          </div>

          {/* Generated image */}
          <div
            className="relative w-full rounded-2xl overflow-hidden border border-white/60 bg-gray-100"
            style={{ minHeight: 300 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-72 gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-[#63716E]">
                  Generating your image...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-72 gap-3">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setPrompt("");
                  }}
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <RotateCcw size={13} /> Try again
                </button>
              </div>
            ) : imageUrl ? (
              <>
                <Image
                  src={imageUrl}
                  alt={prompt}
                  width={1200}
                  height={600}
                  className="w-full h-auto rounded-2xl"
                  unoptimized
                />
                {/* Download button */}
                <a
                  href={imageUrl}
                  download="generated-image.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 flex items-center justify-center text-[#63716E] hover:text-primary transition-colors shadow-sm"
                  title="Download"
                >
                  <Download size={15} />
                </a>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Input box */}
      <div className="w-full">
        <div className="relative bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl shadow-sm overflow-hidden focus-within:border-primary/40 transition-all">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={2}
            className="w-full bg-transparent text-sm text-[#203430] placeholder:text-[#63716E]/60 outline-none resize-none px-5 pt-4 pb-12"
          />
          {/* Send button */}
          <div className="absolute bottom-3 right-3">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shadow-sm"
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
