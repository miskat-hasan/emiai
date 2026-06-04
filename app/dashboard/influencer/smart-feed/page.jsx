/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "react-toastify";
export const smartFeedContent = {
    title: "Looking for inspiration",
    description:
        "Set your goal, and let AI suggest content ideas, trending topics, and collaboration opportunities to keep your audience engaged.",
    placeholder: "Ask me anything...",
};

export const smartFeedGoals = [
    {
        id: 1,
        label: "Grow",
        value: "grow",
    },
    {
        id: 2,
        label: "Boost",
        value: "boost",
    },
    {
        id: 3,
        label: "Monetize",
        value: "monetize",
    },
];

export default function page() {
    const [activeGoal, setActiveGoal] = useState("grow");
    const [message, setMessage] = useState("");

    const handleSubmit = () => {
        if (!message.trim()) {
            toast.error("Please write something first");
            return;
        }

        const payload = {
            goal: activeGoal,
            message,
        };

        console.log("Smart feed request:", payload);
        toast.success("Smart feed request submitted");
        setMessage("");
    };

    return (
        <section className="min-h-[calc(100vh-96px)] w-full bg-[linear-gradient(180deg,_#FFFFFF_0%,_#FFFFFF_58%,_#FFF6EE_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-[820px] flex-col justify-between">
                <div className="pt-[90px] text-center sm:pt-[115px]">
                    <h1 className="mb-3 text-[30px] font-medium leading-tight tracking-[0.02em] text-[#202326] sm:text-[34px]">
                        {smartFeedContent.title}
                    </h1>

                    <p className="mx-auto max-w-[575px] text-[13px] font-medium leading-[1.6] tracking-[0.01em] text-[#737D7A] sm:text-[14px]">
                        {smartFeedContent.description}
                    </p>

                    <div className="mx-auto mt-9 grid max-w-[700px] grid-cols-1 gap-3 sm:grid-cols-3">
                        {smartFeedGoals.map((goal) => {
                            const isActive = activeGoal === goal.value;

                            return (
                                <button
                                    key={goal.id}
                                    type="button"
                                    onClick={() => setActiveGoal(goal.value)}
                                    className={`h-[52px] rounded-[9px] border bg-white text-[15px] font-medium text-[#202326] transition-all duration-300 ${isActive
                                        ? "border-[#E7E7E7] shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
                                        : "border-[#E7E7E7] hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {goal.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pb-[30px] sm:pb-[38px]">
                    <div className="relative mx-auto h-[96px] max-w-[712px] rounded-[8px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.025)]">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={smartFeedContent.placeholder}
                            className="h-full w-full resize-none rounded-[8px] border border-transparent bg-transparent px-4 py-4 pr-16 text-[13px] font-medium leading-relaxed text-[#202326] outline-none placeholder:text-[#6F7774] focus:border-[#F57802]/40"
                        />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="absolute bottom-5 right-4 flex h-[29px] w-[29px] items-center justify-center rounded-[8px] bg-gradient-to-r from-primary to-secondary text-white transition-all duration-300 hover:opacity-90"
                            aria-label="Send smart feed message"
                        >
                            <ArrowUpRight size={14} strokeWidth={2.4} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}