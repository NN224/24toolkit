"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface ShareButtonsProps {
    title: string
    slug: string
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)
    const url = typeof window !== "undefined" ? `${window.location.origin}/comparison/${slug}` : ""

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-950/30"
                onClick={() => window.open(shareLinks.twitter, "_blank")}
            >
                <Twitter className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30"
                onClick={() => window.open(shareLinks.facebook, "_blank")}
            >
                <Facebook className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30"
                onClick={() => window.open(shareLinks.linkedin, "_blank")}
            >
                <Linkedin className="w-4 h-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleCopy}
            >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
            </Button>
        </div>
    )
}
