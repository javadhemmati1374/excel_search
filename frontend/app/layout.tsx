import localFont from "next/font/local";
import "./globals.css";

const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Regular.woff2",
  variable: "--font-vazirmatn",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`font-vazirmatn ${vazirmatn.variable}`}
    >
      <body className="bg-white text-gray-900 min-h-screen">
        <main className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
