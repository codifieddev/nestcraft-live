"use client";

import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { fetchProductsByCategory } from "../store/products/productsThunk";
import { useParams, useSearchParams } from "next/navigation";

export default function GetAllProducts() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id !== undefined) {
      dispatch(fetchProductsByCategory({ category: id, filters }));
    } else {
      dispatch(fetchProductsByCategory({ category: "all", filters }));
    }
  }, [id, filters]);

  return null;
}
