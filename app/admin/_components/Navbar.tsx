"use client"

import { LogOut, Shield, User, Bell, Search, Menu } from "lucide-react"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  admin: {
    name: string
    email: string
  } | null
  onLogout: () => void
}

export default function Navbar({ admin, onLogout }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Products<span className="font-light text-blue-400">VS</span>
              </span>
            </div>

            {/* Search Bar (Hidden on mobile) */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search comparisons..."
                className="w-64 bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
            </Button>

            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-medium shadow-lg">
                    {admin?.name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                      {admin?.name || "Admin"}
                    </span>
                    <span className="text-xs text-gray-500">Super Admin</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border border-white/10 text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/5 focus:text-white cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
