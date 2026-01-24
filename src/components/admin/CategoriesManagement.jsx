// src/components/admin/CategoriesManagement.jsx
import { useState, useRef } from "react";
import { useProducts } from "../../Context/ProductContext";
import { Plus, Upload, Trash2, X, Image as ImageIcon, Link2 } from "lucide-react";

export default function CategoriesManagement() {
  const { shopCategories, setShopCategories } = useProducts();

  const [form, setForm] = useState({
    name: "",
    link: "",
    imageBase64: "",
    preview: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({ name: "", link: "", imageBase64: "", preview: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file");
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

  const generateSlug = (name) => {
    return `/category/${name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Category name is required");
    if (!form.imageBase64) return alert("Please upload an image");

    const newCategory = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      name: form.name.trim(),
      link: form.link.trim() || generateSlug(form.name),
      image: form.imageBase64,
      createdAt: new Date().toISOString(),
    };

    setShopCategories((prev) => [newCategory, ...prev]); // newest first
    resetForm();
    alert("Category added successfully!");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this category permanently?")) return;
    setShopCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-10 pb-10">
      {/* ── ADD CATEGORY CARD ── */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden">
        <div className=" px-8 py-6">
           <h2 className="text-2xl font-bold text-gray-800 mb-7 flex items-center gap-3">
          <Plus className="text-violet-600" size={26} strokeWidth={2.4} />
          Add New Banner
        </h2>
          {/* <p className="text-purple-100/90 mt-2 text-lg">
            Organize your store with beautiful category cards
          </p> */}
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Electronics, Fashion, Groceries"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (!form.link) {
                    setForm((prev) => ({ ...prev, link: generateSlug(e.target.value) }));
                  }
                }}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500
                         outline-none transition-all text-base"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Link2 size={16} />
                Custom Link <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="/category/fashion"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500
                         outline-none transition-all text-base font-mono text-sm"
              />
              {!form.link && form.name && (
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated: {generateSlug(form.name)}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload Dropzone */}
          <div className="mb-8">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Category Image <span className="text-red-500">*</span>
            </label>

            <div
              onDragOver={handleDragIn}
              onDragLeave={handleDragOut}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300
                ${
                  isDragging
                    ? "border-purple-500 bg-purple-50 scale-[1.01]"
                    : form.preview
                    ? "border-purple-300 bg-purple-50/40"
                    : "border-gray-300 hover:border-purple-400 bg-gray-50/70"
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
                    className="w-full h-64 md:h-80 object-cover"
                  />
                  <button
                    onClick={resetForm}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-semibold text-lg">Image ready ✓</p>
                  </div>
                </div>
              ) : (
                <div className="py-16 px-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <Upload size={32} className="text-purple-600" />
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Recommended: 800 × 800 px (square) • Max 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || !form.preview}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                     text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg 
                     transition-all duration-300 flex items-center justify-center gap-3
                     hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={24} />
            Add New Category
          </button>
        </div>
      </div>

      {/* ── CATEGORIES GRID ── */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <ImageIcon size={24} className="text-purple-600" />
          Shop Categories ({shopCategories.length})
        </h3>

        {shopCategories.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600">No categories yet</p>
            <p className="text-gray-500 mt-2">Add your first category above</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {shopCategories.map((category) => (
              <div
                key={category.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 
                         overflow-hidden transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-4 text-center">
                  <h4 className="font-bold text-gray-900 text-base line-clamp-2 mb-1">
                    {category.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono mb-3 line-clamp-1">
                    {category.link}
                  </p>

                  <button
                    onClick={() => handleDelete(category.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 
                             text-red-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
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