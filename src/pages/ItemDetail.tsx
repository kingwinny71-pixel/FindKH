import React from "react";
import { useParams, Link } from "react-router-dom";
import { db, auth, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Item } from "@/src/types";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Clock, Tag, User, MessageCircle, ArrowLeft, Share2, AlertTriangle, Check, Flag, X } from "lucide-react";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = React.useState<Item | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("spam");
  const [reportDescription, setReportDescription] = React.useState("");
  const [isReporting, setIsReporting] = React.useState(false);
  const [reportSuccess, setReportSuccess] = React.useState(false);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !item) return;

    setIsReporting(true);
    try {
      await addDoc(collection(db, "flags"), {
        itemId: item.id,
        itemTitle: item.title,
        reporterId: auth.currentUser.uid,
        reason: reportReason,
        description: reportDescription,
        createdAt: serverTimestamp(),
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setShowReportModal(false);
        setReportDescription("");
      }, 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "flags");
    } finally {
      setIsReporting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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
              <button 
                onClick={handleShare}
                className={`flex items-center justify-center gap-2 border px-6 py-4 rounded-2xl font-bold transition-all ${copied ? "bg-green-50 border-green-200 text-green-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button 
              onClick={() => setShowReportModal(true)}
              className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition-colors group"
            >
              <Flag className="w-3 h-3 group-hover:fill-current" />
              Report inappropriate content
            </button>
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

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[60]"
              onClick={() => !isReporting && setShowReportModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden"
            >
              {reportSuccess ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Report Received</h3>
                  <p className="text-gray-500">Thank you for keeping our community safe. Our team will review this listing.</p>
                </div>
              ) : (
                <form onSubmit={handleReport}>
                  <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Report Listing</h3>
                      <p className="text-sm text-gray-500 mt-1">Help us understand what's wrong.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">Reason for report</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['spam', 'scam', 'fake', 'offensive', 'other'].map((reason) => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => setReportReason(reason)}
                            className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all text-left flex items-center justify-between ${
                              reportReason === reason 
                                ? "bg-primary/5 border-primary text-primary shadow-sm" 
                                : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            <span className="capitalize">{reason}</span>
                            {reportReason === reason && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-black uppercase tracking-widest text-gray-400">Additional details (Optional)</label>
                      <textarea
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        placeholder="Provide more information..."
                        className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none min-h-[120px] font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={isReporting || !auth.currentUser}
                      className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-primary transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isReporting ? "Submitting..." : "Submit Report"}
                    </button>
                    {!auth.currentUser && (
                       <p className="text-xs text-red-500 text-center w-full mt-2">You must be signed in to report a listing.</p>
                    )}
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
