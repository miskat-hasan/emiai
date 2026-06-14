"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

// ─── Stat card in modal ───────────────────────────────────────────────────────

function StatBox({ label, value }) {
  return (
    <div className="bg-secondary/80 rounded-xl p-3 text-white text-center">
      <p className="text-xs opacity-80 mb-1">{label}</p>
      <p className="text-base font-bold leading-tight">{value}</p>
    </div>
  );
}

// ─── Call Anthropic API to generate prediction ────────────────────────────────

async function fetchPrediction(influencer) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are an AI marketing analyst. Generate a performance prediction for this influencer collaboration:

Influencer: ${influencer.name}
Followers: ${influencer.followers}
Rate: ${influencer.rate}
Platforms: ${influencer.platforms?.join(", ")}

Return ONLY a JSON object (no markdown, no backticks) with this exact structure:
{
  "estimateReach": "456k-1.2M Views",
  "estimatedEngagement": "1.2%-1.8%",
  "potentialROI": "Good",
  "keySuccessFactors": ["factor 1", "factor 2", "factor 3"],
  "potentialRisks": ["risk 1", "risk 2", "risk 3"]
}`,
        },
      ],
    }),
  });

  const data = await res.json();
  const text = data?.content?.[0]?.text?.trim() ?? "";
  // Strip any accidental markdown fences
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function AIPredictionModal({ open, onClose, influencer }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !influencer) return;
    setPrediction(null);
    setError(null);
    setLoading(true);

    fetchPrediction(influencer)
      .then(setPrediction)
      .catch(() => setError("Failed to generate prediction. Please try again."))
      .finally(() => setLoading(false));
  }, [open, influencer]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header — teal gradient matching screenshot */}
        <div className="bg-gradient-to-br from-[#0A5C6B] to-[#0A8C9A] px-6 pt-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={14} />
          </button>
          <h2 className="text-lg font-bold text-white text-center">
            AI Performance Prediction
          </h2>

          {loading ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <p className="text-white/80 text-sm">Analyzing performance...</p>
            </div>
          ) : error ? (
            <div className="py-4 text-center">
              <p className="text-white/80 text-sm">{error}</p>
            </div>
          ) : prediction ? (
            <div className="grid grid-cols-3 gap-2 mt-4">
              <StatBox
                label="Estimate Reach"
                value={prediction.estimateReach}
              />
              <StatBox
                label="Estimated Engagement"
                value={prediction.estimatedEngagement}
              />
              <StatBox label="Potential ROI" value={prediction.potentialROI} />
            </div>
          ) : null}
        </div>

        {/* Body */}
        {prediction && !loading && (
          <div className="px-6 py-5 space-y-5">
            {/* Key Success Factors */}
            <div>
              <h3 className="text-sm font-bold text-[#203430] mb-3 flex items-center gap-2">
                <TrendingUp size={15} className="text-secondary" />
                Key Success Factors
              </h3>
              <ul className="space-y-2.5">
                {prediction.keySuccessFactors.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={15}
                      className="text-secondary shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-[#63716E] leading-relaxed">
                      {f}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Potential Risks */}
            <div>
              <h3 className="text-sm font-bold text-[#203430] mb-3 flex items-center gap-2">
                <AlertTriangle size={15} className="text-red-400" />
                Potential Risks
              </h3>
              <ul className="space-y-2.5">
                {prediction.potentialRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <AlertTriangle
                      size={14}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-[#63716E] leading-relaxed">
                      {r}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
