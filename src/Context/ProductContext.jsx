// src/Context/ProductContext.jsx - FULLY UPDATED WITH AUTO-REFRESH FIX
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  // Safe localStorage loader with migration
  const loadFromStorage = useCallback((key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === "[]") return defaultValue;
      const parsed = JSON.parse(saved);

      if (key === "products") {
        return parsed.map(product => ({
          ...product,
          mainImage: product.mainImage || product.image || (product.images?.[0] ?? null),
          carouselImages: product.carouselImages || (product.images?.slice(1) ?? []),
          images: product.images || (product.image ? [product.image] : []),
          image: product.image || product.mainImage || (product.images?.[0] ?? null),
          detailedDescription: product.detailedDescription || product.longDescription || product.description || "",
        }));
      }
      return parsed;
    } catch (e) {
      console.warn(`Failed to load ${key} from localStorage`, e);
      return defaultValue;
    }
  }, []);

  const [products, setProducts] = useState(() => loadFromStorage("products", [
    {
      id: 1, name: "Classic Wooden Frame (8x10)", price: 49, originalPrice: 79, category: "frames",
      mainImage: "https://m.media-amazon.com/images/I/618822mQcxL.jpg",
      carouselImages: ["https://m.media-amazon.com/images/I/71example-frame2.jpg", "https://m.media-amazon.com/images/I/81example-frame3.jpg"],
      images: ["https://m.media-amazon.com/images/I/618822mQcxL.jpg", "https://m.media-amazon.com/images/I/71example-frame2.jpg", "https://m.media-amazon.com/images/I/81example-frame3.jpg"],
      description: "Elegant solid wood frame with premium finish."
    },
    {
      id: 2, name: "Premium Leather Album", price: 299, originalPrice: 399, category: "albums",
      mainImage: "https://m.media-amazon.com/images/I/71T37AXEXvL.*AC_UF894,1000_QL80*.jpg",
      carouselImages: ["https://m.media-amazon.com/images/I/81leather-inside.jpg", "https://m.media-amazon.com/images/I/91leather-detail.jpg", "https://m.media-amazon.com/images/I/61leather-back.jpg"],
      images: ["https://m.media-amazon.com/images/I/71T37AXEXvL.*AC_UF894,1000_QL80*.jpg", "https://m.media-amazon.com/images/I/81leather-inside.jpg", "https://m.media-amazon.com/images/I/91leather-detail.jpg", "https://m.media-amazon.com/images/I/61leather-back.jpg"],
      description: "Handcrafted genuine leather album with acid-free pages."
    },
    {
      id: 3, name: "Custom Wedding Photo Book", price: 599, originalPrice: 699, category: "books",
      mainImage: "https://cdn-image.staticsfly.com/i/store/WF1130270/WF1130270_SY_WeddingPB_Marquee_2_798x627.webp?quality=80",
      carouselImages: ["https://example.com/wedding-book-open.jpg", "https://example.com/wedding-book-pages.jpg"],
      images: ["https://cdn-image.staticsfly.com/i/store/WF1130270/WF1130270_SY_WeddingPB_Marquee_2_798x627.webp?quality=80", "https://example.com/wedding-book-open.jpg", "https://example.com/wedding-book-pages.jpg"],
      description: "Personalized hardcover photo book for your special day."
    },
    {
      id: 4, name: "Metal Wall Frame Set", price: 149, originalPrice: 199, category: "frames",
      mainImage: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/3fb7379e-f06c-4cd6-a8bb-fbd1bbe52bef.**CR0,0,970,600_PT0_SX970_V1**_.png",
      images: ["https://m.media-amazon.com/images/S/aplus-media-library-service-media/3fb7379e-f06c-4cd6-a8bb-fbd1bbe52bef.**CR0,0,970,600_PT0_SX970_V1**_.png"],
      description: "Modern minimalist metal frames – set of 3."
    },
    {
      id: 5, name: "Collage Multi-Photo Frame", price: 199, originalPrice: 249, category: "frames",
      mainImage: "https://m.media-amazon.com/images/I/718bXRoIEzL.*AC_UF894,1000_QL80*.jpg",
      images: ["https://m.media-amazon.com/images/I/718bXRoIEzL.*AC_UF894,1000_QL80*.jpg"],
      description: "Display 8 photos in one beautiful collage frame."
    },
    {
      id: 6, name: "Handmade Scrapbook Album", price: 399, originalPrice: 499, category: "albums",
      mainImage: "https://c02.purpledshub.com/uploads/sites/51/2021/02/DIY-scrapbook-0c6eed7.jpg?w=1200",
      images: ["https://c02.purpledshub.com/uploads/sites/51/2021/02/DIY-scrapbook-0c6eed7.jpg?w=1200"],
      description: "Artisanal scrapbook with decorative pages and pockets."
    }
  ]));

  const [heroBanners, setHeroBanners] = useState(() => loadFromStorage("heroBanners", [
    { id: 1, title: "Frames Starting at ₹49", description: "Premium wooden & metal frames for every memory", image: "https://img.freepik.com/free-photo/copy-space-frame-with-sale-label_23-2148670043.jpg?w=740" },
    { id: 2, title: "Luxury Albums Up to 40% Off", description: "Handcrafted leather albums – timeless elegance", image: "https://static.vecteezy.com/system/resources/previews/002/104/115/non_2x/luxury-banner-roll-up-black-friday-sale-with-picture-slots-template-free-vector.jpg" },
    { id: 3, title: "Custom Photo Books", description: "Personalized hardcover books from ₹599", image: "https://blog.lulu.com/content/images/thumbnail/lulu-create-photobooks-main-banner-open-graph.png" },
    { id: 4, title: "Bundle & Save Big", description: "Frames + Albums + Books combos – extra 20% off", image: "https://media1.pbwwcdn.net/promotion_groups/pg-banner-910325559.jpeg" }
  ]));

  const [shopCategories, setShopCategories] = useState(() => loadFromStorage("shopCategories", [
    { id: 1, name: "Wedding Albums", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=70&auto=format&fit=crop", link: "/category/wedding-albums" },
    { id: 2, name: "Photo Frames", image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&q=70&auto=format&fit=crop", link: "/category/photo-frames" },
    { id: 3, name: "Pre-Wedding Shoots", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1200&q=70&auto=format&fit=crop", link: "/category/pre-wedding" },
    { id: 4, name: "Portrait Albums", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&q=70&auto=format&fit=crop", link: "/category/portraits" }
  ]));

  const [trendingProductIds, setTrendingProductIds] = useState(() => loadFromStorage("trendingProductIds", [1, 3, 5]));
  const [bestSellerProductIds, setBestSellerProductIds] = useState(() => loadFromStorage("bestSellerProductIds", [2, 4, 6]));
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem("isAdminLoggedIn") === "true");

  // 🔥 AUTO-REFRESH: Listen for storage changes from ADMIN TAB
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (!e.key) return;
      console.log(`🔥 [AUTO-REFRESH] Storage changed: ${e.key}`);
      
      switch (e.key) {
        case "products": setProducts(loadFromStorage("products", products)); break;
        case "heroBanners": setHeroBanners(loadFromStorage("heroBanners", heroBanners)); break;
        case "shopCategories": setShopCategories(loadFromStorage("shopCategories", shopCategories)); break;
        case "trendingProductIds": setTrendingProductIds(loadFromStorage("trendingProductIds", trendingProductIds)); break;
        case "bestSellerProductIds": setBestSellerProductIds(loadFromStorage("bestSellerProductIds", bestSellerProductIds)); break;
        case "isAdminLoggedIn": setIsAuthenticated(localStorage.getItem("isAdminLoggedIn") === "true"); break;
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadFromStorage, products, heroBanners, shopCategories, trendingProductIds, bestSellerProductIds]);

  // Save to localStorage
  const saveToStorage = useCallback((key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`💾 Saved ${key}: ${value.length || value?.length || '—'} items`);
    } catch (e) {
      console.warn(`Failed to save ${key}`, e);
    }
  }, []);

  useEffect(() => saveToStorage("products", products), [products, saveToStorage]);
  useEffect(() => saveToStorage("heroBanners", heroBanners), [heroBanners, saveToStorage]);
  useEffect(() => saveToStorage("shopCategories", shopCategories), [shopCategories, saveToStorage]);
  useEffect(() => saveToStorage("trendingProductIds", trendingProductIds), [trendingProductIds, saveToStorage]);
  useEffect(() => saveToStorage("bestSellerProductIds", bestSellerProductIds), [bestSellerProductIds, saveToStorage]);

  const login = () => {
    localStorage.setItem("isAdminLoggedIn", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAuthenticated(false);
  };

  const addProduct = (productData) => {
    const mainImage = productData.mainImage;
    const carouselImages = Array.isArray(productData.carouselImages) ? productData.carouselImages : [];
    const newProduct = {
      id: Date.now(),
      name: productData.name,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      category: productData.category || "uncategorized",
      description: productData.description || "",
      detailedDescription: productData.detailedDescription || productData.description || "",
      mainImage, carouselImages,
      images: [mainImage, ...carouselImages].filter(Boolean),
      image: mainImage,
    };
    setProducts(prev => [...prev, newProduct]);
    console.log(`✅ Added product #${newProduct.id}`);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const mainImage = updates.mainImage ?? p.mainImage;
      const carouselImages = Array.isArray(updates.carouselImages) ? updates.carouselImages : (updates.carouselImages === undefined ? p.carouselImages : []);
      const merged = {
        ...p,
        ...updates,
        mainImage,
        carouselImages,
        images: [mainImage, ...(carouselImages || [])].filter(Boolean),
        image: mainImage,
      };
      console.log(`♻️ Updated product #${id}`, merged);
      return merged;
    }));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setTrendingProductIds(prev => prev.filter(pid => pid !== id));
    setBestSellerProductIds(prev => prev.filter(pid => pid !== id));
    console.log(`🗑️ Deleted product #${id}`);
  };

  const toggleTrending = (id) => setTrendingProductIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleBestSeller = (id) => setBestSellerProductIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // Manual refresh trigger (for dev/debug)
  const refreshAll = () => {
    setProducts(loadFromStorage("products", products));
    setHeroBanners(loadFromStorage("heroBanners", heroBanners));
    setShopCategories(loadFromStorage("shopCategories", shopCategories));
    setTrendingProductIds(loadFromStorage("trendingProductIds", trendingProductIds));
    setBestSellerProductIds(loadFromStorage("bestSellerProductIds", bestSellerProductIds));
    console.log("🔄 Manual refresh triggered");
  };

  return (
    <ProductContext.Provider value={{
      products, heroBanners, shopCategories, trendingProductIds, bestSellerProductIds,
      addProduct, updateProduct, deleteProduct, toggleTrending, toggleBestSeller, setHeroBanners, setShopCategories,
      isAuthenticated, login, logout, refreshAll, // ← refreshAll for manual testing
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;