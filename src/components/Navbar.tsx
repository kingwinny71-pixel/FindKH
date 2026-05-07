import React from "react";
import { Search, User, Bell, Menu, Compass, X, Home, Map as MapIcon, PlusCircle, LayoutGrid, Info, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "@/src/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [user, setUser] = React.useState(auth.currentUser);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  // Close menu on route change
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Browse", path: "/browse", icon: MapIcon },
    { name: "Report", path: "/report", icon: PlusCircle, highlight: true },
    { name: "Categories", path: "/categories", icon: LayoutGrid },
    { name: "About", path: "/about", icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="bg-primary rounded-xl p-1.5 shadow-lg shadow-primary/20"
          >
            <Compass className="text-white w-6 h-6" />
          </motion.div>
          <span className="text-2xl font-bold font-display tracking-tighter text-gray-900">
            Find<span className="text-primary italic">KH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                location.pathname === link.path 
                  ? "text-primary bg-primary/5" 
                  : link.highlight 
                    ? "text-primary hover:bg-primary/5" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user && (
            <Link 
              to="/my-reports" 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                location.pathname === "/my-reports" ? "text-cyan-600 bg-cyan-50" : "text-cyan-600 hover:bg-cyan-50"
              }`}
            >
              My Reports
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="hidden sm:flex p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl relative transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-px bg-gray-100 hidden sm:block mx-2"></div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-bold text-gray-900">{user.displayName?.split(' ')[0]}</span>
                <button 
                  onClick={() => signOut(auth)}
                  className="text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
              <button className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-gray-50 ring-offset-2 hover:ring-primary/30 transition-all shadow-sm">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 top-20 bg-gray-900/40 backdrop-blur-sm lg:hidden z-40"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-20 bottom-0 w-[80%] max-w-sm bg-white lg:hidden z-50 shadow-2xl border-l border-gray-100"
            >
              <div className="p-8 flex flex-col gap-2">
                <div className="mb-6">
                  <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4">Navigation</p>
                  <div className="grid grid-cols-1 gap-2">
                    {navLinks.map((link) => (
                      <Link 
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                          location.pathname === link.path 
                            ? "bg-primary/5 text-primary" 
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    ))}
                    {user && (
                      <Link 
                        to="/my-reports" 
                        className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                          location.pathname === "/my-reports" 
                            ? "bg-cyan-50 text-cyan-600" 
                            : "text-cyan-600 hover:bg-cyan-50"
                        }`}
                      >
                        <User className="w-5 h-5" />
                        My Reports
                      </Link>
                    )}
                  </div>
                </div>

                {user && (
                  <div className="mt-auto border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md">
                        <img src={user.photoURL || ""} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-none">{user.displayName}</p>
                        <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => signOut(auth)}
                      className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 text-gray-500 font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
