import SessionProvider from "./SessionProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white">
      <head>
        <title>Jedipw - PII Data Detector</title>
        <link rel="icon" type="image/png" href="/write.png"></link>
      </head>
      <body className="h-full">
        <SessionProvider>
            {children}
        </SessionProvider>
      </body>
    </html>
  );
}
