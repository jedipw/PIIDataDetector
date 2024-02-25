import SessionProvider from "./SessionProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <SessionProvider>
            {children}
        </SessionProvider>
      </body>
    </html>
  );
}
