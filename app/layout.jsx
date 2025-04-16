import "./globals.css";
import Footer from "@/components/commons/Footer";
import Header from "@/components/commons/Header";
import { Analytics } from "@vercel/analytics/react";
import AosInit from "@/components/commons/AosInit";
import GlobalProvider from "@/providers/global-provider";



export const metadata = {
  title: "Thalia Eats",
  description: "Thalia eats",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="scrollbar-thin scrollbar-thumb scrollbar-custom overflow-y-scroll"
            cz-shortcut-listen="true"
      >

        <GlobalProvider>
          <AosInit />
          <Header />
          <main className="min-h-screen bg-white">{children}</main>
          <Footer />
          <Analytics />
        </GlobalProvider>
      </body>
    </html>
  );
}
