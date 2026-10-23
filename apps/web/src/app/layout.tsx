import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getTokenPayload } from "@/services/TokenValid";
import { SessionProvider } from "@/providers/Provider.test";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider copy";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/../public/logo-cor.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promoção Escalonada",
  description: "Gerenciamento de precificação e planos escalonados",
  icons: { icon: "/dev-test/logo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`light ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${geistSans.className} ${geistMono.variable} min-h-full flex flex-col`}
      >
        {/* 🟢 O Suspense agora envolve o componente que faz o await dos cookies */}
        <Suspense
          fallback={
            <div className="flex h-screen items-center justify-center">
              Carregando sessão...
            </div>
          }
        >
          <AuthenticatedApp>{children}</AuthenticatedApp>
        </Suspense>
      </body>
    </html>
  );
}

// Componente separado que realiza o await dos cookies de forma segura para o Next.js
async function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  const token = await getTokenPayload();

  return (
    <SessionProvider token={token}>
      <ReactQueryProvider>
        <TooltipProvider>
          <Toaster />
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0 min-h-screen">
              <header className="flex h-14 items-center gap-4 border-b px-6 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur">
                <SidebarTrigger />
                <div className="h-4 w-px bg-border" />
                <Link href="/">
                  <Image
                    src={logo}
                    width={40}
                    height={40}
                    alt="Picture of the author"
                  />
                </Link>
              </header>

              <div className="flex-1 overflow-auto">{children}</div>
            </main>
          </SidebarProvider>
        </TooltipProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
