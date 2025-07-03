import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#0D1117] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white flex items-center">
          <span className="bg-blue-600 text-white rounded-md p-2 mr-2 flex items-center justify-center h-8 w-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </span>
          Enigma Home
        </Link>
        <div className="hidden md:flex items-center space-x-6 text-sm">
          <Link to="/listings" className="text-gray-300 hover:text-white transition-colors duration-250">Listings</Link>
          <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-250">About Us</Link>
          <Link to="/help" className="text-gray-300 hover:text-white transition-colors duration-250">Support</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-250">Contact Us</Link>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <a href="http://localhost:3001/login" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white transition-colors duration-250 px-5 py-2 rounded-lg border-2 border-blue-600 hover:bg-blue-600/30 text-sm font-semibold">
            Log in
          </a>
          <a href="http://localhost:3001/register" target="_blank" rel="noopener noreferrer" className="bg-[#D94D4C] text-white hover:bg-red-700 transition-colors duration-300 px-5 py-2 rounded-lg text-sm font-semibold">
            Sign Up
          </a>
          <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-250 px-3 py-2 rounded-lg border border-gray-600 hover:border-blue-600 text-sm font-semibold">
            Admin
          </a>
        </div>
        <div className="md:hidden">
          {/* Mobile Menu Button */}
          <button className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
