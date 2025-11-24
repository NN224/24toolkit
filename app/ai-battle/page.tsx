import type { Metadata } from "next"
import AIBattleClient from "./_components/ai-battle-client"

export const metadata: Metadata = {
  title: "AI Battle - Compare Anything with AI | Products VS",
  description:
    "Use AI to compare any two products, services, or concepts instantly. Get detailed analysis powered by artificial intelligence.",
}

export default function AIBattlePage() {
  return <AIBattleClient />
}
