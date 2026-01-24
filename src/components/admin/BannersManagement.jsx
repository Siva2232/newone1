// src/components/admin/BannersManagement.jsx
import { useState, useRef } from "react";
import { useProducts } from "../../Context/ProductContext";
import { Plus, Upload, Trash2, X, Image as ImageIcon } from "lucide-react";

export default function BannersManagement() {
  const { heroBanners, setHeroBanners } = useProducts();

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageBase64: "",
    preview: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({ title: "", description: "", imageBase64: "", preview: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        imageBase64: reader.result,
        preview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    handleDrag(e);
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    handleDrag(e);
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    handleDrag(e);
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return alert("Banner title is required");
    if (!form.imageBase64) return alert("Please upload an image");

    const newBanner = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.imageBase64,
      createdAt: new Date().toISOString(),
    };

    setHeroBanners((prev) => [newBanner, ...prev]); // newest first
    resetForm();
    // You can replace alert with toast notification library later
    alert("Banner added successfully!");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this banner permanently?")) return;
    setHeroBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-10 pb-10">
      {/* ── FORM CARD ── */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
        <div className=" px-8 py-6">
         <h2 className="text-2xl font-bold text-gray-800 mb-7 flex items-center gap-3">
          <Plus className="text-blue-600" size={26} strokeWidth={2.4} />
          Add New Banner
        </h2>
          {/* <p className="text-indigo-100/90 mt-2 text-lg">
            Add eye-catching banners for your homepage
          </p> */}
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Banner Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Summer Sale - Up to 70% Off!"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
                         outline-none transition-all text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                placeholder="Limited time offer • Free shipping on orders above ₹999"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
                         outline-none transition-all text-base"
              />
            </div>
          </div>

          {/* Image Dropzone */}
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Banner Image <span className="text-red-500">*</span>
            </label>

            <div
              onDragOver={handleDragIn}
              onDragLeave={handleDragOut}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300
                ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
                    : form.preview
                    ? "border-indigo-300 bg-indigo-50/40"
                    : "border-gray-300 hover:border-indigo-400 bg-gray-50/70"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {form.preview ? (
                <div className="relative group">
                  <img
                    src={form.preview}
                    alt="preview"
                    className="w-full h-64 md:h-72 object-cover"
                  />
                  <button
                    onClick={resetForm}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div className="py-16 px-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Upload size={32} className="text-indigo-600" />
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Recommended size: 1920 × 800 px • Max 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.preview}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 
                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                     text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg 
                     transition-all duration-300 flex items-center justify-center gap-3
                     hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={24} />
            Add New Banner
          </button>
        </div>
      </div>

      {/* ── BANNERS GRID ── */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <ImageIcon size={24} className="text-indigo-600" />
          Active Hero Banners ({heroBanners.length})
        </h3>

        {heroBanners.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600">No banners yet</p>
            <p className="text-gray-500 mt-2">Create your first hero banner above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroBanners.map((banner) => (
              <div
                key={banner.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                    {banner.title}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-2 min-h-[3rem] mb-4">
                    {banner.description || "No description provided"}
                  </p>

                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 
                             text-red-700 font-medium py-3 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete Banner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}