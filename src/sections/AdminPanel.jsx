// src/pages/AdminPanel.jsx (Full Updated Version)
import { useState, useRef } from "react";
import { useProducts } from "../Context/ProductContext";
import {
  Package,
  Image as ImageIcon,
  Grid3X3,
  TrendingUp,
  Menu,
  X,
  Upload,
  Trash2,
  LogOut,
  Plus,
  ImagePlus,
} from "lucide-react";

export default function AdminPanel() {
  const {
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
    logout,
  } = useProducts();

  // Product form state - now with mainImage + carouselImages
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "frames",
    description: "",
    mainImage: null, // Single main image
    carouselImages: [], // Additional images for carousel
  });

  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    image: "",
    imagePreview: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: "",
    link: "",
    imagePreview: "",
  });

  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainImageRef = useRef(null);
  const carouselImagesRef = useRef(null);
  const bannerFileRef = useRef(null);
  const categoryFileRef = useRef(null);

  // Upload main image
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProductForm({ ...productForm, mainImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Upload multiple carousel images
  const handleCarouselImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Images) => {
      setProductForm((prev) => ({
        ...prev,
        carouselImages: [...prev.carouselImages, ...base64Images],
      }));
    });
  };

  // Remove a carousel image
  const removeCarouselImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      carouselImages: prev.carouselImages.filter((_, i) => i !== index),
    }));
  };

  // Add product
  const handleAddProduct = () => {
    if (!productForm.name.trim()) {
      alert("Product name is required!");
      return;
    }
    if (!productForm.price || isNaN(productForm.price)) {
      alert("Valid price is required!");
      return;
    }
    if (!productForm.mainImage) {
      alert("Main product image is required!");
      return;
    }

    const prepared = {
      name: productForm.name.trim(),
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
      category: productForm.category,
      description: productForm.description.trim() || "Premium handcrafted product.",
      mainImage: productForm.mainImage,
      carouselImages: productForm.carouselImages,
      images: [productForm.mainImage, ...productForm.carouselImages], // For compatibility
    };
    console.log('[AdminPanel] addProduct()', prepared);
    addProduct(prepared);

    // Reset form
    setProductForm({
      name: "",
      price: "",
      originalPrice: "",
      category: "frames",
      description: "",
      mainImage: null,
      carouselImages: [],
    });
    if (mainImageRef.current) mainImageRef.current.value = "";
    if (carouselImagesRef.current) carouselImagesRef.current.value = "";
  };

  // Banner & Category handlers (unchanged)
  const handleSingleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (type === "banner") {
        setBannerForm({ ...bannerForm, image: base64, imagePreview: base64 });
      } else if (type === "category") {
        setCategoryForm({ ...categoryForm, image: base64, imagePreview: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddBanner = () => {
    if (!bannerForm.title || !bannerForm.image) {
      alert("Title and Image are required!");
      return;
    }
    setHeroBanners([
      ...heroBanners,
      {
        id: Date.now(),
        title: bannerForm.title,
        description: bannerForm.description || "",
        image: bannerForm.image,
      },
    ]);
    setBannerForm({ title: "", description: "", image: "", imagePreview: "" });
    if (bannerFileRef.current) bannerFileRef.current.value = "";
  };

  const handleAddCategory = () => {
    if (!categoryForm.name || !categoryForm.image) {
      alert("Name and Image are required!");
      return;
    }
    setShopCategories([
      ...shopCategories,
      {
        id: Date.now(),
        name: categoryForm.name,
        image: categoryForm.image,
        link: categoryForm.link || `/category/${categoryForm.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
    ]);
    setCategoryForm({ name: "", image: "", link: "", imagePreview: "" });
    if (categoryFileRef.current) categoryFileRef.current.value = "";
  };

  const menuItems = [
    { id: "products", label: "Products", icon: Package, count: products.length },
    { id: "banners", label: "Hero Banners", icon: ImageIcon, count: heroBanners.length },
    { id: "categories", label: "Categories", icon: Grid3X3, count: shopCategories.length },
    { id: "featured", label: "Featured", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white shadow-xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-xl font-bold">Perfect Digital Press</h1>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 hover:bg-gray-800 rounded">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                  activeTab === item.id ? "bg-amber-600 shadow-md" : "hover:bg-gray-800"
                }`}
              >
                <item.icon size={20} />
                <div className="flex-1">
                  <span className="font-medium">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">{item.count}</span>
                  )}
                </div>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => window.confirm("Logout?") && logout()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 bg-white shadow-md p-3 flex items-center justify-between z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded">
            <Menu size={24} />
          </button>
          <h2 className="font-semibold text-lg">
            {menuItems.find((i) => i.id === activeTab)?.label}
          </h2>
          <div className="w-8" />
        </div>

        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <Package size={24} className="text-amber-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-xs text-gray-600">Products</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <ImageIcon size={24} className="text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{heroBanners.length}</p>
              <p className="text-xs text-gray-600">Banners</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <Grid3X3 size={24} className="text-purple-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{shopCategories.length}</p>
              <p className="text-xs text-gray-600">Categories</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center">
              <TrendingUp size={24} className="text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{trendingProductIds.length}</p>
              <p className="text-xs text-gray-600">Trending</p>
            </div>
          </div>

          <h1 className="hidden md:block text-3xl font-bold mb-6 text-gray-800">
            {menuItems.find((i) => i.id === activeTab)?.label}
          </h1>

          {/* PRODUCTS TAB */}
          {activeTab === "products" && (
            <div className="space-y-10">
              {/* Add Product Form */}
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                  <Plus size={28} className="text-green-600" />
                  Add New Product
                </h2>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <input
                    type="text"
                    placeholder="Product Name *"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none text-lg"
                  />
                  <input
                    type="number"
                    placeholder="Price ₹ *"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none text-lg"
                  />
                  <input
                    type="number"
                    placeholder="Original Price (optional)"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none text-lg"
                  />
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none text-lg"
                  >
                    <option value="frames">Frames</option>
                    <option value="albums">Albums</option>
                    <option value="books">Photo Books</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Description</label>
                  <textarea
                    placeholder="Describe your product..."
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none text-lg h-32 resize-none"
                  />
                </div>

                {/* Main Image Upload */}
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <ImageIcon size={24} className="text-amber-600" />
                    Main Product Image (Featured)
                  </h3>
                  <div className="relative">
                    <input
                      ref={mainImageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
                      productForm.mainImage ? "border-amber-500 bg-amber-50" : "border-gray-300 hover:border-amber-400"
                    }`}>
                      {productForm.mainImage ? (
                        <div>
                          <img
                            src={productForm.mainImage}
                            alt="Main preview"
                            className="w-64 h-64 object-cover rounded-xl mx-auto mb-4 shadow-xl"
                          />
                          <p className="text-green-600 font-semibold">Main image ready ✓</p>
                        </div>
                      ) : (
                        <div>
                          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-xl font-medium text-gray-700">Click to upload main image</p>
                          <p className="text-sm text-gray-500 mt-2">This will be the primary image on shop & detail page</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Carousel Images Upload */}
                <div className="mb-10">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <ImagePlus size={24} className="text-blue-600" />
                    Additional Views for Carousel (3–8 recommended)
                  </h3>
                  <p className="text-gray-600 mb-4">Upload different angles, close-ups, dimensions, and details</p>

                  <div className="relative mb-6">
                    <input
                      ref={carouselImagesRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleCarouselImagesUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
                      productForm.carouselImages.length > 0 ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                    }`}>
                      {productForm.carouselImages.length > 0 ? (
                        <div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {productForm.carouselImages.map((img, i) => (
                              <div key={i} className="relative group">
                                <img
                                  src={img}
                                  alt={`Carousel ${i + 1}`}
                                  className="w-full h-40 object-cover rounded-xl shadow"
                                />
                                <button
                                  onClick={() => removeCarouselImage(i)}
                                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-blue-600 font-semibold">
                            {productForm.carouselImages.length} additional images ready
                          </p>
                        </div>
                      ) : (
                        <div>
                          <ImagePlus size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="text-xl font-medium text-gray-700">Click to upload carousel images</p>
                          <p className="text-sm text-gray-500 mt-2">Customers love seeing products from all angles</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddProduct}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black py-6 rounded-3xl text-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-4"
                >
                  <Plus size={32} />
                  Add Product to Shop
                </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl shadow hover:shadow-2xl transition border group">
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <img
                        src={p.mainImage || p.images?.[0] || p.image}
                        alt={p.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {(p.carouselImages?.length > 0 || p.images?.length > 1) && (
                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          +{p.carouselImages?.length || (p.images?.length - 1 || 0)} views
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-sm line-clamp-2 mb-2">{p.name}</h3>
                      <p className="text-2xl font-black text-amber-600 mb-1">₹{p.price}</p>
                      {p.originalPrice && <p className="text-sm line-through text-gray-500">₹{p.originalPrice}</p>}
                      <button
                        onClick={() => window.confirm("Delete this product?") && deleteProduct(p.id)}
                        className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BANNERS TAB */}
          {activeTab === "banners" && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                  <Plus size={28} className="text-blue-600" />
                  Add Hero Banner
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <input
                    type="text"
                    placeholder="Banner Title *"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={bannerForm.description}
                    onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none text-lg"
                  />
                </div>

                <div className="relative mb-8">
                  <input
                    ref={bannerFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSingleImageUpload(e, "banner")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
                    bannerForm.image ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
                  }`}>
                    {bannerForm.imagePreview ? (
                      <div>
                        <img src={bannerForm.imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-xl mx-auto mb-4 shadow-xl" />
                        <p className="text-blue-600 font-semibold">Banner image ready ✓</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-medium text-gray-700">Click to upload banner image</p>
                        <p className="text-sm text-gray-500 mt-2">Recommended: 1920x800px</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAddBanner}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black py-5 rounded-3xl text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Plus size={28} />
                  Add Banner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {heroBanners.map((banner) => (
                  <div key={banner.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border group">
                    <img src={banner.image} alt={banner.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                      <p className="text-gray-600 mb-4">{banner.description || "No description"}</p>
                      <button
                        onClick={() => window.confirm("Delete banner?") && setHeroBanners(heroBanners.filter((b) => b.id !== banner.id))}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition"
                      >
                        <Trash2 size={18} />
                        Delete Banner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === "categories" && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                  <Plus size={28} className="text-purple-600" />
                  Add Shop Category
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <input
                    type="text"
                    placeholder="Category Name *"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Link (optional)"
                    value={categoryForm.link}
                    onChange={(e) => setCategoryForm({ ...categoryForm, link: e.target.value })}
                    className="px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none text-lg"
                  />
                </div>

                <div className="relative mb-8">
                  <input
                    ref={categoryFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSingleImageUpload(e, "category")}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition ${
                    categoryForm.image ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400"
                  }`}>
                    {categoryForm.imagePreview ? (
                      <div>
                        <img src={categoryForm.imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-xl mx-auto mb-4 shadow-xl" />
                        <p className="text-purple-600 font-semibold">Category image ready ✓</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl font-medium text-gray-700">Click to upload category image</p>
                        <p className="text-sm text-gray-500 mt-2">Recommended: 800x800px</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAddCategory}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-5 rounded-3xl text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Plus size={28} />
                  Add Category
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {shopCategories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border group">
                    <img src={cat.image} alt={cat.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{cat.link}</p>
                      <button
                        onClick={() => window.confirm("Delete category?") && setShopCategories(shopCategories.filter((c) => c.id !== cat.id))}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition"
                      >
                        <Trash2 size={18} />
                        Delete Category
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FEATURED TAB */}
          {activeTab === "featured" && (
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-8 text-amber-600">Trending Now ({trendingProductIds.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className={`rounded-2xl p-5 text-center border-4 transition-all duration-300 ${
                        trendingProductIds.includes(p.id)
                          ? "border-amber-500 bg-amber-50 shadow-2xl scale-105"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <img
                        src={p.mainImage || p.images?.[0] || p.image}
                        alt={p.name}
                        className="w-full h-32 object-cover rounded-xl mb-3 shadow"
                      />
                      <p className="font-bold text-sm line-clamp-2 mb-3">{p.name}</p>
                      <button
                        onClick={() => { console.log('[AdminPanel] toggleTrending', p.id); toggleTrending(p.id); }}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                          trendingProductIds.includes(p.id)
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        {trendingProductIds.includes(p.id) ? "Remove" : "Add to Trending"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8 text-green-600">Best Sellers ({bestSellerProductIds.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className={`rounded-2xl p-5 text-center border-4 transition-all duration-300 ${
                        bestSellerProductIds.includes(p.id)
                          ? "border-green-500 bg-green-50 shadow-2xl scale-105"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <img
                        src={p.mainImage || p.images?.[0] || p.image}
                        alt={p.name}
                        className="w-full h-32 object-cover rounded-xl mb-3 shadow"
                      />
                      <p className="font-bold text-sm line-clamp-2 mb-3">{p.name}</p>
                      <button
                        onClick={() => { console.log('[AdminPanel] toggleBestSeller', p.id); toggleBestSeller(p.id); }}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition ${
                          bestSellerProductIds.includes(p.id)
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        }`}
                      >
                        {bestSellerProductIds.includes(p.id) ? "Remove" : "Add to Best Sellers"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}