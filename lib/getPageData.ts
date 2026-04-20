import { cache } from "react";
import { connectTenantDB } from "./db";
import { ObjectId } from "mongodb";
import { isHex } from "@/app/api/ecommerce/categories/util";


function serialize(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, value) => {
    if (value instanceof ObjectId) {
      return value.toString();
    }
    return value;
  }));
}


export const getPageData = cache(async (slug: string) => {
  const db = await connectTenantDB();
  const page = await db.collection("pages").findOne({ slug });
 if (!page) {
    return null;
  }
  return serialize(page);
});

export const getSingleProduct = cache(async (id: string) => {
  const db = await connectTenantDB();
  const productColl = db.collection("products");

  const matchStage: any = {};
  if (isHex(id)) {
    matchStage._id = new ObjectId(id);
  } else {
    matchStage.slug = id;
  }

  const products = await productColl
    .aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },

      
    ])
    .toArray();
  if (products.length === 0) {
    return null;
  }

  return serialize(products[0]);
});
