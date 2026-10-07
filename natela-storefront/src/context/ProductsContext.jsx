import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as seedProducts } from "../data/products";
import { load, save } from "../lib/localStore";

const STORAGE_KEY = "natela.products";

/* ---------------------------------------------------------
   ProductsContext — the frontend's copy of the catalogue.

   Right now it holds the fake data in memory, so anything the
   admin adds or edits shows up on the store immediately.

   WHEN THE BACKEND IS READY:
   replace the useState seed with a fetch to product-service,
   and make addProduct / updateProduct / deleteProduct call
   POST / PUT / DELETE instead of setState. Nothing else in the
   app has to change, because every screen reads from here.
   --------------------------------------------------------- */

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  /* Start from whatever the admin saved last time, or the seed data
     on a first visit. Replace with a fetch to product-service later. */
  const [products, setProducts] = useState(() => load(STORAGE_KEY, seedProducts));

  useEffect(() => {
    save(STORAGE_KEY, products);
  }, [products]);

  function addProduct(draft) {
    const nextId = Math.max(0, ...products.map((p) => p.id)) + 1;
    const product = {
      id: nextId,
      name: draft.name,
      sku: draft.sku || `NF-NEW-${String(nextId).padStart(3, "0")}`,
      description: draft.description || "",
      price: Number(draft.price) || 0,
      comparePrice: null,
      sport: draft.sport || "Muay Thai",
      rating: 0,
      reviews: 0,
      tag: "NEW",
      image: null,
      stock: draft.stock,
      status: draft.status || "live",
    };
    setProducts((prev) => [product, ...prev]);
    return product;
  }

  function updateProduct(id, changes) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p))
    );
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  /* Called after a successful order so the store reflects what sold. */
  function reduceStock(id, size, qty) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: { ...p.stock, [size]: Math.max(0, p.stock[size] - qty) } }
          : p
      )
    );
  }

  const value = useMemo(
    () => ({ products, addProduct, updateProduct, deleteProduct, reduceStock }),
    [products]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
