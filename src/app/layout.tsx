import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
import { getAdmin } from "@/actions/admin";
import { headers } from "next/headers";
import { ThemeProvider } from "./_components/theme-provider";
import { getSession } from "@/actions/session";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Prediksi Penjualan - Dashboard",
  description: "Aplikasi manajemen prediksi penjualan",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const path =
    (await headersList).get("x-pathname") || (await headersList).get("x-url");
  const isLoginPage = path?.includes("/login");

  const session = await getSession();

  let admin = null;
  if (!isLoginPage) {
    admin = await getAdmin(session?.userId as string);
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            {!isLoginPage && (
              <Sidebar
                email={admin?.email}
                name={admin?.name}
                role={admin?.role}
              />
            )}
            <div
              className={`min-h-screen flex-1 flex flex-col transition-all duration-300 ${
                !isLoginPage ? "lg:pl-72" : ""
              }`}
            >
              {!isLoginPage && (
                <Navbar email={admin?.email} name={admin?.name} />
              )}
              <main className="p-4 md:p-6 flex-1">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
