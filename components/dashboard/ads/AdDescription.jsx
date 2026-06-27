import React from "react";

export default function AdDescription({ description }) {
  return (
    <div className="h-full">
      <div className="text-sm text-gray leading-relaxed space-y-4">
        {Array.isArray(description) ? (
          description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : (
          <p>{description}</p>
        )}
      </div>
    </div>
  );
}
