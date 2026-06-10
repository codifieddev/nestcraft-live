"use client";
import { Check, Pencil, RefreshCcw, ShieldCheck, Sparkles, Truck, X } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { defaultUSPItems } from "./uspData";

const USP = () => {
  const [isInlineEditEnabled, setIsInlineEditEnabled] = useState(true);
  const currentPages = useAppSelector((state) => state.pages.currentPages);
  const pathname = usePathname();
  const [editableItems, setEditableItems] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftValue, setDraftValue] = useState("");

  useEffect(() => {
    setIsInlineEditEnabled(true);
  }, []);

  const lang = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "hi") return "hi";
    return "en";
  }, [pathname]);

  const getCurrentSection = useMemo(() => {
    if (!currentPages) return;
    return currentPages.content?.find((page: any) => page?.adminTitle === "USP Section");
  }, [currentPages]);


  const items = (getCurrentSection as any)?.content || defaultUSPItems;

  useEffect(() => {
    setEditableItems(items);
  }, [items]);

  

  const iconMap: Record<string, any> = {
    "truck": Truck,
    "shield-check": ShieldCheck,
    "refresh-ccw": RefreshCcw,
    "sparkles": Sparkles
  };

  const icons = [Truck, ShieldCheck, RefreshCcw, Sparkles];

  const startEdit = (idx: number, field: "title" | "description", value: string) => {
    if (!isInlineEditEnabled) return;
    setEditingKey(`${idx}-${field}`);
    setDraftValue(value || "");
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setDraftValue("");
  };

  const saveEdit = (idx: number, field: "title" | "description") => {
    setEditableItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const props = item.props || {};
        const localized = props[field];
        const nextVal =
          localized && typeof localized === "object"
            ? { ...localized, [lang]: draftValue, en: localized.en ?? draftValue }
            : { [lang]: draftValue, en: draftValue };
        return { ...item, props: { ...props, [field]: nextVal } };
      }),
    );
    setEditingKey(null);
    setDraftValue("");
  };

  return (
    <section
      data-annotate-id="home-usp-section"
      className="px-[5%] pb-[90px] -mt-16 z-10 relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-surface border border-border md:shadow-2xl grid sm:grid-cols-2 lg:grid-cols-4 gap-[18px] p-[22px] rounded-lg"
      >
        {editableItems.map((item: any, idx: number) => {
          const sp = item.props || {};
          const getV = (field: any) => {
            if (!field) return "";
            const val = field.value !== undefined ? field.value : field;
            if (val && typeof val === "object") return val[lang] || val.en || "";
            return val || "";
          };

          const iconKey = getV(sp.icon);
          const Icon = iconMap[iconKey] || icons[idx % icons.length];
          const title = getV(sp.title) || item.title;
          const description = getV(sp.description) || item.description || item.sub;
          
          return (
            <div key={idx} className="flex gap-3 items-start p-[6px_8px]">
              <Icon className="text-secondary mt-0.5" size={22} />
              <div>
                <div className="group/title flex items-center gap-2">
                  {editingKey === `${idx}-title` ? (
                    <>
                      <input
                        autoFocus
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        className="h-7 w-[180px] rounded border border-border bg-background px-2 text-[12px] font-black uppercase tracking-[1px]"
                      />
                      <button onClick={() => saveEdit(idx, "title")} className="rounded-full bg-secondary p-1 text-black" aria-label="Save title">
                        <Check size={12} />
                      </button>
                      <button onClick={cancelEdit} className="rounded-full border border-border p-1" aria-label="Cancel title">
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <strong className="block text-[12px] tracking-[2px] uppercase font-black">{title}</strong>
                      {isInlineEditEnabled && (
                        <button
                          onClick={() => startEdit(idx, "title", title)}
                          className="rounded-full border border-border bg-background p-1 opacity-0 transition-opacity group-hover/title:opacity-100"
                          aria-label="Edit title"
                        >
                          <Pencil size={11} />
                        </button>
                      )}
                    </>
                  )}
                </div>
                <div className="group/desc mt-0.5 flex items-center gap-2">
                  {editingKey === `${idx}-description` ? (
                    <>
                      <input
                        autoFocus
                        value={draftValue}
                        onChange={(e) => setDraftValue(e.target.value)}
                        className="h-7 w-[220px] rounded border border-border bg-background px-2 text-[12px] font-bold"
                      />
                      <button onClick={() => saveEdit(idx, "description")} className="rounded-full bg-secondary p-1 text-black" aria-label="Save description">
                        <Check size={12} />
                      </button>
                      <button onClick={cancelEdit} className="rounded-full border border-border p-1" aria-label="Cancel description">
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="block text-[12px] text-muted font-bold">{description}</span>
                      {isInlineEditEnabled && (
                        <button
                          onClick={() => startEdit(idx, "description", description)}
                          className="rounded-full border border-border bg-background p-1 opacity-0 transition-opacity group-hover/desc:opacity-100"
                          aria-label="Edit description"
                        >
                          <Pencil size={11} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default USP;
