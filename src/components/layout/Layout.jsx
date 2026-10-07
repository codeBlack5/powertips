import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import bg from "../assets/images/kickoff.jpg";

function Layout() {
  return (
    <section className="relative flex min-h-screen flex-col bg-black">
      {/* Fixed football background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
        aria-hidden="true"
      />

      {/* Consistent dark overlay for readability */}
      <div
        className="fixed inset-0 z-0 bg-black/75"
        aria-hidden="true"
      />

      {/* Foreground application */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="flex-1 pt-16">
          <div className="px-3 py-6 sm:px-6 sm:py-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </section>
  );
}

export default Layout;
