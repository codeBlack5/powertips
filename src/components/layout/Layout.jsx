import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

function Layout() {
  return (
    <section>
			<Navbar />
			<div className='display bg-gray-200' style={{ minHeight: "80vh" }}>
				<Outlet />
			</div>
			<Footer />
		</section>
  )
}

export default Layout
