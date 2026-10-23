"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  Truck,
  ShieldAlert,
  FilePenLine,
  ChartArea,
  Percent,
  BanknoteArrowDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";

import logo from "@/../public/logo.svg";

export function AppSidebar() {
  const [sistemaAtivo, setSistemaAtivo] = useState<
    "producao" | "desenvolvimento"
  >("producao");

  const pathname = usePathname();

  useEffect(() => {
    const url =
      sistemaAtivo === "producao"
        ? "http://192.168.1.10:8080"
        : "http://localhost:8080";
    localStorage.setItem("api_url_atual", url);
  }, [sistemaAtivo]);

  const { open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuButton
                  render={<span />}
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent border border-border/40 flex items-center justify-start group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:p-2 w-60"
                >
                  {sistemaAtivo === "producao" ? (
                    <Image
                      src={logo}
                      width={20}
                      height={20}
                      alt="Logo Preço Fixo"
                      className="shrink-0 object-contain"
                    />
                  ) : (
                    <ShieldAlert className="size-5 shrink-0 text-amber-500" />
                  )}

                  {open && (
                    <span className="flex flex-col gap-0.5 text-left leading-none animate-in fade-in duration-200 ml-2">
                      <span className="font-semibold text-sm">
                        {sistemaAtivo === "producao"
                          ? "Preço Fixo"
                          : "Ambiente Dev"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {sistemaAtivo === "producao" ? "v(1.1)" : "beta (test)"}
                      </span>
                    </span>
                  )}

                  {open && (
                    <ChevronDown className="ml-auto size-4 opacity-50 shrink-0" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-popper-anchor-width]"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem
                  onClick={() => setSistemaAtivo("producao")}
                  className="flex items-center gap-2 py-2 cursor-pointer"
                >
                  <Image
                    src={logo}
                    width={20}
                    height={20}
                    alt="Logo Preço Fixo"
                  />
                  <span className="font-medium">Preço Fixo (v1.1)</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSistemaAtivo("desenvolvimento")}
                  className="flex items-center gap-2 py-2 cursor-pointer"
                >
                  <ShieldAlert className="size-4 text-amber-500" />
                  <span className="font-medium">Ambiente Dev (Test)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Comal</SidebarGroupLabel>
          <SidebarMenu>
            {/* GRUPO RETRÁTIL: LOGÍSTICA */}
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                {/* O CollapsibleTrigger cria o <button> de abertura */}
                <CollapsibleTrigger>
                  {/* 🟢 CORREÇÃO 3: render={<span />} evita o conflito de botões aninhados aqui também */}
                  <SidebarMenuButton render={<span />} tooltip="Logística">
                    <ChartArea className="size-4" />
                    <span>Promoções</span>
                    <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        render={<span />}
                        isActive={pathname === "/promocoes"}
                      >
                        <Link
                          href="https://painelcomal.duckdns.org/preco-fixo"
                          className="flex gap-2 w-full items-center"
                        >
                          <Percent className="size-4" />
                          <span>Preço Fixo</span>
                        </Link>
                      </SidebarMenuSubButton>
                      <SidebarMenuSubButton
                        render={<span />}
                        isActive={pathname === "/precificacao"}
                      >
                        <Link
                          href="/precificacao"
                          className="flex gap-2 w-full items-center"
                        >
                          <BanknoteArrowDown className="size-4" />
                          <span>Escalonada (Novo)</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
