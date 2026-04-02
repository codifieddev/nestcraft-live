"use client";

import GetAllCategories from "@/lib/GetAllDetails/GetAllCategories";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GetAllCategories type="normal" />
      {children}
    </>
  );
}
