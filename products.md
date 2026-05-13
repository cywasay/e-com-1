# Product Management System (Shopify-Style)

This guide documents the architecture and data flow for the upgraded Products module in the Admin panel.

## 1. Pricing Strategy (Factor-Based)
The pricing system no longer relies on a single input. It calculates financial metrics in real-time.

### **Key Fields:**
*   **Base Cost (`base_cost`)**: What you pay for the item.
*   **Price (`price`)**: What the customer pays.
*   **Profit**: Calculated as `Price - Cost`.
*   **Margin**: Calculated as `(Profit / Price) * 100`.
*   **Compare-at Price**: Used for showing "Sale" prices (cross-out effect).

### **Smart Syncing:**
When you change the main product price, the system automatically updates all variants that were using that same price, while respecting any "premium" prices you set manually for specific sizes or colors.

---

## 2. Inventory Management
Tracks stock levels at a per-product and per-variant level.

### **Tracking Logic:**
*   **Track Inventory Toggle**: When OFF, the product is considered "always in stock."
*   **Stock Quantity (`stock_qty`)**: The actual physical count.
*   **Continue Selling**: If ON, customers can still buy the item even if `stock_qty <= 0`.
*   **Barcode/SKU**: Unique identifiers for scanning and internal tracking.

---

## 3. Variant Architecture
Variants are generated based on **Option Types** (e.g., Size, Color).

### **Workflow:**
1.  **Define Options**: Enter "Size" and values like "Small, Medium, Large."
2.  **Generate**: The system creates combinations.
3.  **Individual Overrides**: Use the **Variant Edit Modal** to set specific prices, costs, or barcodes for a single variant (e.g., XL costing Rs 50 more).

---

## 4. Data Flow & Troubleshooting

### **The Save Process:**
When you click **Save**, the frontend performs two actions:
1.  **Main Update**: Sends a `POST` request (spoofed as `PUT`) with basic product data (Name, Description, Main Price, etc.).
2.  **Variant Sync**: Sends individual requests to update or create each variant in the list.

### **Common Issues & Fixes:**

#### **1. 500 Internal Server Error**
*   **Cause**: Missing database columns.
*   **Fix**: Run `php artisan migrate` in the `backend` folder. This ensures `base_cost`, `barcode`, etc., exist in the `product_variants` table.

#### **2. Update Button Doesn't Respond**
*   **Cause**: Validation error in the backend (e.g., duplicate SKU or Barcode).
*   **Fix**: Check the browser's **Network Tab**. Look at the response from the failed request—it will list exactly which field failed validation.

#### **3. Images Not Saving**
*   **Cause**: Images are uploaded *immediately* when you select them.
*   **Note**: For new products, you must save the product first to generate an ID before the image uploader becomes active.

---

## 5. Required Migrations
Ensure the following migrations have been executed:
*   `add_pricing_factors_to_products_table`
*   `add_inventory_fields_to_products_table`
*   `add_base_cost_to_product_variants_table`
*   `add_barcode_to_product_variants_table`
