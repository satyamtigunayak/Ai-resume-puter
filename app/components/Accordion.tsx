import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { cn } from "~/lib/utils";

interface AccordionContextType {
    activeItems: string[];
    toggleItem: (id: string) => void;
    isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
    const ctx = useContext(AccordionContext);
    if (!ctx) throw new Error("Accordion components must be used within an Accordion");
    return ctx;
};

/* ── Accordion ───────────────────────────────────── */
interface AccordionProps {
    children: ReactNode;
    defaultOpen?: string;
    allowMultiple?: boolean;
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    children, defaultOpen, allowMultiple = false, className = "",
}) => {
    const [activeItems, setActiveItems] = useState<string[]>(
        defaultOpen ? [defaultOpen] : []
    );

    const toggleItem = (id: string) => {
        setActiveItems(prev =>
            allowMultiple
                ? prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
                : prev.includes(id) ? [] : [id]
        );
    };

    const isItemActive = (id: string) => activeItems.includes(id);

    return (
        <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
            <div className={className}>{children}</div>
        </AccordionContext.Provider>
    );
};

/* ── AccordionItem ───────────────────────────────── */
interface AccordionItemProps { id: string; children: ReactNode; className?: string; }

export const AccordionItem: React.FC<AccordionItemProps> = ({ id, children, className = "" }) => (
    <div
        className={`overflow-hidden ${className}`}
        style={{ borderBottom: "1px solid var(--rule)" }}
    >
        {children}
    </div>
);

/* ── AccordionHeader ─────────────────────────────── */
interface AccordionHeaderProps {
    itemId: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
    itemId, children, className = "", icon, iconPosition = "right",
}) => {
    const { toggleItem, isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    const chevron = (
        <svg
            className={cn("w-4 h-4 transition-transform duration-200", { "rotate-180": isActive })}
            fill="none"
            stroke="var(--ink-3)"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );

    return (
        <button
            onClick={() => toggleItem(itemId)}
            className={`w-full text-left focus:outline-none flex items-center justify-between cursor-pointer transition-colors duration-150 ${className}`}
            style={{ background: "transparent", border: "none", padding: "17px 22px" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
            <div className="flex items-center space-x-3">
                {iconPosition === "left" && (icon || chevron)}
                <div className="flex-1">{children}</div>
            </div>
            {iconPosition === "right" && (icon || chevron)}
        </button>
    );
};

/* ── AccordionContent ────────────────────────────── */
interface AccordionContentProps { itemId: string; children: ReactNode; className?: string; }

export const AccordionContent: React.FC<AccordionContentProps> = ({ itemId, children, className = "" }) => {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "max-h-fit opacity-100" : "max-h-0 opacity-0"} ${className}`}>
            <div style={{ padding: "0 22px 20px" }}>{children}</div>
        </div>
    );
};
