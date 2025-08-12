import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import bg from '../assets/images/kickoff.jpg'

function Layout() {
  return (
    <section className="relative flex flex-col min-h-screen">
      {/* Fixed background visible on all pages */}
      <div
        className="fixed inset-0 bg-cover bg-no-repeat bg-center z-0"
        style={{ backgroundImage: `url(${bg})` }}
      ></div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Scrollable main content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 py-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </section>
  );
}

export default Layout
