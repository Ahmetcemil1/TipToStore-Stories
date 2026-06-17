import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TipToStore Stories — Community-Funded Filecoin Storage",
  description: "Free to read, community-funded to survive. Publish stories on Filecoin. Readers tip in USDFC to keep them alive forever.",
  keywords: ["filecoin", "web3", "stories", "decentralized", "IPFS", "USDFC", "tipping", "storage"],
  openGraph: {
    title: "TipToStore Stories",
    description: "Read stories for free. Fund their existence on Filecoin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
