/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CountdownBanner } from './components/promo/CountdownBanner';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { SeasonalOffers } from './pages/SeasonalOffers';
import { StoreFront } from './pages/StoreFront';
import { ProductDetails } from './pages/ProductDetails';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/shop" element={<StoreFront />} />
        <Route path="/product-detail" element={<ProductDetails />} />
        <Route path="/*" element={
          <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full min-w-0">
              <CountdownBanner />
              <Header />
              <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/seasonal" element={<SeasonalOffers />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}
