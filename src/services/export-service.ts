import { Product } from "../types";

export class ExportService {
  /**
   * Generates formatted JSON file of all user products and downloads it
   */
  static exportProductsJSON(products: Product[]): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `WarrantyVault_Export_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  /**
   * Generates formatted CSV file of all user products and downloads it
   */
  static exportProductsCSV(products: Product[]): void {
    const headers = [
      "Product Name",
      "Brand",
      "Model",
      "Category",
      "Purchase Price",
      "Currency",
      "Purchase Date",
      "Merchant",
      "Invoice Number",
      "Order ID",
      "Serial Number",
      "Return End Date",
      "Warranty End Date",
      "Warranty Type",
      "Warranty Provider",
      "Status",
      "Has Receipt",
      "Service Records Count",
    ];

    const rows = products.map((p) => [
      `"${(p.name || "").replace(/"/g, '""')}"`,
      `"${(p.brand || "").replace(/"/g, '""')}"`,
      `"${(p.model || "").replace(/"/g, '""')}"`,
      `"${(p.category || "").replace(/"/g, '""')}"`,
      p.purchasePrice || 0,
      `"${p.currency || "INR"}"`,
      `"${p.purchaseDate || ""}"`,
      `"${(p.merchant || "").replace(/"/g, '""')}"`,
      `"${(p.invoiceNumber || "").replace(/"/g, '""')}"`,
      `"${(p.orderId || "").replace(/"/g, '""')}"`,
      `"${(p.serialNumber || "").replace(/"/g, '""')}"`,
      `"${p.returnEndDate || ""}"`,
      `"${p.warrantyEndDate || ""}"`,
      `"${p.warrantyType || ""}"`,
      `"${p.warrantyProvider || ""}"`,
      `"${p.status || "Active"}"`,
      p.hasReceipt ? "Yes" : "No",
      p.serviceRecords?.length || 0,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `WarrantyVault_Export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
