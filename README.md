# WarrantyVault 🛡️
> **"Never lose a receipt. Never miss a warranty."**

WarrantyVault is a complete, production-ready digital ownership platform and mobile application. It solves the universal frustration of lost invoices, missed return deadlines, forgotten serial numbers, and expired warranties by centralizing purchase documentation, tracking lifecycle countdowns, and preparing automated warranty claim dossiers.

---

## 📱 Core Product Lifecycle

```
PURCHASED → RECEIPT STORED → RETURN WINDOW → WARRANTY → SERVICE → MAINTENANCE → RESALE / DISPOSAL
```

---

## 🚀 Key Features

1. **Receipt Scanning & OCR Extraction**:
   - Camera & document upload support (JPG, PNG, PDF).
   - High-contrast canvas preprocessor.
   - Dual-mode extraction: **Gemini / OpenAI structured backend** with fallback to deterministic regex OCR.
   - **Multi-Product Bill Detection**: Automatically splits multi-item bills (e.g., Laptop, Mouse, Monitor) into individual trackable vault assets.
   - Never fabricates missing information; unverified fields are marked `null`.

2. **Automated Return & Warranty Engine**:
   - Independent countdown clocks for **Return Windows** (e.g., 7, 10, 14, 30 days) and **Warranty Terms** (12, 24, 36 months, Lifetime).
   - **WCAG-Compliant Visual State Badges**:
     - 🟢 **Green**: Active (> 90 days remaining)
     - 🟡 **Yellow**: Expiring soon (30–90 days)
     - 🟠 **Orange**: Attention needed (7–30 days)
     - 🔴 **Red**: Critical deadline (< 7 days)
     - ⚪ **Gray**: Expired
   - High-contrast text labels alongside all colors.

3. **Warranty Claim Assistant**:
   - **Readiness Checklist**:
     - ✓ Product Name
     - ✓ Purchase Date
     - ✓ Stored Invoice
     - ✓ Serial Number
     - ✓ Active Warranty Status
   - Identifies missing fields (e.g., "Serial number missing") and prompts immediate resolution.
   - Generates structured claim dossiers and copyable, formal customer support emails. Claims are never sent automatically.

4. **Service & Maintenance History**:
   - Comprehensive timeline of repairs, component swaps, authorized service centers, and costs.
   - Tracks whether service was performed under warranty claims.

5. **Search & AI Inventory Queries**:
   - Fast local fuzzy search by product name, brand, model, merchant, serial number, invoice, or category.
   - Natural language queries:
     - *"Is my TV still under warranty?"*
     - *"What do I need for a warranty claim on my laptop?"*
     - *"Find my laptop invoice"*
     - *"How much have I spent on electronics?"*

6. **Household Sharing (Multi-User RBAC)**:
   - Create shared households (e.g., "Home").
   - Roles: **Owner** (full control), **Editor** (read/write products & service records), **Viewer** (read-only).

7. **Product Valuation Dashboard**:
   - Real-time registered asset totals formatted in Indian Rupees (₹) and global currencies.
   - Category breakdowns and warranty protection ratios.

8. **Privacy, Offline First & Data Export**:
   - Zero unnecessary permissions: **No location, contacts, or microphone access**.
   - Offline-first cache with local storage persistence.
   - 1-tap **CSV** and **JSON** data export.
   - Secure account deletion with complete data purge.

---

## 🏗️ Architecture & Project Structure

The project includes both the **Live Interactive Production Applet** (TypeScript, React 19, Tailwind CSS, Vite, Express, Gemini GenAI) and the **Full Native Flutter Source Code** (`/flutter_warranty_vault`):

```
warranty-vault/
├── server.ts                       # Backend Express API proxy (Vite middlewares, Gemini GenAI)
├── firestore.rules                 # Production Firebase Firestore security rules
├── storage.rules                   # Production Firebase Storage security rules
├── metadata.json                   # Applet configuration & server-side AI capabilities
├── src/
│   ├── types/index.ts              # Domain data contracts (Product, Service, Household, etc.)
│   ├── core/
│   │   ├── constants.ts            # Categories, warranty providers, settings defaults
│   │   ├── date-utils.ts           # Leap-year safe date math, currency & status badges
│   │   ├── sample-data.ts          # Canonical sample data (Sony, Dell, LG, Philips)
│   │   └── storage.ts              # LocalStorage & IndexedDB persistence engine
│   ├── services/
│   │   ├── ai-service.ts           # Server proxy caller for OCR, Q&A, and claims
│   │   ├── ocr-service.ts          # Canvas preprocessor & 1-tap sample bill presets
│   │   └── export-service.ts       # CSV & JSON file generators
│   └── components/
│       ├── layout/                 # MobileShell (iPhone 16 / Pixel / Full), BottomNav
│       ├── dashboard/              # HomeDashboard with ₹1,48,500 valuation & alerts
│       ├── products/               # ProductList, ProductDetail, Add/Edit modals
│       ├── scanner/                # ReceiptScannerModal, ReceiptConfirmationModal
│       ├── claim/                  # WarrantyClaimModal readiness & export
│       ├── service/                # AddServiceModal
│       ├── alerts/                 # AlertsScreen (Urgent, Upcoming, All)
│       ├── household/              # HouseholdModal (Owner, Editor, Viewer)
│       ├── ai/                     # AIAssistantModal
│       ├── stats/                  # StatisticsModal
│       ├── profile/                # ProfileScreen, notifications, privacy, security
│       └── auth/                   # OnboardingFlow, AuthModal, Guest mode
│
└── flutter_warranty_vault/         # Complete Native Flutter Project Tree
    ├── pubspec.yaml                # Flutter dependencies (Firebase, Hive, ML Kit)
    └── lib/
        ├── models/                 # Product, Warranty, ServiceRecord
        ├── services/               # WarrantyCalculator, AIService
        ├── repositories/           # ProductRepository, AuthRepository
        └── features/               # Dashboard, Scanner, Products, Alerts
```

---

## ⚙️ Environment Configuration

### `.env.example`
```env
# Server-side Gemini API Key for OCR & receipt understanding
GEMINI_API_KEY=your_gemini_api_key_here

# Dev server port
PORT=3000
NODE_ENV=development
```

> **Security Note**: Never place the Gemini API key or Firebase service keys inside client bundles. All AI calls route through `/api/ai/*` on the server.

---

## 🛠️ Local Development & Running

### 1. Web / Interactive Application
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# App runs at: http://localhost:3000
```

### 2. Native Flutter Application
```bash
cd flutter_warranty_vault

# Fetch dependencies
flutter pub get

# Run on connected device or simulator
flutter run

# Build Android APK
flutter build apk --release

# Build iOS IPA
flutter build ios --release
```

---

## 🔒 Firebase Security Rules Summary

- **Firestore**:
  - Personal products are restricted to the verified `request.auth.uid`.
  - Shared household records verify membership via subcollection lookups.
  - Viewers have read-only access; only Editors and Owners can update records.
- **Storage**:
  - File types restricted to `image/jpeg`, `image/png`, `image/webp`, and `application/pdf`.
  - Enforced 25MB maximum upload size limit.
