import Image from "next/image";

export default function PageLoader({ className = "" }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        backgroundColor: "#fff",
        opacity: 0,
        animation: "pfFadeIn 0.3s ease-out forwards",
      }}
      className={className}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer ring track */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "2px solid rgba(0,0,0,0.1)",
            position: "absolute",
          }}
        />
        {/* Spinning ring */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "#000",
            position: "absolute",
            animation: "pfSpin 0.8s linear infinite",
          }}
        />
        {/* Center logo */}
        <Image
          src="/logo.png"
          alt="Logo"
          width={28}
          height={28}
          style={{ objectFit: "contain", zIndex: 10, position: "relative" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.25rem",
          marginTop: "0.75rem",
        }}
      >
        <span
          style={{
            color: "#000",
            fontWeight: 600,
            letterSpacing: "0.1em",
            fontSize: "0.875rem",
            textTransform: "uppercase",
          }}
        >
          Marketing Agency
        </span>
        {/* Loading bar track */}
        <div
          style={{
            width: 128,
            height: 2,
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 9999,
            overflow: "hidden",
            marginTop: "0.25rem",
          }}
        >
          {/* Animated loading bar */}
          <div
            style={{
              height: "100%",
              backgroundColor: "#000",
              borderRadius: 9999,
              animation: "pfLoad 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes pfFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pfSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes pfLoad {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}