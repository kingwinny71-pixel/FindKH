import React from "react";
import { auth, db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from "firebase/firestore";
import { Item } from "@/src/types";
import { motion, AnimatePresence } from "motion/react";
import { Package, MapPin, Clock, ExternalLink, ChevronRight, Trash2, AlertTriangle, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function MyReportsPage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!deletingId) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "items", deletingId));
      setDeletingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `items/${deletingId}`);
    } finally {
      setIsDeleting(false);
    }
  };

  React.useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
        return;
      }

      const q = query(
        collection(db, "items"),
        where("authorId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Item));
        setItems(data);
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "items");
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-display text-gray-900 tracking-tight">My Reports</h1>
        <p className="text-gray-500 mt-2">Manage the items you have reported as lost or found.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 w-full bg-gray-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {item.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.status === 'resolved' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Just now'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Link 
                    to={`/item/${item.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeletingId(item.id)}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No reports yet</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">You haven't reported any lost or found items. Your reports will appear here once you create them.</p>
          <Link to="/report" className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
            Create Report <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60]"
              onClick={() => !isDeleting && setDeletingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Report?</h3>
                <p className="text-gray-500 leading-relaxed">
                  This action cannot be undone. All data related to this report will be permanently removed.
                </p>
                
                <div className="flex flex-col gap-3 mt-8">
                  <button
                    disabled={isDeleting}
                    onClick={handleDelete}
                    className="w-full py-4 rounded-2xl bg-rose-500 text-white font-bold text-lg hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={() => setDeletingId(null)}
                    className="w-full py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold text-lg hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <button
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 appearance-none bg-transparent border-none"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
