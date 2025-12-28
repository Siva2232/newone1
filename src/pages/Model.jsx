// src/pages/ProductsShop.jsx
import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { Search, ArrowRight, Sparkles, ShieldCheck, Zap, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../Context/ProductContext";

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
  const { products, trendingProductIds, bestSellerProductIds } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Filter products based on search, category and admin-selected featured filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const targetCategory = categoryMap[selectedCategory];
      const matchesCategory = targetCategory === "All" || product.category === targetCategory;
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
    <div className="min-h-screen bg-[#fafafa] text-gray-900 selection:bg-yellow-200">
      
      {/* Hero Banner */}
      <section className="relative w-full h-[65vh] md:h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&w=2000&q=90"
            alt="Premium Albums & Frames"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-yellow-400 font-black text-[10px] md:text-xs uppercase tracking-[0.5em] block mb-4 border-l-2 border-yellow-400 pl-4">
              Exclusive Craftsmanship
            </span>
            <h1 className="text-white text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-6">
              OUR <br />
              <span className="text-transparent [-webkit-text-stroke:1.5px_#fff] italic">PRODUCTS</span>
            </h1>
            <p className="text-gray-300 font-medium max-w-lg text-sm md:text-lg leading-relaxed mb-8">
              Transforming your digital memories into 
              <span className="text-white font-bold ml-1">Physical Masterpieces</span>. 
              Premium textures, museum-grade paper, and timeless frames.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-16 md:top-20 z-40 px-4 md:px-6 -mt-10 mb-12">
        <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] p-2 md:p-3 flex flex-col md:flex-row gap-3 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-400/50 transition-all text-sm font-bold outline-none"
            />
          </div>

          <div className="flex gap-3 items-center overflow-x-auto scrollbar-hide w-full md:w-auto px-2 pb-1">
            <div className="flex gap-2 mr-4">
              {['All', 'Trending', 'Best Sellers'].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFilter(f)}
                  className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedFilter === f ? "bg-black text-white shadow-lg scale-105" : "bg-white text-gray-400 border border-gray-100 hover:text-black"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-black text-white shadow-lg scale-105"
                      : "bg-white text-gray-400 border border-gray-100 hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-2xl font-black text-gray-400 mb-4">No products found</p>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                    key={product.id}
                    className="group"
                  >
                    <Link to={`/product/${product.id}`} className="block h-full">
                      <div className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                        <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                          <img
                            // Use first image from images array, fallback to old image field
                            src={
                              (product.images && product.images.length > 0 
                                ? product.images[0] 
                                : (product.mainImage || product.image)) || "https://via.placeholder.com/600x800?text=No+Image"
                            }
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />

                          {/* Trending/Best Seller Badges */}
                          <div className="absolute left-5 top-5 flex flex-col gap-2 z-20">
                            {trendingProductIds.includes(product.id) && (
                              <div className="bg-amber-600 text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Trending</div>
                            )}
                            {bestSellerProductIds.includes(product.id) && (
                              <div className="bg-green-600 text-white px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">Best Seller</div>
                            )}
                          </div>

                          <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                            {product.category || "Product"}
                          </div>

                          {/* Discount Badge */}
                          {product.originalPrice && (
                            <div className="absolute top-5 right-5 bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </div>
                          )}
                        </div>

                        <div className="p-6 text-center flex flex-col flex-grow">
                          <h3 className="font-black text-xs md:text-sm uppercase tracking-tighter mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">
                            {product.name}
                          </h3>

                          <div className="mb-6">
                            <p className="text-2xl font-black text-gray-900">₹{product.price}</p>
                            {product.originalPrice && (
                              <p className="text-sm line-through text-gray-400">₹{product.originalPrice}</p>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage(product)}`, '_blank');
                            }}
                            className="mt-auto w-full bg-black text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-yellow-400 hover:text-black transition-all font-black text-[9px] uppercase tracking-widest active:scale-95"
                          >
                            <WhatsAppIcon size={16} />
                            Order on WhatsApp
                          </button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black text-white rounded-t-[50px] md:rounded-t-[100px]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Sparkles, label: "Premium Finish" },
            { icon: ShieldCheck, label: "Lifetime Warranty" },
            { icon: Zap, label: "Express Delivery" },
            { icon: Gift, label: "Luxury Packing" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-black mb-4 shadow-lg">
                <item.icon size={24} />
              </div>
              <h4 className="font-black uppercase tracking-widest text-xs md:text-sm">{item.label}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Custom CSS */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        [class*="-webkit-text-stroke"] {
          -webkit-text-stroke: 1.5px #fff;
        }
      `}</style>
    </div>
  );
}