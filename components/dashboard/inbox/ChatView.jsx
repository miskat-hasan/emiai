"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Video, Gift, Star } from "lucide-react";
import { IoIosAttach } from "react-icons/io";

const TrophySVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C11.172 2 10.5 2.672 10.5 3.5V4H6.5C5.672 4 5 4.672 5 5.5C5 7.985 6.82 10 9.174 10.488C9.678 11.371 10.5 12 11.5 12.374V14H10C8.895 14 8 14.895 8 16V17C8 17.552 8.448 18 9 18H15C15.552 18 16 17.552 16 17V16C16 14.895 15.105 14 14 14H12.5V12.374C13.5 12 14.322 11.371 14.826 10.488C17.18 10 19 7.985 19 5.5C19 4.672 18.328 4 17.5 4H13.5V3.5C13.5 2.672 12.828 2 12 2Z" fill="currentColor"/>
  </svg>
);

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
    console.log("Sending:", inputText);
    setInputText("");
  };

  return (
    <div className="flex flex-col h-full gap-3 m-3">
      {/* Top Container: Header + Messages */}
      <div className="flex flex-col flex-1 bg-white rounded-[24px] overflow-hidden border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-gray-50/50">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          
          <div className="relative">
            {user.avatar.length > 2 ? (
              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                <Image 
                  src={user.avatar} 
                  alt={user.name} 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#125B50] text-white flex items-center justify-center font-bold text-sm">
                {user.avatar}
              </div>
            )}
            {user.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <button 
            onClick={onOpenInfo}
            className="font-bold text-gray-900 text-[15px] hover:text-primary transition-colors cursor-pointer text-left"
          >
            {user.name}
          </button>
        </div>

        <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer shadow-[0_4px_10px_rgba(239,68,68,0.2)]">
          <Video size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {messages.map((msg) => {
          const isSelf = msg.isSelf;
          return (
            <div key={msg.id} className={`flex w-full ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-[85%]`}>
                
                {/* Message row */}
                <div className={`flex items-start gap-3 w-full ${isSelf ? 'flex-row-reverse justify-start' : 'flex-row'}`}>
                  
                  {/* Avatar for other person's messages */}
                  {!isSelf && (
                    <div className="shrink-0">
                      {(msg.senderAvatar || user.avatar).length > 2 ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden relative shadow-sm">
                          <Image 
                            src={msg.senderAvatar || user.avatar} 
                            alt={msg.senderId || user.name} 
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#125B50] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {user.avatar}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Bubble */}
                  <div 
                    className={`
                      flex flex-col min-w-[280px] max-w-[85%]
                      ${isSelf 
                        ? 'bg-[#F9F9F9] rounded-[24px] rounded-tr-md border border-gray-100/60' 
                        : 'bg-gradient-to-b from-white via-white to-primary/10 rounded-[24px] rounded-tl-md border border-gray-50'
                      }
                    `}
                  >
                    <div className={`flex items-start justify-between px-5 pt-4 pb-4 gap-4 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                      <p className="text-[15px] text-gray-600 leading-relaxed font-medium">
                        {msg.text}
                      </p>
                      <Star 
                        size={20} 
                        className={`shrink-0 mt-0.5 ${msg.isStarred ? 'text-gray-400 fill-transparent' : 'text-gray-300'}`} 
                        strokeWidth={1.5} 
                      />
                    </div>
                    
                    <div className={`flex px-5 pb-4 ${isSelf ? 'justify-start' : 'justify-end'}`}>
                      <span className="text-[14px] text-gray-500 font-medium">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      </div>

      {/* Bottom Container: Input Area */}
      <div className="shrink-0 mt-auto w-full">
        <div className="flex flex-col bg-gradient-to-br from-[#FCFCFC] to-primary/10 border border-gray-200/80 rounded-[24px] p-5 shadow-sm">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type something.."
            rows={2}
            className="w-full bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-400 px-1 py-1 resize-none mb-6"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button className="bg-gradient-to-r from-primary to-secondary text-white p-2.5 rounded-[14px] hover:opacity-90 transition-opacity cursor-pointer shadow-sm">
                <Gift size={20} strokeWidth={2} />
              </button>
              <button className="*:text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                <IoIosAttach size={20} strokeWidth={2} />
              </button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                <TrophySVG />
              </button>
            </div>
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-primary to-secondary text-white px-7 py-3 rounded-[14px] text-[15px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/25"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
