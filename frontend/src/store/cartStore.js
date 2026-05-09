import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => 
            item.product_id === newItem.product_id && 
            item.variant_id === newItem.variant_id
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += (newItem.quantity || 1);
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { ...newItem, quantity: newItem.quantity || 1 }] });
        }
      },

      removeItem: (productId, variantId = null) => {
        set({
          items: get().items.filter(
            (item) => !(item.product_id === productId && item.variant_id === variantId)
          ),
        });
      },

      updateQuantity: (productId, variantId, delta) => {
        const updatedItems = get().items.map((item) => {
          if (item.product_id === productId && item.variant_id === variantId) {
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        });
        set({ items: updatedItems });
      },

      clearCart: () => set({ items: [] }),

      // Getters
      getCartCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getCartTotal: () => get().items.reduce((acc, item) => acc + (parseFloat(item.price || 0) * item.quantity), 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;
