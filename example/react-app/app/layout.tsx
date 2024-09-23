import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "react-native-webview-bridge example",
  description: "react-native-webview-bridge example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
