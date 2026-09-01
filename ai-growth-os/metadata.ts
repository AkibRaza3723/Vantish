/** Vantish — SEO Metadata
 *  Domain: https://vantish.online
 *  For Next.js: import { aigosMetadata } from "../ai-growth-os/metadata" in app/layout.tsx
 *  For Vite/React: reference head-snippet.html instead
 */
export const aigosMetadata: Record<string, unknown> = {
  title: "Vantish — Anonymous Professional Confessions & Workplace Truth",
  description:
    "Vantish is the anonymous LinkedIn — share real workplace experiences, unfiltered office truths, and professional confessions without revealing your identity. Think Glassdoor meets Reddit.",
  keywords: [
    "anonymous LinkedIn",
    "workplace confessions",
    "office gossip",
    "professional network anonymous",
    "Glassdoor alternative",
    "work life truth",
    "career stories",
    "company culture",
    "anonymous professional platform",
  ],
  authors: [{ name: "Vantish", url: "https://vantish.online" }],
  alternates: {
    canonical: "https://vantish.online/",
  },
  openGraph: {
    type: "website",
    siteName: "Vantish",
    title: "Vantish — The Anonymous LinkedIn. Real Work. No Filter.",
    description:
      "Share unfiltered workplace truths anonymously. Gossip, ground realities, and professional confessions — all without revealing who you are. The anti-LinkedIn.",
    url: "https://vantish.online/",
    images: [
      {
        url: "https://vantish.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vantish — The Anonymous LinkedIn",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vantishapp",
    title: "Vantish — The Anonymous LinkedIn. Real Work. No Filter.",
    description:
      "Share unfiltered workplace truths anonymously. Gossip, ground realities, and professional confessions — all without revealing who you are.",
    images: ["https://vantish.online/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default aigosMetadata;
