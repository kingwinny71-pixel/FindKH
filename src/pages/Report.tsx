import React from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { ImagePlus, MapPin, Tag, Info, Send, X, CheckCircle2, ArrowRight, Package } from "lucide-react";

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = (searchParams.get("type") as "lost" | "found") || "lost";
  
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    type: initialType,
    category: "Electronics",
    location: "",
  });
  
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const categories = ["Electronics", "Pets", "Documents", "Bags", "Accessories", "Keys", "Other"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
        alert("File is too large. Please select an image under 1MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login to report an item.");
      return;
    }

    setLoading(true);
    try {
      const itemData = {
        ...formData,
        authorId: auth.currentUser.uid,
        reportedBy: auth.currentUser.displayName || "Anonymous",
        authorEmail: auth.currentUser.email || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
        imageUrl: imagePreview || `https://picsum.photos/seed/${Math.random()}/800/600`,
        geopoint: {
          latitude: 11.55 + (Math.random() - 0.5) * 0.1,
          longitude: 104.92 + (Math.random() - 0.5) * 0.1
        }
      };

      await addDoc(collection(db, "items"), itemData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "items");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-gray-100"
        >
          <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Report Submitted!</h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Your report is now live and visible to the community. We'll notify you if there's a match.
          </p>
          <div className="flex flex-col gap-4">
            <Link 
              to="/browse"
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-primary transition-all flex items-center justify-center gap-2"
            >
              Browse Recent Items
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ title: "", description: "", type: initialType, category: "Electronics", location: "" });
                setImagePreview(null);
              }}
              className="w-full bg-gray-50 text-gray-500 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all"
            >
              Submit Another Report
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-gray-900 p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold font-display mb-3 tracking-tight">Report an Item</h1>
            <p className="opacity-60 text-lg">Help your community by sharing details about the lost or found item.</p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="relative flex p-1.5 bg-gray-100 rounded-[1.5rem]">
            <motion.div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-2xl shadow-xl ${formData.type === "lost" ? "bg-red-500" : "bg-emerald-500"}`}
              layout
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              style={{ left: formData.type === "lost" ? "6px" : "calc(50%)" }}
            />
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: "lost" }))}
              className={`relative z-10 flex-1 py-4 px-4 rounded-2xl font-bold transition-colors duration-300 ${formData.type === "lost" ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              Lost Item
            </button>
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: "found" }))}
              className={`relative z-10 flex-1 py-4 px-4 rounded-2xl font-bold transition-colors duration-300 ${formData.type === "found" ? "text-white" : "text-gray-500 hover:text-gray-700"}`}
            >
              Found Item
            </button>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Item Title
              </label>
              <input 
                required
                type="text" 
                placeholder="e.g., iPhone 13 Pro Max with blue case"
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Category
                </label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium appearance-none cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Location
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g., BKK1, near Starbucks"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                  value={formData.location}
                  onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400">Description</label>
              <textarea 
                rows={4}
                placeholder="Distinctive marks, serial number, bag contents..."
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium"
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ImagePlus className="w-4 h-4 text-primary" /> Photo Attachment
              </label>
              
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-4 border-gray-50 shadow-inner group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="bg-white text-red-500 font-bold px-6 py-2 rounded-xl shadow-xl hover:bg-red-50 transition-all active:scale-95"
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-12 border-2 border-dashed border-gray-100 bg-gray-50 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="bg-white p-5 rounded-2xl shadow-xl shadow-gray-200/50 group-hover:scale-110 transition-transform duration-500">
                    <ImagePlus className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">Drag or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-black">Max size 1MB</p>
                  </div>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-bold text-xl hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-gray-200 hover:shadow-primary/30 active:scale-95"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Send className="w-6 h-6" />
                Publish Report
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
