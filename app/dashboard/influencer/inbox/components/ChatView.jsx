"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Video, Gift, Trophy, Star } from "lucide-react";

export default function ChatView({ chat, messages, onBack, onOpenInfo }) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = chat;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    // Handle sending message here (update local state or call API)
    console.log("Sending:", inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-50 shrink-0 bg-white z-10">
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          <button 
            onClick={onBack}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="relative">
            {user.avatar.length > 2 ? (
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden relative border border-gray-100">
                <Image 
                  src={user.avatar} 
                  alt={user.name} 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm lg:text-base">
                {user.avatar}
              </div>
            )}
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <button 
            onClick={onOpenInfo}
            className="font-bold text-gray-900 text-sm lg:text-base hover:text-primary transition-colors cursor-pointer text-left"
          >
            {user.name}
          </button>
        </div>

        <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30">
          <Video size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {messages.map((msg, index) => {
          const isSelf = msg.isSelf;
          return (
            <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                {isSelf && msg.isStarred && <Star size={14} className="text-gray-400 fill-gray-400" />}
                {!isSelf && msg.isStarred && <Star size={14} className="text-gray-400 fill-gray-400" />}
                
                {/* Message Bubble */}
                <div 
                  className={`
                    px-5 py-3.5 max-w-[85%] lg:max-w-[70%] text-[13px] lg:text-sm leading-relaxed
                    ${isSelf 
                      ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-gray-800 rounded-2xl rounded-tr-sm border border-primary/10' 
                      : 'bg-gray-50 text-gray-600 rounded-2xl rounded-tl-sm border border-gray-100/50'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
              <span className="text-[11px] text-gray-400 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-6 bg-white shrink-0 mt-auto">
        <div className="flex flex-col gap-3 bg-[#FDF8F5] border border-primary/10 rounded-2xl p-3">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type something.."
            className="w-full bg-transparent resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400 px-2 py-1 min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 pl-2 text-gray-400">
              <button className="hover:text-primary transition-colors bg-primary text-white p-1.5 rounded-lg shadow-sm shadow-primary/20">
                <Gift size={18} />
              </button>
              <button className="hover:text-primary transition-colors p-1.5">
                <Trophy size={20} />
              </button>
            </div>
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(240,90,40,0.2)]"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
