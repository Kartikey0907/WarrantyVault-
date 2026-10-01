import React, { useState, useEffect } from "react";
import { Product, AlertNotification, Household, UserSettings, UserProfile, OCRScanResult, ServiceRecord } from "./types";
import { StorageService } from "./core/storage";
import { MobileShell } from "./components/layout/MobileShell";
import { BottomNav, NavTab } from "./components/layout/BottomNav";
import { HomeDashboard } from "./components/dashboard/HomeDashboard";
import { ProductList } from "./components/products/ProductList";
import { ProductDetail } from "./components/products/ProductDetail";
import { AddProductModal } from "./components/products/AddProductModal";
import { EditProductModal } from "./components/products/EditProductModal";
import { ReceiptScannerModal } from "./components/scanner/ReceiptScannerModal";
import { ReceiptConfirmationModal } from "./components/scanner/ReceiptConfirmationModal";
import { WarrantyClaimModal } from "./components/claim/WarrantyClaimModal";
import { AddServiceModal } from "./components/service/AddServiceModal";
import { AlertsScreen } from "./components/alerts/AlertsScreen";
import { AIAssistantModal } from "./components/ai/AIAssistantModal";
import { StatisticsModal } from "./components/stats/StatisticsModal";
import { HouseholdModal } from "./components/household/HouseholdModal";
import { ProfileScreen } from "./components/profile/ProfileScreen";
import { OnboardingFlow } from "./components/auth/OnboardingFlow";
import { AuthModal } from "./components/auth/AuthModals";

export default function App() {
  // App initialization state
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // User & Settings
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());

  // Main data collections
  const [products, setProducts] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [household, setHousehold] = useState<Household>(StorageService.getHousehold());

  // Navigation
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Active Modals
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [scanResultToConfirm, setScanResultToConfirm] = useState<OCRScanResult | null>(null);
  const [claimProduct, setClaimProduct] = useState<Product | null>(null);
  const [serviceProduct, setServiceProduct] = useState<Product | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showHouseholdModal, setShowHouseholdModal] = useState(false);

  // Initial load from storage
  useEffect(() => {
    const savedUser = StorageService.getUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      // Default to guest profile with sample records for instant testing
      const guestUser: UserProfile = {
        id: "guest-user-1",
        name: "Kumar Karnayak",
        email: "kumarkarnayak@gmail.com",
        isGuest: true,
        currency: "INR",
        createdAt: new Date().toISOString(),
      };
      setUser(guestUser);
      StorageService.saveUser(guestUser);
    }

    const hasSeenOnboarding = StorageService.hasSeenOnboarding();
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    setHasCheckedOnboarding(true);

    // Load persisted products & alerts
    setProducts(StorageService.getProducts());
    setAlerts(StorageService.getAlerts());
    setHousehold(StorageService.getHousehold());
  }, []);

  const handleCompleteOnboarding = () => {
    StorageService.setHasSeenOnboarding(true);
    setShowOnboarding(false);
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = StorageService.saveSettings(newSettings);
    setSettings(updated);
  };

  // Product CRUD handlers
  const handleSaveNewProduct = (newProductData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    const newProduct: Product = {
      ...newProductData,
      id: "prod-" + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    StorageService.addProduct(newProduct);
    const updatedProducts = StorageService.getProducts();
    setProducts(updatedProducts);
    setAlerts(StorageService.getAlerts());
    setShowAddManualModal(false);
    setSelectedProduct(newProduct);
  };

  const handleSaveMultipleProductsFromScan = (
    productsData: Omit<Product, "id" | "createdAt" | "updatedAt">[]
  ) => {
    let lastSaved: Product | null = null;
    productsData.forEach((pData, idx) => {
      const p: Product = {
        ...pData,
        id: `prod-scan-${Date.now()}-${idx}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      StorageService.addProduct(p);
      lastSaved = p;
    });

    const updated = StorageService.getProducts();
    setProducts(updated);
    setAlerts(StorageService.getAlerts());
    setScanResultToConfirm(null);
    if (lastSaved) {
      setSelectedProduct(lastSaved);
    }
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    StorageService.updateProduct(updatedProduct);
    setProducts(StorageService.getProducts());
    if (selectedProduct?.id === updatedProduct.id) {
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    StorageService.deleteProduct(productId);
    setProducts(StorageService.getProducts());
    setAlerts(StorageService.getAlerts());
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  const handleAddServiceRecord = (record: Omit<ServiceRecord, "id" | "createdAt">) => {
    if (!serviceProduct) return;
    StorageService.addServiceRecord(serviceProduct.id, record);
    const updatedProducts = StorageService.getProducts();
    setProducts(updatedProducts);
    const refreshed = updatedProducts.find((p) => p.id === serviceProduct.id);
    if (refreshed) {
      setSelectedProduct(refreshed);
    }
    setServiceProduct(null);
  };

  // Alerts handlers
  const handleMarkAlertRead = (alertId: string) => {
    StorageService.markAlertAsRead(alertId);
    setAlerts(StorageService.getAlerts());
  };

  const handleMarkAllAlertsRead = () => {
    StorageService.markAllAlertsRead();
    setAlerts(StorageService.getAlerts());
  };

  const handleNavigateToProductFromAlert = (productId?: string) => {
    if (!productId) return;
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  // Reset to canonical sample data
  const handleResetSampleData = () => {
    StorageService.resetToSampleData();
    setProducts(StorageService.getProducts());
    setAlerts(StorageService.getAlerts());
    setHousehold(StorageService.getHousehold());
    setSelectedProduct(null);
  };

  // Wipe account and reset
  const handleDeleteAccount = () => {
    StorageService.wipeAllData();
    setUser(null);
    setProducts([]);
    setAlerts([]);
    setShowOnboarding(true);
  };

  // Logout
  const handleLogout = () => {
    StorageService.saveUser(null);
    setUser(null);
    setShowAuthModal(true);
  };

  if (!hasCheckedOnboarding) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Loading WarrantyVault...</div>;
  }

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <MobileShell activeTabTitle={selectedProduct ? selectedProduct.name : currentTab}>
      {showOnboarding ? (
        <OnboardingFlow onComplete={handleCompleteOnboarding} />
      ) : selectedProduct ? (
        <ProductDetail
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onEdit={(p) => {
            setSelectedProduct(p);
            setShowEditProductModal(true);
          }}
          onDelete={handleDeleteProduct}
          onOpenWarrantyClaim={(p) => setClaimProduct(p)}
          onOpenAddService={(p) => setServiceProduct(p)}
        />
      ) : (
        <>
          {/* Main Tab Views */}
          {currentTab === "home" && (
            <HomeDashboard
              user={user}
              products={products}
              alerts={alerts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenScanner={() => setShowScannerModal(true)}
              onOpenAddManual={() => setShowAddManualModal(true)}
              onOpenSearch={() => setCurrentTab("products")}
              onOpenAIAssistant={() => setShowAIAssistant(true)}
              onOpenStatistics={() => setShowStatistics(true)}
              onOpenHousehold={() => setShowHouseholdModal(true)}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === "products" && (
            <ProductList
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onOpenAddProduct={() => setShowAddManualModal(true)}
            />
          )}

          {currentTab === "alerts" && (
            <AlertsScreen
              alerts={alerts}
              onMarkAsRead={handleMarkAlertRead}
              onMarkAllAsRead={handleMarkAllAlertsRead}
              onSelectProductById={handleNavigateToProductFromAlert}
            />
          )}

          {currentTab === "profile" && (
            <ProfileScreen
              user={user}
              settings={settings}
              products={products}
              household={household}
              onUpdateSettings={handleUpdateSettings}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
              onResetSampleData={handleResetSampleData}
              onOpenHousehold={() => setShowHouseholdModal(true)}
            />
          )}

          {/* Bottom Navigation */}
          <BottomNav
            currentTab={currentTab}
            onTabChange={(tab) => {
              setSelectedProduct(null);
              setCurrentTab(tab);
            }}
            unreadAlertsCount={unreadAlertsCount}
            onOpenScanner={() => setShowScannerModal(true)}
          />
        </>
      )}

      {/* MODALS */}
      {/* 1. Receipt Scanner */}
      <ReceiptScannerModal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        onReceiptProcessed={(result) => {
          setShowScannerModal(false);
          setScanResultToConfirm(result);
        }}
      />

      {/* 2. Receipt Confirmation & Multi-product extractor */}
      {scanResultToConfirm && (
        <ReceiptConfirmationModal
          isOpen={Boolean(scanResultToConfirm)}
          scanResult={scanResultToConfirm}
          onClose={() => setScanResultToConfirm(null)}
          onSaveProducts={handleSaveMultipleProductsFromScan}
        />
      )}

      {/* 3. Manual Add Product */}
      <AddProductModal
        isOpen={showAddManualModal}
        onClose={() => setShowAddManualModal(false)}
        onSaveProduct={handleSaveNewProduct}
        onSwitchToScan={() => {
          setShowAddManualModal(false);
          setShowScannerModal(true);
        }}
      />

      {/* 4. Edit Product */}
      {selectedProduct && (
        <EditProductModal
          isOpen={showEditProductModal}
          product={selectedProduct}
          onClose={() => setShowEditProductModal(false)}
          onSave={handleUpdateProduct}
        />
      )}

      {/* 5. Warranty Claim Assistant */}
      {claimProduct && (
        <WarrantyClaimModal
          isOpen={Boolean(claimProduct)}
          product={claimProduct}
          onClose={() => setClaimProduct(null)}
          onUpdateProduct={(updated) => {
            handleUpdateProduct(updated);
            setClaimProduct(updated);
          }}
        />
      )}

      {/* 6. Add Service Record */}
      {serviceProduct && (
        <AddServiceModal
          isOpen={Boolean(serviceProduct)}
          product={serviceProduct}
          onClose={() => setServiceProduct(null)}
          onSaveServiceRecord={handleAddServiceRecord}
        />
      )}

      {/* 7. AI Assistant */}
      <AIAssistantModal
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        products={products}
      />

      {/* 8. Valuation & Statistics */}
      <StatisticsModal
        isOpen={showStatistics}
        onClose={() => setShowStatistics(false)}
        products={products}
      />

      {/* 9. Household Sharing */}
      <HouseholdModal
        isOpen={showHouseholdModal}
        onClose={() => setShowHouseholdModal(false)}
        household={household}
        onUpdateHousehold={(updated) => {
          setHousehold(updated);
          StorageService.saveHousehold(updated);
        }}
      />

      {/* 10. Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(u) => {
          setUser(u);
          StorageService.saveUser(u);
        }}
        onContinueGuest={() => {
          const guestUser: UserProfile = {
            id: "guest-user-1",
            name: "Vault Guest",
            email: "guest@warrantyvault.local",
            isGuest: true,
            currency: "INR",
            createdAt: new Date().toISOString(),
          };
          setUser(guestUser);
          StorageService.saveUser(guestUser);
        }}
      />
    </MobileShell>
  );
}
