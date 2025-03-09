import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import Breadcrumbs from '../components/common/Breadcrumbs';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#161616]">
      <ScrollToTop />
      <Header />
      <Breadcrumbs />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

















