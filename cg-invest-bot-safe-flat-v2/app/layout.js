import "./globals.css";

export const metadata = {
  title: "CG Investment Assistant",
  description: "Investor-facing Chhattisgarh industrial investment assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
