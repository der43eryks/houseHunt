import React from 'react';

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">About HouseHunt</h1>
      <p className="mb-4 text-lg text-gray-700 text-center">
        HouseHunt is your trusted partner in finding the perfect student accommodation. Our mission is to connect students with quality, affordable housing options near campus, making the search for a new home easy, transparent, and secure.
      </p>
      <p className="mb-4 text-gray-600">
        We work closely with property owners and agents to ensure all listings are up-to-date, verified, and meet the needs of students. Whether you are looking for a bedsitter, single room, or a shared apartment, HouseHunt provides a wide range of options to suit your preferences and budget.
      </p>
      <p className="mb-4 text-gray-600">
        Our platform is designed with students in mind, offering advanced search, detailed property information, and direct contact with agents. We are committed to making your house-hunting experience smooth and stress-free.
      </p>
      <div className="mt-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p className="text-gray-700">Kakamega, Kenya</p>
        <p className="text-gray-700">info@househunt.com</p>
        <p className="text-gray-700">+25483640875</p>
      </div>
    </div>
  );
}

export default AboutPage; 