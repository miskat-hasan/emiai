import "./globals.css";
import { DM_Sans } from "next/font/google";
import ReduxProvider from "@/provider/ReduxProvider";
import { ToastContainer } from "react-toastify";

// Fonts
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Metadata
export const metadata = {
  title: "Marketing Agency",
  description: "A modern marketing agency website.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body>
        <ReduxProvider>
          <ToastContainer autoClose={2000} pauseOnHover={false} />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
