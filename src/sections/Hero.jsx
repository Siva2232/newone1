// src/pages/Hero.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../Context/ProductContext";

// WhatsApp business number
const whatsappNumber = "9746683778";

// Inline WhatsApp SVG
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

// Special Offers Carousel (unchanged - your original data)
const specialOffers = [
  {
    title: "Hot Deal: Frames",
    highlight: "Starting ₹49",
    description: "Premium quality frames – limited time offer",
    image: "https://www.shutterstock.com/image-vector/sale-photo-frame-banner-square-260nw-2662612137.jpg",
  },
  {
    title: "Luxury Albums",
    highlight: "From ₹299",
    description: "Handcrafted genuine leather albums",
    image: "https://img.freepik.com/free-vector/elegant-aesthetic-luxury-jewelry-halfpage-banner-template_742173-17440.jpg",
  },
  {
    title: "Photo Books Sale",
    highlight: "Up to 30% Off",
    description: "Custom hardcover photo books",
    image: "https://cdn-image.staticsfly.com/i/landingpages/2025/SYECM1215_Dec_HP_YIR_3up_Photo-prints.jpg",
  },
  {
    title: "Bundle Offers",
    highlight: "Save Extra 20%",
    description: "Buy frames + albums together",
    image: "https://media1.pbwwcdn.net/promotion_groups/pg-banner-541289369.jpeg",
  },
  {
    title: "Limited Stock",
    highlight: "₹49 Only",
    description: "Classic wooden frames – grab now!",
    image: "https://www.shutterstock.com/image-vector/49-rupee-off-sale-discount-260nw-2142090367.jpg",
  },
];

const descriptions = {
  "Trending Now": "Explore what’s hot and trending right now.",
  "Best Sellers": "Our most loved and top-selling products.",
  "Shop By Category": "Browse products by your favorite categories.",
};

const getDisplayCategory = (cat) => {
  switch (cat) {
    case "frames": return "Frames";
    case "albums": return "Albums";
    case "books": return "Photo Books";
    default: return cat || "";
  }
};

const ProductCard = ({ 
  product, 
  whatsappNumber, 
  getDisplayCategory = (cat) => cat, 
  WhatsAppIcon,
  trendingProductIds = [],
  bestSellerProductIds = [],
}) => {
  const displayCategory = typeof getDisplayCategory === 'function' 
    ? getDisplayCategory(product.category) 
    : product.category;
  const isTrending = trendingProductIds.includes(product.id);
  const isBestSeller = bestSellerProductIds.includes(product.id);

  const formatPrice = (num) => new Intl.NumberFormat('en-IN').format(num);

  const message = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} priced at ₹${product.price}.
Category: ${displayCategory}
Can you provide more details, customization options, and confirm availability?`
  );

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  return (
    <Link to={`/product/${product.id}`} className="group block h-full">
      <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(247,239,34,0.15)] transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative">
        <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
          {discountPercentage > 0 && (
            <div className="absolute top-4 left-4 z-20 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter">
              {discountPercentage}% Off
            </div>
          )}
          <div className="absolute top-4 right-4 z-20 backdrop-blur-md bg-white/70 border border-white/20 px-3 py-1 rounded-full">
            <p className="text-[10px] font-bold text-gray-800 uppercase tracking-widest leading-none">
              {displayCategory}
            </p>
          </div>

          {/* Trending / Best Seller Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2 z-30">
            {isTrending && (
              <div className="bg-amber-600 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Trending</div>
            )}
            {isBestSeller && (
              <div className="bg-green-600 text-white px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Best Seller</div>
            )}
          </div> 

          <img
            src={product.image || product.mainImage || product.images?.[0] || "https://via.placeholder.com/600x800?text=No+Image"}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
             <span className="text-white text-sm font-medium">View Details →</span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-amber-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] font-bold text-gray-400 mt-0.5 tracking-tight">(120+ Reviews)</span>
          </div>

          <div className="flex items-baseline gap-2 mb-6 mt-auto">
            <span className="text-2xl font-black text-gray-900">₹{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm line-through text-gray-400 font-medium">₹{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
            }}
            className="flex items-center justify-center gap-3 bg-black hover:bg-amber-400 text-white hover:text-black font-bold py-4 rounded-xl transition-all duration-300 text-sm active:scale-95 shadow-lg shadow-black/5"
          >
            {WhatsAppIcon && <WhatsAppIcon size={18} />}
            <span>ORDER ON WHATSAPP</span>
          </a>
        </div>
      </div>
    </Link>
  );
};

const OfferCard = ({ offer, index }) => (
  <div className="relative group rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] h-56 md:h-72 lg:h-80 bg-gray-900 transition-all duration-500">
    <div className="absolute inset-0">
      <img
        src={offer.image}
        alt={offer.title}
        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />
    </div>

    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent transition-opacity duration-500" />

    <div className="absolute inset-0 flex items-center">
      <div className="p-8 md:p-12 w-full max-w-lg transform transition-all duration-500 group-hover:translate-x-2">
        <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em] mb-4">
          Limited Time Offer
        </span>

        <h3 className="text-xl md:text-2xl font-medium text-gray-200 mb-1 leading-tight">
          {offer.title}
        </h3>

        <div className="flex flex-col mb-4">
          <p className="text-4xl md:text-6xl font-black text-[#f7ef22] drop-shadow-[0_2px_10px_rgba(247,239,34,0.3)] tracking-tighter">
            {offer.highlight}
          </p>
          <div className="h-1 w-12 bg-[#f7ef22] rounded-full mt-1 group-hover:w-24 transition-all duration-500" />
        </div>

        <p className="text-sm md:text-lg text-gray-300 font-medium max-w-xs mb-8 line-clamp-2 opacity-90 group-hover:opacity-100">
          {offer.description}
        </p>

        <button className="relative overflow-hidden px-6 py-3 md:px-8 md:py-4 bg-[#f7ef22] text-black font-black rounded-2xl transition-all duration-300 active:scale-95 shadow-[0_10px_20px_rgba(247,239,34,0.2)] hover:shadow-[0_15px_30px_rgba(247,239,34,0.4)] flex items-center gap-3 group/btn">
          <span className="text-sm uppercase tracking-wider">Shop Now</span>
          <div className="flex items-center justify-center bg-black/10 rounded-full p-1 group-hover/btn:bg-black/20 transition-colors">
            <svg 
              className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:animate-shine" />
  </div>
);

const CarouselSection = ({ title, products, trendingProductIds = [], bestSellerProductIds = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (products.length === 0) return null;
  const titleParts = title.split(" ");

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black leading-[0.9] tracking-tighter text-gray-900"
            >
              {titleParts[0]}
              <br />
              <span className="text-transparent stroke-text">
                {titleParts.slice(1).join(" ")}
              </span>
            </motion.h2>

            <p className="mt-4 max-w-xl text-sm md:text-base text-gray-600 font-medium">
              {descriptions[title] || "Discover our curated collection of products."}
            </p>
          </div>
          <a href="/models" className="font-bold text-base md:text-lg text-[black] hover:text-[#e6dd1f] transition-colors">See All →</a>
        </div>

        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6 md:mx-0 md:px-0"
          >
            {products.map((product) => {
              const isTrendingSection = /trend/i.test(title);
              const isBestSellerSection = /best/i.test(title);
              return (
                <div key={product.id} className="flex-none w-64 md:w-72 snap-center">
                  <ProductCard
                    product={product}
                    whatsappNumber={whatsappNumber}
                    WhatsAppIcon={WhatsAppIcon}
                    getDisplayCategory={getDisplayCategory}
                    trendingProductIds={isTrendingSection ? trendingProductIds : []}
                    bestSellerProductIds={isBestSellerSection ? bestSellerProductIds : []}
                  />
                </div>
              );
            })} 
          </div>

          {products.length > 4 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-xl p-2 rounded-full transition hover:scale-105 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronLeft size={15} />
              </button>

              <button
                onClick={() => scroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-xl p-2 rounded-full transition hover:scale-105 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              >
                <ChevronRight size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const SpecialOffersCarousel = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    cancelAnimationFrame(animationRef.current);

    scrollRef.current.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });

    setTimeout(() => startAutoScroll(), 1000);
  };

  const startAutoScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const speed = 1;
    const step = () => {
      scrollContainer.scrollLeft += speed;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    startAutoScroll();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const duplicatedOffers = [...specialOffers, ...specialOffers];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 py-14 md:py-20">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />

      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-14 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Limited Time <span className="text-orange-500">Offers</span>
          </h2>
          <p className="mt-2 text-gray-600 text-lg md:text-xl">
            Hand-picked deals you shouldn’t miss
          </p>
        </div>

        <div className="relative group">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-amber-50 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-rose-50 to-transparent z-10" />

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-scroll scroll-smooth no-scrollbar whitespace-nowrap"
          >
            {duplicatedOffers.map((offer, i) => (
              <div key={i} className="flex-none w-[92%] md:w-[75%] lg:w-[65%]">
                <div className="transition-transform duration-500 hover:scale-[1.02]">
                  <OfferCard offer={offer} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-xl p-3 rounded-full hover:scale-105 transition opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-xl p-3 rounded-full hover:scale-105 transition opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => scroll("left")}
            className="flex md:hidden absolute left-4 bottom-4 bg-white/90 shadow-xl p-3 rounded-full hover:scale-105 transition z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex md:hidden absolute right-4 bottom-4 bg-white/90 shadow-xl p-3 rounded-full hover:scale-105 transition z-20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default function Hero() {
  const { 
    products, 
    heroBanners, 
    shopCategories, 
    trendingProductIds, 
    bestSellerProductIds 
  } = useProducts();

  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredProducts = useMemo(
    () => products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    ),
    [products, searchTerm]
  );

  const suggestions = filteredProducts.slice(0, 8);

  const searchContainerRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({ left: 0, top: 0, width: "auto" });

  useEffect(() => {
    if (!isDropdownOpen || !searchContainerRef.current) return;

    const updatePosition = () => {
      const el = searchContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDropdownStyle({
        left: rect.left,
        top: rect.bottom + 8,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isDropdownOpen]);

  // Auto slide for hero banner
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  // Featured products from admin selection
  const trendingProducts = useMemo(() => {
    return products.filter(p => trendingProductIds.includes(p.id)).slice(0, 12);
  }, [products, trendingProductIds]);

  const bestSellers = useMemo(() => {
    return products.filter(p => bestSellerProductIds.includes(p.id)).slice(0, 12);
  }, [products, bestSellerProductIds]);

  return (
    <div className="bg-gray-50">
      <header className="top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center">
          <div ref={searchContainerRef} className="w-full max-w-md relative mt-[10px]">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full py-3 px-5 pr-16 rounded-full border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition shadow-sm text-sm md:text-base bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setIsDropdownOpen(false);
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            )}

            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />

            {/* Search Dropdown Portal */}
            {isDropdownOpen && searchTerm.trim().length >= 2 && createPortal(
              <>
                <div className="fixed inset-0 z-[99998]" onMouseDown={() => setIsDropdownOpen(false)} />
                <div
                  className="fixed bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[99999]"
                  style={{ left: dropdownStyle.left, top: dropdownStyle.top, width: dropdownStyle.width }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                    {suggestions.length === 0 ? (
                      <li className="p-6 text-center text-gray-500">No products found</li>
                    ) : (
                      suggestions.map((product) => (
                        <li key={product.id} className="hover:bg-amber-50 transition-colors">
                          <div
                            onMouseDown={(e) => {
                              e.preventDefault();
                              navigate(`/product/${product.id}`);
                              setSearchTerm("");
                              setIsDropdownOpen(false);
                            }}
                            className="flex items-center gap-4 p-4 cursor-pointer"
                          >
                            <img
                              src={product.image || product.mainImage || product.images?.[0] || "https://via.placeholder.com/140x140"}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg shadow-sm flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                              <div className="mt-1 flex items-center justify-between">
                                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                                  {getDisplayCategory(product.category)}
                                </span>
                                <span className="font-bold text-amber-600">₹{product.price}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </>,
              document.body
            )}
          </div>
        </div>
      </header>

      {/* Top Hero Banner - Dynamic from Admin */}
      <section className="relative h-48 sm:h-64 md:h-[350px] lg:h-[400px] mt-4 px-4 max-w-7xl mx-auto">
        <div className="relative h-full w-full rounded-[24px] overflow-hidden shadow-xl bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <motion.img
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 5 }}
                src={heroBanners[slideIndex]?.image || "https://via.placeholder.com/1400x600"}
                alt={heroBanners[slideIndex]?.title}
                className="w-full h-full object-cover opacity-60"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent flex items-center">
                <div className="px-6 sm:px-12 md:px-16 w-full md:w-3/4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <span className="inline-block px-2 py-0.5 bg-[#f7ef22] text-black text-[9px] md:text-xs font-black uppercase tracking-widest rounded-md mb-2">
                      Special Offer
                    </span>
                    
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-2 leading-tight tracking-tight">
                      {heroBanners[slideIndex]?.title || "Amazing Deals Await"}
                    </h2>
                    
                    <p className="text-xs sm:text-base md:text-lg text-gray-300 mb-5 max-w-sm line-clamp-2">
                      {heroBanners[slideIndex]?.description || "Limited time offer"}
                    </p>

                    <a href="/models"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f7ef22] text-black rounded-xl text-xs md:text-sm font-black hover:bg-white transition-all shadow-lg active:scale-95 group"
                    >
                      SHOP NOW
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-30">
            <button onClick={() => setSlideIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)} className="p-2 md:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-[#f7ef22] hover:text-black transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setSlideIndex((prev) => (prev + 1) % heroBanners.length)} className="p-2 md:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-[#f7ef22] hover:text-black transition-all">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="absolute bottom-6 left-6 md:left-16 flex gap-1.5 z-30">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`h-1 transition-all duration-500 rounded-full ${idx === slideIndex ? "w-6 bg-[#f7ef22]" : "w-1.5 bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Category - Dynamic */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-white">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="relative">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-yellow-600 font-black text-[10px] uppercase tracking-[0.3em] block mb-2"
            >
              Collections 2025
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black text-gray-900 leading-[0.9] tracking-tighter"
            >
              SHOP BY <br /> <span className="text-transparent stroke-text">CATEGORY</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gray-400 font-medium md:text-right max-w-[240px] text-xs md:text-sm leading-relaxed border-l-2 md:border-l-0 md:border-r-2 border-yellow-400 px-4"
          >
            Discover the art of digital printing through our specialized categories.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {shopCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group h-[220px] md:h-[280px] rounded-[24px] overflow-hidden bg-gray-100"
            >
              <Link to={cat.link} className="block w-full h-full relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[9px] text-yellow-400 font-black tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      Discover
                    </span>
                    <h3 className="text-white font-black text-sm md:text-lg tracking-tighter uppercase leading-none mt-1">
                      {cat.name}
                    </h3>
                  </div>
                  
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-black scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <style jsx>{`
          .stroke-text {
            -webkit-text-stroke: 1px #111;
            text-stroke: 1px #111;
          }
        `}</style>
      </section>

      {/* Search Results or Carousels */}
      {searchTerm ? (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-10">
              Search Results {filteredProducts.length > 0 && `(${filteredProducts.length})`}
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    whatsappNumber={whatsappNumber}
                    WhatsAppIcon={WhatsAppIcon}
                    getDisplayCategory={getDisplayCategory}
                    trendingProductIds={trendingProductIds}
                    bestSellerProductIds={bestSellerProductIds}
                  />
                ))} 
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 mb-6">No products found.</p>
                <button onClick={() => setSearchTerm("")} className="px-8 py-4 bg-amber-600 text-black font-bold rounded-full shadow-xl">
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          <CarouselSection title="Trending Now" products={trendingProducts} trendingProductIds={trendingProductIds} bestSellerProductIds={bestSellerProductIds} />
          <SpecialOffersCarousel />
          <CarouselSection title="Best Sellers" products={bestSellers} trendingProductIds={trendingProductIds} bestSellerProductIds={bestSellerProductIds} />
        </>
      )}
    </div>
  );
}