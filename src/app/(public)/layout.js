import { Inter, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReduxProvider from "@/redux/Providers";

/* 🧩 Font Configurations */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "ColorFact — Serving Harmony",
  description:
    "Discover minimalist design and harmony in fashion. Import articles, choose your color, and explore modern aesthetics with ColorFact.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="font-sans scroll-smooth ">
        {/* ✅ All client logic is wrapped inside ReduxProvider */}
        <ReduxProvider>
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
