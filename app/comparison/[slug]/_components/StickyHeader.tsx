"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface StickyHeaderProps {
    title: string
    product1: string
    product2: string
    onVoteClick: () => void
}

export default function StickyHeader({ title, product1, product2, onVoteClick }: StickyHeaderProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = 500 // Approximate hero height
            setIsVisible(window.scrollY > heroHeight)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
                >
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="hidden md:block font-semibold text-gray-900 dark:text-gray-100 truncate max-w-md">
                            {title}
                        </div>
                        <div className="flex items-center gap-4 md:hidden font-semibold text-sm">
                            <span>{product1}</span>
                            <span className="text-muted-foreground">vs</span>
                            <span>{product2}</span>
                        </div>

                        <Button onClick={onVoteClick} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Vote Now <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
