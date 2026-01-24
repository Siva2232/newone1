// src/components/admin/FeaturedManagement.jsx
import { useState } from "react";
import { useProducts } from "../../Context/ProductContext";
import { Star, Award, Search, X, TrendingUp, DollarSign } from "lucide-react";

export default function FeaturedManagement() {
  const {
    products,
    trendingProductIds,
    bestSellerProductIds,
    toggleTrending,
    toggleBestSeller,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");

  const filterProducts = (list) =>
    products.filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

  const filteredProducts = filterProducts(products);

  const handleToggleTrending = (id) => {
    const isCurrentlyTrending = trendingProductIds.includes(id);
    if (isCurrentlyTrending && !window.confirm("Remove from Trending?")) return;
    toggleTrending(id);
  };

  const handleToggleBestSeller = (id) => {
    const isCurrentlyBest = bestSellerProductIds.includes(id);
    if (isCurrentlyBest && !window.confirm("Remove from Best Sellers?")) return;
    toggleBestSeller(id);
  };

  const TrendingSection = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
    <div className="px-6 py-4 md:py-5">
  <div className="flex items-center justify-between flex-wrap gap-4">
    <div className="flex items-center gap-3">
      <TrendingUp size={26} className="text-gray-800" />
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        Trending Now
      </h2>
    </div>

    <div className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium border border-gray-300">
      {trendingProductIds.length} selected
    </div>
  </div>
</div>


      <div className="p-6">
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                     focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products match your search
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredProducts.map((product) => {
              const isTrending = trendingProductIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isTrending
                      ? "border-amber-500 shadow-xl scale-[1.02] bg-amber-50/40"
                      : "border-gray-200 hover:border-amber-300 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={
                        product.mainImage ||
                        product.images?.[0] ||
                        product.image ||
                        "https://via.placeholder.com/300?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isTrending && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        Trending
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem] mb-2">
                      {product.name}
                    </h4>

                    <button
                      onClick={() => handleToggleTrending(product.id)}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isTrending
                          ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                          : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                      }`}
                    >
                      {isTrending ? "Remove from Trending" : "Mark Trending"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const BestSellersSection = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
<div className="px-6 py-4 md:py-5">
  <div className="flex items-center justify-between flex-wrap gap-4">
    <div className="flex items-center gap-3">
      <Award size={26} className="text-gray-800" />
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        Best Sellers
      </h2>
    </div>

    <div className="px-3 py-1 rounded-full text-gray-800 text-sm font-medium border border-gray-300">
      {bestSellerProductIds.length} selected
    </div>
  </div>
</div>


      <div className="p-6">
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                     focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products match your search
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredProducts.map((product) => {
              const isBest = bestSellerProductIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isBest
                      ? "border-emerald-500 shadow-xl scale-[1.02] bg-emerald-50/40"
                      : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={
                        product.mainImage ||
                        product.images?.[0] ||
                        product.image ||
                        "https://via.placeholder.com/300?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isBest && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        Best Seller
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem] mb-2">
                      {product.name}
                    </h4>

                    <button
                      onClick={() => handleToggleBestSeller(product.id)}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isBest
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                          : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                      }`}
                    >
                      {isBest ? "Remove from Best Sellers" : "Mark Best Seller"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-10">
      <TrendingSection />
      <BestSellersSection />
    </div>
  );
}