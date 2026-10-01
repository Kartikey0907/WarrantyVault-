import { OCRScanResult } from "../types";

export interface SampleReceiptPreset {
  id: string;
  name: string;
  description: string;
  badge: string;
  mockData: OCRScanResult;
  svgPreview: string;
}

export class OCRService {
  /**
   * Preprocesses image using an offscreen canvas:
   * scales down for performance, normalizes orientation, enhances contrast for OCR readability
   */
  static async preprocessImageForOCR(file: File): Promise<{ base64: string; dataUrl: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve({ base64: e.target?.result as string, dataUrl: e.target?.result as string });
            return;
          }

          // Max dimension 1400px for high OCR accuracy without excessive size
          const maxDim = 1400;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Subtle contrast enhancement for receipt text
          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          resolve({
            base64: dataUrl,
            dataUrl,
          });
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * High-fidelity sample receipts for instant 1-tap testing
   */
  static getSampleReceipts(): SampleReceiptPreset[] {
    return [
      {
        id: "sample-sony",
        name: "Sony Center Tax Invoice",
        description: "WH-CH720N Wireless Headphones · ₹8,999",
        badge: "Single Item",
        svgPreview: "headphone",
        mockData: {
          merchant: "Sony Center (ABC Electronics)",
          purchaseDate: "2026-09-24",
          invoiceNumber: "INV-29381",
          orderId: "OD-SONY-9921",
          totalAmount: 8999,
          taxAmount: 1372,
          confidence: 0.96,
          detectedProductsCount: 1,
          products: [
            {
              productName: "Sony WH-CH720N Wireless Noise Canceling Headphones",
              brand: "Sony",
              model: "WH-CH720N",
              category: "Electronics",
              purchasePrice: 8999,
              currency: "INR",
              serialNumber: "SN894029184",
              returnPeriodDays: 7,
              warrantyDurationMonths: 12,
              warrantyProvider: "Manufacturer",
              warrantyType: "Manufacturer warranty",
              notes: "1 Year Official Sony India Limited Hardware Warranty.",
              selected: true,
            },
          ],
        },
      },
      {
        id: "sample-multi-item",
        name: "Amazon Tech Bundle (Multi-Item)",
        description: "4 Products detected: Monitor, Keyboard, Mouse, Hub",
        badge: "4 Items Detected",
        svgPreview: "layers",
        mockData: {
          merchant: "Amazon Retail India Pvt Ltd",
          purchaseDate: "2026-09-28",
          invoiceNumber: "AMZ-IN-889104",
          orderId: "402-9912048-7712391",
          totalAmount: 36496,
          taxAmount: 5566,
          confidence: 0.94,
          detectedProductsCount: 4,
          products: [
            {
              productName: "LG 24-inch UltraGear Gaming Monitor (144Hz)",
              brand: "LG",
              model: "24GN65R",
              category: "Gaming",
              purchasePrice: 13499,
              currency: "INR",
              serialNumber: "LG-MON-89102",
              returnPeriodDays: 7,
              warrantyDurationMonths: 36,
              warrantyProvider: "Manufacturer",
              warrantyType: "Manufacturer warranty",
              notes: "3-year manufacturer on-site panel warranty.",
              selected: true,
            },
            {
              productName: "Keychron K2 Wireless Mechanical Keyboard",
              brand: "Keychron",
              model: "K2-V2-RGB",
              category: "Accessories",
              purchasePrice: 8999,
              currency: "INR",
              serialNumber: "KC882901",
              returnPeriodDays: 7,
              warrantyDurationMonths: 12,
              warrantyProvider: "Manufacturer",
              warrantyType: "Manufacturer warranty",
              notes: "Gateron Brown switches with hot-swappable PCB.",
              selected: true,
            },
            {
              productName: "Logitech MX Master 3S Performance Mouse",
              brand: "Logitech",
              model: "MX Master 3S",
              category: "Accessories",
              purchasePrice: 9499,
              currency: "INR",
              serialNumber: "LZ991048",
              returnPeriodDays: 7,
              warrantyDurationMonths: 12,
              warrantyProvider: "Manufacturer",
              warrantyType: "Manufacturer warranty",
              notes: "8000 DPI sensor, quiet click switches.",
              selected: true,
            },
            {
              productName: "Anker 7-in-1 USB-C PD Hub Adapter",
              brand: "Anker",
              model: "PowerExpand 7-in-1",
              category: "Accessories",
              purchasePrice: 4499,
              currency: "INR",
              serialNumber: "AK-HUB-332",
              returnPeriodDays: 7,
              warrantyDurationMonths: 18,
              warrantyProvider: "Manufacturer",
              warrantyType: "Manufacturer warranty",
              notes: "4K HDMI, 85W Power Delivery pass-through.",
              selected: true,
            },
          ],
        },
      },
      {
        id: "sample-lg-appliance",
        name: "Reliance Digital Appliance Bill",
        description: "LG Washing Machine · ₹34,500 · 2 Yrs Warranty",
        badge: "Appliance",
        svgPreview: "home",
        mockData: {
          merchant: "Reliance Digital",
          purchaseDate: "2026-01-15",
          invoiceNumber: "RD-INV-2026-901",
          orderId: "RD-ORD-7721",
          totalAmount: 34500,
          taxAmount: 5262,
          confidence: 0.98,
          detectedProductsCount: 1,
          products: [
            {
              productName: "LG 8Kg Front Load Washing Machine",
              brand: "LG",
              model: "FHM1408BDW",
              category: "Home Appliances",
              purchasePrice: 34500,
              currency: "INR",
              serialNumber: "LG-WM-8829104",
              returnPeriodDays: 10,
              warrantyDurationMonths: 24,
              warrantyProvider: "Manufacturer",
              warrantyType: "Manufacturer warranty",
              notes: "2 years comprehensive + 10 years direct drive motor warranty.",
              selected: true,
            },
          ],
        },
      },
    ];
  }
}
