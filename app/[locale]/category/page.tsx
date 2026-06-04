import { Suspense } from "react";
import Component from "@/components/pages/CategoryPage";
import GetProductCategoryWise from "@/lib/GetAllDetails/GetProductCategoryWise";

export default function CategoryPage() {
  return (
    <Suspense fallback={<div>Loading Category...</div>}>
      <GetProductCategoryWise />
      <Component />
    </Suspense>
  );
}
