import React from "react";
import { Search, User, Bell, Menu, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "@/src/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = React.useState(auth.currentUser);

  React.useEffect(() => {
    return auth.onAuthStateChanged((u) => setUser(u));
  }, []);

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5 shadow-sm shadow-primary/20">
            <Compass className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-gray-900">
            Find<span className="text-primary">KH</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Home</Link>
          <Link to="/browse" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Browse</Link>
          <Link to="/report" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors text-primary active:scale-95">Report</Link>
          <Link to="/categories" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Categories</Link>
          <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">About Us</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
              <span className="hidden sm:inline text-sm font-medium text-gray-700">{user.displayName}</span>
              <button 
                onClick={() => signOut(auth)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-50 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
              >
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} alt="Profile" className="w-full h-full object-cover" />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/20 active:scale-95"
            >
              <User className="w-4 h-4" />
              Login
            </button>
          )}
          
          <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
