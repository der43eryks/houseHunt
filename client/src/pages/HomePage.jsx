import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import HouseCard from "../components/HouseCard";
import { clientAPI } from "../services/api";

const priceOptions = [
  { label: 'Below KES 4,000', value: '4000' },
  { label: 'KES 4,000 - 6,500', value: '4000-6500' },
  { label: 'KES 6,500 - 8,000', value: '6500-8000' },
  { label: 'Above KES 8,000', value: '8000+' },
];
const roomTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Bedsitter', value: 'Bedsitter' },
  { label: 'Single Room', value: 'Single' },
  { label: 'One-bedroom', value: 'One-bedroom' },
  { label: 'Shared', value: 'Shared' },
];

const HomePage = () => {
  const [filters, setFilters] = useState({
    area: '',
    price: '',
    type: '',
    search: '',
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    clientAPI.getListings()
      .then(res => {
        setListings(res.data?.data || []);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  const areaOptions = useMemo(() => Array.from(new Set(listings.map(l => l.locationText))), [listings]);

  const getCategoryCount = (type) => {
    if (type === 'Bedsitter') return listings.filter(l => l.title?.toLowerCase().includes('bedsitter')).length;
    if (type === 'Single Room') return listings.filter(l => l.title?.toLowerCase().includes('single')).length;
    if (type === 'Two Bedroom') return listings.filter(l => l.title?.toLowerCase().includes('two')).length;
    return 0;
  };

  const categories = [
    { name: 'Bedsitters', type: 'Bedsitter' },
    { name: 'Single Rooms', type: 'Single Room' },
    { name: 'Two Bedrooms', type: 'Two Bedroom' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      if (filters.area && listing.locationText !== filters.area) return false;
      if (filters.type && !listing.title?.toLowerCase().includes(filters.type.toLowerCase())) return false;
      if (filters.price) {
        const price = listing.price;
        if (filters.price === '4000' && price >= 4000) return false;
        if (filters.price === '4000-6500' && (price < 4000 || price > 6500)) return false;
        if (filters.price === '6500-8000' && (price < 6500 || price > 8000)) return false;
        if (filters.price === '8000+' && price <= 8000) return false;
      }
      if (filters.search && !listing.title?.toLowerCase().includes(filters.search.toLowerCase()) && !listing.locationText?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters, listings]);

  function CategoryButtons({ categories, getCategoryCount }) {
    return (
      <div className="w-full flex flex-col items-center z-10 relative mt-[35px] mb-8">
        <div className="flex flex-row justify-center items-center gap-3 w-full max-w-3xl mx-auto">
          {categories.map((cat, idx) => (
            <div
              key={cat.name}
              className="flex flex-row items-center justify-center bg-[#173A6A] text-white font-bold rounded-2xl border-2 border-blue-600 shadow-lg hover:scale-105 hover:shadow-2xl hover:border-blue-700 transition-all duration-500 whitespace-nowrap min-w-0 flex-1 mx-1 px-2 py-2 sm:px-4 sm:py-4 text-[11px] sm:text-lg"
              style={{ boxShadow: '0 6px 24px 0 rgba(0,0,0,0.10)' }}
            >
              <span className="font-extrabold text-blue-600 mr-2 whitespace-nowrap text-[15px] sm:text-2xl">{getCategoryCount(cat.type)}</span>
              <span className="font-bold text-white whitespace-nowrap text-[11px] sm:text-lg">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0D1B2A] min-h-screen w-full">
      {/* Hero Section */}
      <div className="h-[50vh] bg-cover bg-center flex flex-col items-start justify-center text-white w-full px-0" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1650&q=80')" }}>
        <h1 className="text-5xl font-extrabold mb-4 pl-8 pt-8">Find Your Perfect Student Room Near Campus</h1>
        <p className="text-xl mb-4 pl-8 max-w-2xl">Affordable, secure, and flexible student housing for university life. Search for bedsitters, single rooms—any—pay monthly or per semester, all close to your campus and socials.</p>
      </div>

      {/* Search/Filter Bar */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-start md:items-end gap-4 bg-[#112240] p-4 md:p-6 rounded-xl shadow-md w-full max-w-5xl mx-auto transition-all duration-500 mt-[-60px]">
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-white font-semibold mb-1">Area</label>
          <select name="area" value={filters.area} onChange={handleInputChange} className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-500">
            <option value="">All Areas</option>
            {areaOptions.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-white font-semibold mb-1">Price</label>
          <select name="price" value={filters.price} onChange={handleInputChange} className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-500">
            <option value="">All Prices</option>
            {priceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-white font-semibold mb-1">Room Type</label>
          <select name="type" value={filters.type} onChange={handleInputChange} className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-500">
            {roomTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-white font-semibold mb-1">Search</label>
          <div className="flex items-center">
            <input type="text" name="search" placeholder="Search listings..." value={filters.search} onChange={handleInputChange} className="rounded-l-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500 w-full transition-all duration-500" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-all duration-500 flex items-center justify-center">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Category Buttons Section - now always after search, before listings */}
      <CategoryButtons categories={categories} getCategoryCount={getCategoryCount} />

      {/* Listings Section */}
      <div className="w-full py-12 px-0">
        <h2 className="text-4xl font-bold text-white mb-10 text-left pl-8">Available Student Rooms</h2>
        <div className="w-full px-8">
          {loading ? (
            <div className="text-center py-12 bg-[#112240] rounded-lg shadow-lg text-white">Loading listings...</div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12 bg-[#112240] rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-2 text-white">No Results Found</h3>
              <p className="text-gray-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
              {filteredListings.map((listing) => (
                <div key={listing.id} className="px-[10px] transition-all duration-500">
                  <HouseCard listing={listing} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
