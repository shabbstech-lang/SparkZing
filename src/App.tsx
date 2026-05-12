/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CountdownBanner } from './components/promo/CountdownBanner';
import { Suspense, lazy } from 'react';
import { LazyMotion, domMax } from 'motion/react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const Orders = lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const SeasonalOffers = lazy(() => import('./pages/SeasonalOffers').then(m => ({ default: m.SeasonalOffers })));
const StoreFront = lazy(() => import('./pages/StoreFront').then(m => ({ default: m.StoreFront })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Support = lazy(() => import('./pages/Support').then(m => ({ default: m.Support })));

const LoadingFallback = () => (
  <div className="h-full w-full flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-spark-orange/20 border-t-spark-orange rounded-full animate-spin" />
    <p className="text-sm font-black text-deep-charcoal italic tracking-tight uppercase">Loading Crunch...</p>
  </div>
);

export default function App() {
  return (
    <LazyMotion features={domMax}>
      <Analytics />
      <SpeedInsights />
      <Router>
        <Suspense fallback={<LoadingFallback />}>
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
                      <Route path="/support" element={<Support />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </div>
            } />
          </Routes>
        </Suspense>
      </Router>
    </LazyMotion>
  );
}
