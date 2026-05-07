import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "motion/react";
import { ImagePlus, MapPin, Tag, Info, Send } from "lucide-react";

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialType = (searchParams.get("type") as "lost" | "found") || "lost";
  
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    type: initialType,
    category: "Electronics",
    location: "",
  });

  const categories = ["Electronics", "Pets", "Documents", "Bags", "Accessories", "Keys", "Other"];

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
        imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`, // Placeholder
      };

      await addDoc(collection(db, "items"), itemData);
      navigate("/");
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "items");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-primary p-8 text-white">
          <h1 className="text-3xl font-bold font-display mb-2">Report an Item</h1>
          <p className="opacity-80">Fill in the details below to help the community find your lost item or return a found one.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: "lost" }))}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${formData.type === "lost" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Lost Item
            </button>
            <button 
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: "found" }))}
              className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${formData.type === "found" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Found Item
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Info className="w-4 h-4" /> Item Title
            </label>
            <input 
              required
              type="text" 
              placeholder="e.g., iPhone 13 Pro Max with blue case"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              value={formData.title}
              onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Category
              </label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.category}
                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location
              </label>
              <input 
                required
                type="text" 
                placeholder="e.g., BKK1 market or near Starbucks"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                value={formData.location}
                onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea 
              rows={4}
              placeholder="Provide as many details as possible (serial number, distinctive marks, contents of bag, etc.)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="bg-gray-100 p-4 rounded-full group-hover:bg-primary/5 group-hover:text-primary transition-colors">
              <ImagePlus className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium text-gray-500">Click to upload or drag and drop photos</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-wait"
          >
            {loading ? "Submitting..." : (
              <>
                <Send className="w-5 h-5" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
