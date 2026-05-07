/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/src/components/Navbar";
import NotificationManager from "@/src/components/NotificationManager";
import Hero from "@/src/components/Hero";
import SearchBar from "@/src/components/SearchBar";
import CategorySection from "@/src/components/CategorySection";
import RecentItems from "@/src/components/RecentItems";
import ReportPage from "@/src/pages/Report";
import BrowsePage from "@/src/pages/Browse";
import ItemDetailPage from "@/src/pages/ItemDetail";
import MyReportsPage from "@/src/pages/MyReports";

function HomePage() {
  return (
    <main>
      <Hero />
      <SearchBar />
      <CategorySection />
      <RecentItems />
      
      {/* Footer-like final section */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold font-display mb-6 tracking-tight italic">
            "Bringing what's lost back to where it belongs."
          </h2>
          <p className="text-primary-light text-lg mb-10 opacity-90">
            Join thousands of others in Phnom Penh and beyond who are making their communities safer and more connected. 
            Lost something? Don't lose hope.
          </p>
          <div className="flex justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">5k+</span>
              <span className="text-sm opacity-60">Items Found</span>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">12k+</span>
              <span className="text-sm opacity-60">Active Users</span>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">98%</span>
              <span className="text-sm opacity-60">Success Rate</span>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-10 px-6 bg-white border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© 2024 FindKH - Lost & Found Cambodia. Built for the community.</p>
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <NotificationManager />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/categories" element={<CategorySection />} />
          <Route path="/about" element={<div className="p-20 text-center px-6 max-w-2xl mx-auto"><h1 className="text-3xl font-bold mb-4">About FindKH</h1><p className="text-gray-600">FindKH is a dedicated community platform designed to bridge the gap between people who have lost belongings and those who have found them. Our mission is to promote honesty and community spirit within Cambodia.</p></div>} />
        </Routes>
      </div>
    </Router>
  );
}
