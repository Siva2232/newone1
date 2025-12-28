// src/pages/CustomBook.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, ChevronRight, ChevronLeft, Check, Sparkles, Camera, BookOpen } from "lucide-react";

// WhatsApp business number
const whatsappNumber = "9746683778";

// Inline WhatsApp SVG
const WhatsAppIcon = ({ size = 32, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

const bookTypes = [
  "Wedding Album",
  "Family Memory Book",
  "Baby Album",
  "Travel Photo Book",
  "Anniversary Edition",
  "Year in Review",
  "Custom Theme (Specify in message)",
];

export default function CustomBook() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form Data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bookType, setBookType] = useState(bookTypes[0]);
  const [pages, setPages] = useState("40");
  const [message, setMessage] = useState("");

  // Upload Data
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim() || !phone.trim()) {
        alert("Name and WhatsApp number are required!");
        return;
      }
    }
    if (currentStep === 2) {
      if (files.length < 5) {
        alert("Please upload at least 5 photos to continue.");
        return;
      }
    }
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // File handling
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFilesAdd(Array.from(e.dataTransfer.files));
  };

  const handleFilesAdd = (newFiles) => {
    const validFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    if (files.length + validFiles.length > 50) {
      alert("Maximum 50 images allowed.");
      return;
    }
    setFiles([...files, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(previews.filter((_, i) => i !== index));
  };

  // Cleanup previews
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // Final submission
  const submitEnquiry = () => {
    const text = encodeURIComponent(
      `Hi StudioMemories! ✨\n\nI'd like to create a custom photo book.\n\n` +
      `👤 Name: ${name}\n` +
      `📱 Phone: ${phone}\n` +
      `${email.trim() ? `📧 Email: ${email}\n` : ""}` +
      `📖 Book Type: ${bookType}\n` +
      `📄 Pages: ${pages}\n` +
      `🖼️ Images: ${files.length}\n\n` +
      `💬 Message: ${message.trim() || "No additional requests"}\n\n` +
      `I'll attach the photos now. Excited for your quote & design ideas! 🌟`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-orange-50">
      {/* Hero Header */}
      <section className="relative h-80 md:h-96 overflow-hidden">
        <img
          src="https://www.pikperfect.com/assets/images/towebp/3.1_professional_wedding_album/professional-wedding-album.jpg"
          alt="Custom Photo Book"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex items-end pb-16">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <h1 className="text-4xl md:text-6xl font-black mb-4">Create Your Custom Photo Book</h1>
            <p className="text-xl md:text-2xl opacity-90">Premium quality • Professional design • Easy 3-step process</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-16">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                  currentStep >= step
                    ? "bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step ? <Check size={28} /> : step}
              </div>
              <div className="flex-1 h-2 mx-4">
                <div
                  className={`h-full transition-all ${
                    currentStep > step ? "bg-amber-600" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-center">
            {currentStep === 1 && "Your Details & Preferences"}
            {currentStep === 2 && "Upload Your Photos"}
            {currentStep === 3 && "Review & Send Enquiry"}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Step 1: Details */}
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-bold mb-3">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition text-lg"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3">WhatsApp Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition text-lg"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3">Email (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition text-lg"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3">Book Style</label>
                  <select
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value)}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition text-lg"
                  >
                    {bookTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold mb-3">Approximate Pages</label>
                  <select
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition text-lg"
                  >
                    <option>20 pages</option>
                    <option>40 pages</option>
                    <option>60 pages</option>
                    <option>80 pages</option>
                    <option>100+ pages</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-lg font-bold mb-3">Special Requests or Theme Ideas</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition text-lg resize-none"
                    placeholder="E.g., vintage theme, include text quotes, leather cover..."
                  />
                </div>
              </div>
            )}

            {/* Step 2: Upload */}
            {currentStep === 2 && (
              <div>
                <p className="text-center text-xl text-gray-700 mb-8">
                  Upload your favorite photos (minimum 5, up to 50 recommended)
                </p>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-4 border-dashed rounded-3xl p-16 text-center transition-all ${
                    dragActive ? "border-amber-500 bg-amber-50" : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <Upload size={80} className="mx-auto text-gray-400 mb-6" />
                  <p className="text-2xl font-bold mb-4">Drop photos here</p>
                  <p className="text-gray-600 mb-8">or click to browse • JPG/PNG • Max 50 images</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFilesAdd(Array.from(e.target.files))}
                    className="hidden"
                    id="upload-step2"
                  />
                  <label
                    htmlFor="upload-step2"
                    className="inline-block px-12 py-6 bg-amber-600 text-black font-bold text-xl rounded-full cursor-pointer hover:bg-amber-500 transition shadow-xl"
                  >
                    <Camera className="inline mr-3" size={28} />
                    Choose Photos
                  </label>
                </div>

                {previews.length > 0 && (
                  <div className="mt-12">
                    <p className="text-2xl font-bold text-center mb-6">
                      {previews.length} photos selected ✨
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-2xl">
                      {previews.map((preview, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={preview}
                            alt={`Preview ${i + 1}`}
                            className="w-full aspect-square object-cover rounded-xl shadow-md"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                          >
                            <X size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-8 text-lg">
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-10 text-center">
                  <Sparkles size={64} className="mx-auto text-amber-600 mb-6" />
                  <h3 className="text-3xl font-black mb-4">Almost There!</h3>
                  <p className="text-xl text-gray-700">
                    We'll open WhatsApp with all your details. Just attach your photos there!
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <BookOpen className="text-amber-600" /> Book Details
                    </h4>
                    <p><strong>Type:</strong> {bookType}</p>
                    <p><strong>Pages:</strong> {pages}</p>
                    {message && <p><strong>Requests:</strong> {message}</p>}
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h4 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <Camera className="text-amber-600" /> Photos
                    </h4>
                    <p className="text-2xl font-bold text-amber-600">{files.length} images ready</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <p className="font-bold mb-2">Contact Info:</p>
                  <p>{name} • {phone} {email && `• ${email}`}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-10 py-5 rounded-full font-bold text-xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 hover:bg-gray-300 transition"
          >
            <ChevronLeft size={28} />
            Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-12 py-5 bg-amber-600 hover:bg-amber-500 text-black font-black text-xl rounded-full flex items-center gap-4 shadow-2xl transition"
            >
              Next Step
              <ChevronRight size={32} />
            </button>
          ) : (
            <button
              onClick={submitEnquiry}
              className="px-16 py-6 bg-green-600 hover:bg-green-700 text-white font-black text-2xl rounded-full flex items-center gap-5 shadow-2xl transition"
            >
              <WhatsAppIcon size={40} />
              Send via WhatsApp
              <ChevronRight size={36} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}