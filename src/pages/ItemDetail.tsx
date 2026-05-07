import React from "react";
import { useParams, Link } from "react-router-dom";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Item } from "@/src/types";
import { motion } from "motion/react";
import { MapPin, Clock, Tag, User, MessageCircle, ArrowLeft, Share2, AlertTriangle } from "lucide-react";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = React.useState<Item | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) return;
    
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "items", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() } as Item);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `items/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <div className="max-w-7xl mx-auto py-20 text-center animate-pulse">Loading item details...</div>;
  if (!item) return <div className="max-w-7xl mx-auto py-20 text-center">Item not found.</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <Link to="/browse" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallary */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-square md:aspect-auto md:h-[600px]"
        >
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-4 py-1 rounded-full text-sm font-bold text-white shadow-lg ${item.type === "lost" ? "bg-red-500" : "bg-green-500 font-display tracking-tight"}`}>
                {item.type.toUpperCase()}
              </span>
              <span className="px-4 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
                {item.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 tracking-tight leading-tight">{item.title}</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl text-primary">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Location</p>
                <p className="font-semibold text-gray-900">{item.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date Posted</p>
                <p className="font-semibold text-gray-900">{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : "Just now"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.reportedBy}</p>
                  <p className="text-xs text-gray-500">Verified User</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href={`mailto:${item.authorEmail}?subject=Regarding your Lost/Found report: ${item.title}`}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Owner
              </a>
              <button className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-bold">Safety Tip</p>
              <p>When meeting someone for an item, choose a safe public location like a shopping mall or police station.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
