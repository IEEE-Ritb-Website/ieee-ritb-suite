/**
 * Purpose: Root component defining application routing structure.
 * Exports: default App (React component)
 * Side effects: None
 *
 * All routes use lazy loading with Suspense for code splitting.
 * MainLayout provides the persistent shell (starfield, navigation, footer).
 */

import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from './layouts/MainLayout';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const ChapterDetails = lazy(() => import('./pages/ChapterDetails'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>
      <div className="absolute inset-0 border-2 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  </div>
);

/**
 * App - Router Configuration
 * 
 * Defines the route structure with MainLayout as the persistent shell.
 * All routes render within the MainLayout's Outlet, ensuring the 
 * WebGL background and navigation persist across navigation.
 */
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="chapters/:chapterId"
          element={
            <Suspense fallback={<PageLoader />}>
              <ChapterDetails />
            </Suspense>
          }
        />
        <Route
          path="events/:eventId"
          element={
            <Suspense fallback={<PageLoader />}>
              <EventDetails />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageLoader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;