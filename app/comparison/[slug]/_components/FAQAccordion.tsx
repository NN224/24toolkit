"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
    question: string
    answer: string
}

interface FAQAccordionProps {
    items: FAQItem[]
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
    if (!items || items.length === 0) return null

    return (
        <section className="py-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                    {items.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
