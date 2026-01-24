// src/pages/ProductsShop.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowRight, Sparkles, ShieldCheck, Zap, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../Context/ProductContext";
import ProductCard from "../components/common/ProductCard";

// WhatsApp number
const whatsappNumber = "9746683778";

export const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

// Category mapping for filtering
const categoryMap = {
  "All": "All",
  "Frames": "frames",
  "Albums": "albums",
  "Photo Books": "books",
  "Accessories": "accessories"
};

const categories = ["All", "Frames", "Albums", "Photo Books", "Accessories"];

export default function ProductsShop() {
  const { products, shopCategories, trendingProductIds, bestSellerProductIds } = useProducts();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Read category from URL and set it on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      console.log('[Model] Category from URL:', categoryParam);
    }
  }, [searchParams]);

  // Map product categories to shop categories
  const getCategoryMatch = (productCategory, shopCategoryName) => {
    const lowerProdCat = productCategory.toLowerCase();
    const lowerShopCat = shopCategoryName.toLowerCase();
    
    // Direct matches
    if (lowerProdCat === lowerShopCat) return true;
    if (lowerShopCat.includes(lowerProdCat)) return true;
    
    // Smart matching
    if (lowerProdCat === "frames" && lowerShopCat.includes("frame")) return true;
    if (lowerProdCat === "albums" && lowerShopCat.includes("album")) return true;
    if (lowerProdCat === "books" && (lowerShopCat.includes("book") || lowerShopCat.includes("photo"))) return true;
    
    return false;
  };

  // Filter products based on search, category and admin-selected featured filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory !== 'All') {
        matchesCategory = getCategoryMatch(product.category, selectedCategory);
      }
      
      const matchesFilter =
        selectedFilter === 'All' ||
        (selectedFilter === 'Trending' && trendingProductIds.includes(product.id)) ||
        (selectedFilter === 'Best Sellers' && bestSellerProductIds.includes(product.id));
      
      return matchesSearch && matchesCategory && matchesFilter;
    });
  }, [products, searchQuery, selectedCategory, selectedFilter, trendingProductIds, bestSellerProductIds]);

  const whatsappMessage = (product) => encodeURIComponent(
    `Hi! I'm interested in the ${product.name} priced at ₹${product.price}.\nCategory: ${product.category}\nCan you share more details and confirm availability?`
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* BANNER */}
      <section className="px-4 pt-24 pb-6">
        <div className="max-w-7xl mx-auto relative group rounded-[2.5rem] overflow-hidden shadow-2xl h-56 md:h-64 bg-zinc-900 transition-all duration-500">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070" 
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-70"
              alt="Banner"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">
                Exclusive Deal
              </span>
              <h3 className="text-xl md:text-2xl font-medium text-gray-200 mb-1 italic tracking-tighter">Season Launch</h3>
              <p className="text-4xl md:text-6xl font-black text-[#f7ef22] tracking-tighter leading-none mb-4">
                FLAT 20% OFF
              </p>
              <button className="bg-[#f7ef22] text-black text-[10px] font-black px-6 py-3 rounded-xl uppercase tracking-widest hover:scale-105 transition-transform">
                Claim Offer
              </button>
            </div>
          </div>
          
          {/* Animated Shine Effect */}
          <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine" />
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <div className="sticky top-0 z-40 bg-[#fafafa]/80 backdrop-blur-xl border-b border-zinc-100 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full bg-zinc-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full md:w-auto">
            {['All', ...shopCategories.map(c => c.name)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border
                  ${selectedCategory === cat ? "bg-black text-white border-black shadow-lg" : "bg-white text-zinc-400 border-zinc-100 hover:border-black hover:text-black"}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const discountPercentage = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
              const isTrending = trendingProductIds?.includes(product.id);
              const isBestSeller = bestSellerProductIds?.includes(product.id);

              return (
                <motion.div 
                  layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id} className="group relative h-full"
                >
                  <ProductCard
                    product={product}
                    whatsappNumber={whatsappNumber}
                    getDisplayCategory={(cat) => cat}
                    WhatsAppIcon={WhatsAppIcon}
                    trendingProductIds={trendingProductIds}
                    bestSellerProductIds={bestSellerProductIds}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-12deg); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateX(150%) skewX(-12deg); opacity: 0; }
        }
        .group-hover\\:animate-shine { animation: shine 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
