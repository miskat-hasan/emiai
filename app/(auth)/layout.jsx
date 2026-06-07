import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* ── Left panel — orange graphic ── */}
      <div className="hidden lg:flex w-[46%] shrink-0 p-5 xl:p-7">
        <div
          className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[36px] shadow-xl"
          style={{
            background: "linear-gradient(145deg, #FF7A1A 0%, #E54500 100%)",
          }}
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, #FFB347 0%, transparent 60%)",
            }}
          />

          {/* R logo mark */}
          <div className="relative z-10 w-[68%] max-w-[400px] aspect-square">
            <Image
              src="/images/R-logo.png"
              alt="ReelUp"
              fill
              priority
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-12 xl:px-20">
        <div className="w-full max-w-[430px] flex flex-col items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/images/R-logo.png"
                alt="R"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative h-8 w-28">
              <Image
                src="/images/ReelUP-logo.png"
                alt="ReelUP"
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Page-specific form */}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
