"use client";

import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

interface AccordionSectionProps {
    title?: string;
    children: React.ReactNode;
    isLast?: boolean;
    adminTitle?: string;
    section?: any;
}

const AccordionSection = ({
    title: propTitle,
    children,
    isLast: propIsLast = false,
    adminTitle,
    section: propSection
}: AccordionSectionProps) => {
    const [open, setOpen] = useState(true);
    const pathname = usePathname();
    const currentPages = useAppSelector((state) => state.pages.currentPages);

    const lang = useMemo(() => {
        const segments = pathname.split("/").filter(Boolean);
        if (segments[0] === "hi") return "hi";
        return "en";
    }, [pathname]);

    const getCurrentSection = useMemo(() => {
        if (!currentPages || !adminTitle) return;
        return currentPages.content?.find((page: any) => page?.adminTitle === adminTitle);
    }, [currentPages, adminTitle]);

    const section = propSection || getCurrentSection;
    const p = section?.props || {};

    const title = p.title?.[lang] || p.title?.en || p.title || propTitle || "";
    const isLast = p.isLast ?? propIsLast;

    return (
        <div className={isLast ? "" : "border-b border-border/70"}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex justify-between items-center px-4 py-3.5 hover:bg-border/20 transition-colors"
            >
                <span className="text-[11px] font-black uppercase tracking-[2px] text-foreground/80">
                    {title}
                </span>
                <ChevronRight
                    size={15}
                    className={`text-secondary transition-transform duration-300 ${open ? "rotate-90" : ""}`}
                />
            </button>

            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open ? "800px" : "0px", opacity: open ? 1 : 0 }}
            >
                <div className="px-4 pb-4">{children}</div>
            </div>
        </div>
    );
};

export default AccordionSection;