import "./globals.css";

export const metadata = {
  title: "CG Industrial Investment Assistant",
  description: "Secure Chhattisgarh Industrial Investment chatbot built with Next.js and Anthropic.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
