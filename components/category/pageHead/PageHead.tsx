"use client";

import { CategoryRecord } from "@/lib/store/categories/categoriesSlices";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

import { defaultSubCategories, defaultPills } from "./pageHeadData";

interface PageHeadProps {
  currentCategory: CategoryRecord | null; 
  productCount: number;
  section?: any;
}
    
const PageHead = ({ currentCategory, productCount, section: propSection }: PageHeadProps) => {
  const pathname = usePathname();
  const currentPages = useAppSelector((state) => state.pages.currentPages);

  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "hi") return "hi";
    return "en";
  }, [pathname]);

  const getCurrentSection = useMemo(() => {
    if (!currentPages) return;
    return currentPages.content?.find((page: any) => page?.adminTitle === "Category Page Head");
  }, [currentPages]);

  const section = propSection || getCurrentSection;
  const p = section?.props || {};

  // Extract content with fallbacks
  const badge = p.badge?.[lang] || p.badge?.en || p.badge || (currentCategory ? "Category" : "Collection");
  const heading = p.heading?.[lang] || p.heading?.en || p.heading || (currentCategory ? currentCategory.name : "The Full Collection");
  const description = p.description?.[lang] || p.description?.en || p.description || (currentCategory ? currentCategory.description : "Explore our entire range of design-led furniture and home essentials. Crafted with purpose, built for life.");
  
  const subCategories = section?.content || defaultSubCategories;
  
  const pills = p.pills || defaultPills(productCount);

  return (
    <section className="pagehead">
      <div className="pagehead-inner">
        <div className="pagehead-content">
          <small className="text-secondary tracking-[3px] uppercase text-[10px] font-black mb-2 block">
            {badge}
          </small>
          <h1 className="text-[46px] font-black leading-[1.05] tracking-tight">
            {heading}
          </h1>
          <p className="text-muted font-bold mt-2.5 max-w-[70ch] leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-2.5 mt-4">
            {subCategories.map((sub: any, idx: number) => {
              const subTitle = typeof sub === "string" 
                ? sub 
                : (sub.props?.label?.[lang] || sub.props?.label?.en || sub.props?.title?.[lang] || sub.props?.title?.en || sub.title || "");
              if (!subTitle) return null;
              return (
                <button
                  key={idx}
                  className="h-10 px-4 rounded-full border border-border bg-white/65 dark:bg-surface/62 backdrop-blur-md text-[10px] font-black uppercase tracking-[2px] hover:border-secondary hover:bg-secondary/10 transition-all"
                >
                  {subTitle}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2.5 flex-wrap justify-start lg:justify-end ml-auto">
          {pills.map((pill: any, idx: number) => {
            const pillLabel = typeof pill.label === "object" 
              ? (pill.label[lang] || pill.label.en) 
              : pill.label;
            return (
              <div key={idx} className="pill">
                {pill.isBold ? <b>{pill.value}</b> : pill.value} {pillLabel}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PageHead;
