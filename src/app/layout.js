import "./globals.css";

export const metadata = {
  title: "AdaptiveWeb - Network & Device Adaptive Web Dashboard",
  description: "Network- and Device-Adaptive Web Application presentation and control dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
