import { createContext, useContext, useState, useEffect } from "react";
const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    if (saved && saved !== "[]") {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old single-image format to new multi-image format
        return parsed.map(product => ({
          ...product,
          mainImage: product.mainImage || (product.images ? product.images[0] : product.image),
          carouselImages: product.carouselImages || (product.images ? product.images.slice(1) : []),
          images: product.images || (product.image ? [product.image] : []),
          image: product.image || product.mainImage || (product.images ? product.images[0] : null),
        }));
      } catch (e) {
        console.warn("Failed to parse saved products", e);
      }
    }
    // Default products with multi-image support
    return [
      {
        id: 1,
        name: "Classic Wooden Frame (8x10)",
        price: 49,
        originalPrice: 79,
        category: "frames",
        mainImage: "https://m.media-amazon.com/images/I/618822mQcxL.jpg",
        carouselImages: [
          "https://m.media-amazon.com/images/I/71example-frame2.jpg",
          "https://m.media-amazon.com/images/I/81example-frame3.jpg"
        ],
        images: [
          "https://m.media-amazon.com/images/I/618822mQcxL.jpg",
          "https://m.media-amazon.com/images/I/71example-frame2.jpg",
          "https://m.media-amazon.com/images/I/81example-frame3.jpg"
        ],
        description: "Elegant solid wood frame with premium finish."
      },
      {
        id: 2,
        name: "Premium Leather Album",
        price: 299,
        originalPrice: 399,
        category: "albums",
        mainImage: "https://m.media-amazon.com/images/I/71T37AXEXvL.*AC_UF894,1000_QL80*.jpg",
        carouselImages: [
          "https://m.media-amazon.com/images/I/81leather-inside.jpg",
          "https://m.media-amazon.com/images/I/91leather-detail.jpg",
          "https://m.media-amazon.com/images/I/61leather-back.jpg"
        ],
        images: [
          "https://m.media-amazon.com/images/I/71T37AXEXvL.*AC_UF894,1000_QL80*.jpg",
          "https://m.media-amazon.com/images/I/81leather-inside.jpg",
          "https://m.media-amazon.com/images/I/91leather-detail.jpg",
          "https://m.media-amazon.com/images/I/61leather-back.jpg"
        ],
        description: "Handcrafted genuine leather album with acid-free pages."
      },
      {
        id: 3,
        name: "Custom Wedding Photo Book",
        price: 599,
        originalPrice: 699,
        category: "books",
        mainImage: "https://cdn-image.staticsfly.com/i/store/WF1130270/WF1130270_SY_WeddingPB_Marquee_2_798x627.webp?quality=80",
        carouselImages: [
          "https://example.com/wedding-book-open.jpg",
          "https://example.com/wedding-book-pages.jpg"
        ],
        images: [
          "https://cdn-image.staticsfly.com/i/store/WF1130270/WF1130270_SY_WeddingPB_Marquee_2_798x627.webp?quality=80",
          "https://example.com/wedding-book-open.jpg",
          "https://example.com/wedding-book-pages.jpg"
        ],
        description: "Personalized hardcover photo book for your special day."
      },
      {
        id: 4,
        name: "Metal Wall Frame Set",
        price: 149,
        originalPrice: 199,
        category: "frames",
        mainImage: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/3fb7379e-f06c-4cd6-a8bb-fbd1bbe52bef.**CR0,0,970,600_PT0_SX970_V1**_.png",
        carouselImages: [],
        images: [
          "https://m.media-amazon.com/images/S/aplus-media-library-service-media/3fb7379e-f06c-4cd6-a8bb-fbd1bbe52bef.**CR0,0,970,600_PT0_SX970_V1**_.png"
        ],
        description: "Modern minimalist metal frames – set of 3."
      },
      {
        id: 5,
        name: "Collage Multi-Photo Frame",
        price: 199,
        originalPrice: 249,
        category: "frames",
        mainImage: "https://m.media-amazon.com/images/I/718bXRoIEzL.*AC_UF894,1000_QL80*.jpg",
        carouselImages: [],
        images: [
          "https://m.media-amazon.com/images/I/718bXRoIEzL.*AC_UF894,1000_QL80*.jpg"
        ],
        description: "Display 8 photos in one beautiful collage frame."
      },
      {
        id: 6,
        name: "Handmade Scrapbook Album",
        price: 399,
        originalPrice: 499,
        category: "albums",
        mainImage: "https://c02.purpledshub.com/uploads/sites/51/2021/02/DIY-scrapbook-0c6eed7.jpg?w=1200",
        carouselImages: [],
        images: [
          "https://c02.purpledshub.com/uploads/sites/51/2021/02/DIY-scrapbook-0c6eed7.jpg?w=1200"
        ],
        description: "Artisanal scrapbook with decorative pages and pockets."
      },
    ];
  });
  const [heroBanners, setHeroBanners] = useState(() => {
    const saved = localStorage.getItem("heroBanners");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Frames Starting at ₹49",
        description: "Premium wooden & metal frames for every memory",
        image: "https://img.freepik.com/free-photo/copy-space-frame-with-sale-label_23-2148670043.jpg?w=740",
      },
      {
        id: 2,
        title: "Luxury Albums Up to 40% Off",
        description: "Handcrafted leather albums – timeless elegance",
        image: "https://static.vecteezy.com/system/resources/previews/002/104/115/non_2x/luxury-banner-roll-up-black-friday-sale-with-picture-slots-template-free-vector.jpg",
      },
      {
        id: 3,
        title: "Custom Photo Books",
        description: "Personalized hardcover books from ₹599",
        image: "https://blog.lulu.com/content/images/thumbnail/lulu-create-photobooks-main-banner-open-graph.png",
      },
      {
        id: 4,
        title: "Bundle & Save Big",
        description: "Frames + Albums + Books combos – extra 20% off",
        image: "https://media1.pbwwcdn.net/promotion_groups/pg-banner-910325559.jpeg",
      },
    ];
  });
  const [shopCategories, setShopCategories] = useState(() => {
    const saved = localStorage.getItem("shopCategories");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: "Wedding Albums",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=70&auto=format&fit=crop",
        link: "/category/wedding-albums",
      },
      {
        id: 2,
        name: "Photo Frames",
        image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=1200&q=70&auto=format&fit=crop",
        link: "/category/photo-frames",
      },
      {
        id: 3,
        name: "Pre-Wedding Shoots",
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1200&q=70&auto=format&fit=crop",
        link: "/category/pre-wedding",
      },
      {
        id: 4,
        name: "Portrait Albums",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&q=70&auto=format&fit=crop",
        link: "/category/portraits",
      },
    ];
  });
  const [trendingProductIds, setTrendingProductIds] = useState(() => {
    const saved = localStorage.getItem("trendingProductIds");
    return saved ? JSON.parse(saved) : [1, 3, 5];
  });
  const [bestSellerProductIds, setBestSellerProductIds] = useState(() => {
    const saved = localStorage.getItem("bestSellerProductIds");
    return saved ? JSON.parse(saved) : [2, 4, 6];
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });
  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAdminLoggedIn", "true");
  };
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAdminLoggedIn");
  };
  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("products", JSON.stringify(products));
    } catch (e) {
      console.warn("Could not save products to localStorage", e);
    }
  }, [products]);
  useEffect(() => {
    try {
      localStorage.setItem("heroBanners", JSON.stringify(heroBanners));
    } catch (e) {
      console.warn("Could not save heroBanners", e);
    }
  }, [heroBanners]);
  useEffect(() => {
    try {
      localStorage.setItem("shopCategories", JSON.stringify(shopCategories));
    } catch (e) {
      console.warn("Could not save shopCategories", e);
    }
  }, [shopCategories]);
  useEffect(() => {
    try {
      localStorage.setItem("trendingProductIds", JSON.stringify(trendingProductIds));
    } catch (e) {
      console.warn(e);
    }
  }, [trendingProductIds]);
  useEffect(() => {
    try {
      localStorage.setItem("bestSellerProductIds", JSON.stringify(bestSellerProductIds));
    } catch (e) {
      console.warn(e);
    }
  }, [bestSellerProductIds]);
  // Add new product with full multi-image support
  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      name: productData.name,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
      category: productData.category,
      description: productData.description || "Premium quality handcrafted product.",
      mainImage: productData.mainImage,
      carouselImages: productData.carouselImages || [],
      images: productData.images && productData.images.length > 0
        ? productData.images
        : productData.mainImage
          ? [productData.mainImage, ...(productData.carouselImages || [])]
          : [],
    };
    newProduct.image = newProduct.image || newProduct.mainImage || newProduct.images?.[0] || null;
    console.log("[ProductContext] addProduct() ->", newProduct);
    setProducts(prev => {
      const next = [...prev, newProduct];
      console.log("[ProductContext] products ids ->", next.map(p => p.id));
      return next;
    });
  };
  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setTrendingProductIds(prev => prev.filter(pid => pid !== id));
    setBestSellerProductIds(prev => prev.filter(pid => pid !== id));
  };
  const toggleTrending = (id) => {
    setTrendingProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  const toggleBestSeller = (id) => {
    setBestSellerProductIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };
  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      deleteProduct,
      heroBanners,
      setHeroBanners,
      shopCategories,
      setShopCategories,
      trendingProductIds,
      bestSellerProductIds,
      toggleTrending,
      toggleBestSeller,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;