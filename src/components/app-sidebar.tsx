"use client"

import * as React from "react"
import {
  // SquareTerminal, // 🚀 Comentado temporalmente
  FileText,
  Mail,
  QrCode,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Datos de usuario y equipos
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    { name: "Acme Inc", logo: GalleryVerticalEnd, plan: "Enterprise" },
    { name: "Acme Corp.", logo: AudioWaveform, plan: "Startup" },
    { name: "Evil Corp.", logo: Command, plan: "Free" },
  ],
  navMain: [
    // 🚀 Dashboard comentado temporalmente
    // {
    //   title: "Dashboard",
    //   url: "/",
    //   icon: SquareTerminal,
    //   isActive: true,
    //   items: [
    //     { title: "Inicio", url: "/" },
    //   ],
    // },
    {
      title: "Reportes",
      url: "/reports",
      icon: FileText,
      items: [
        { title: "Historial de Reportes", url: "/reports?status=pending" },      ],
    },
    {
      title: "Configuración de Correos",
      url: "/email-settings",
      icon: Mail,
      items: [
        { title: "Destinatarios", url: "/email-settings" },
      ],
    },
    {
      title: "Generar QR",
      url: "/generate-qr",
      icon: QrCode,
      items: [
        { title: "Formulario QR", url: "/generate-qr" },
      ],
    },
  ],
  projects: [], // eliminamos proyectos ya que no los usaremos
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
