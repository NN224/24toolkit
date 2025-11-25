"use client"

import { Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Comparison } from "@/lib/comparisons-data"

interface ComparisonTableProps {
    comparison: Comparison
}

export default function ComparisonTable({ comparison }: ComparisonTableProps) {
    return (
        <section className="py-12">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Option A */}
                <Card className="border-2 border-blue-500/10 hover:border-blue-500/30 transition-colors">
                    <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
                        <CardTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400">
                            {comparison.optionA.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ul className="space-y-4">
                            {comparison.optionA.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Option B */}
                <Card className="border-2 border-purple-500/10 hover:border-purple-500/30 transition-colors">
                    <CardHeader className="bg-purple-500/5 border-b border-purple-500/10">
                        <CardTitle className="text-2xl font-bold text-center text-purple-700 dark:text-purple-400">
                            {comparison.optionB.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ul className="space-y-4">
                            {comparison.optionB.pros.map((pro, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300">{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
