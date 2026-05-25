import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getProductMoq } from "@/lib/userRoles";

const useQuoteStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, options = {}) => {
        const {
          variant_id = null,
          variant_label = null,
          quantity = null,
        } = options;

        const moq = getProductMoq(product) || 1;
        const qty = Math.max(quantity || moq, moq);

        const items = get().items;
        const existingIndex = items.findIndex(
          (item) =>
            item.product_id === product.id &&
            item.variant_id === variant_id
        );

        const primaryImage =
          product?.images?.find((img) => img.is_primary) || product?.images?.[0];

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += qty;
          set({ items: updated });
          return;
        }

        set({
          items: [
            ...items,
            {
              product_id: product.id,
              slug: product.slug,
              name: product.name,
              image: primaryImage?.full_url || null,
              variant_id,
              variant_label,
              quantity: qty,
              unit_price: product.resolved_price ?? product.base_retail_price ?? product.price,
              moq,
            },
          ],
        });
      },

      removeItem: (productId, variantId = null) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.product_id === productId && item.variant_id === variantId)
          ),
        });
      },

      updateQuantity: (productId, variantId, quantity) => {
        const qty = Math.max(1, quantity);
        set({
          items: get().items.map((item) =>
            item.product_id === productId && item.variant_id === variantId
              ? { ...item, quantity: Math.max(qty, item.moq || 1) }
              : item
          ),
        });
      },

      clearAll: () => set({ items: [] }),

      getItemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    {
      name: "quote-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useQuoteStore;
