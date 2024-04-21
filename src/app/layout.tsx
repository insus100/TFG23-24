import Providers from "./Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@smastrom/react-rating/style.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sci Event",
  description: "Tu gestor de eventos científicos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className='dark'>
        <body>
          <Providers>{children}</Providers>
        </body>
      </html>
  );
}
