import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_COMPARE = 4;

const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const items = get().items;
        const exists = items.some((item) => item.slug === product.slug);

        if (exists) {
          set({ items: items.filter((item) => item.slug !== product.slug) });
          return;
        }

        if (items.length >= MAX_COMPARE) {
          return false;
        }

        const primaryImage =
          product?.images?.find((img) => img.is_primary) || product?.images?.[0];

        set({
          items: [
            ...items,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              sku: product.sku || `PRD-${product.id}`,
              image: primaryImage?.full_url || null,
              category: product.category?.name || null,
            },
          ],
        });

        return true;
      },

      removeItem: (slug) => {
        set({ items: get().items.filter((item) => item.slug !== slug) });
      },

      clearAll: () => set({ items: [] }),

      isInCompare: (slug) => get().items.some((item) => item.slug === slug),

      getSlugs: () => get().items.map((item) => item.slug),
    }),
    {
      name: "compare-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCompareStore;
export { MAX_COMPARE };
