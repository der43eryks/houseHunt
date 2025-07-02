import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HouseCard from '../components/HouseCard';
import { clientAPI } from '../services/api';
import { SlidersHorizontal, Search } from 'lucide-react';

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

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    area: '',
    price: '',
    type: '',
    search: '',
  });
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSecureArea, setIsSecureArea] = useState(undefined);
  const [minRating, setMinRating] = useState(undefined);
  const [createdAfter, setCreatedAfter] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.area) params.location = filters.area;
    if (filters.price) {
      if (filters.price === '4000') params.maxPrice = 4000;
      if (filters.price === '4000-6500') { params.minPrice = 4000; params.maxPrice = 6500; }
      if (filters.price === '6500-8000') { params.minPrice = 6500; params.maxPrice = 8000; }
      if (filters.price === '8000+') params.minPrice = 8000;
    }
    if (filters.type) params.roomType = filters.type;
    if (filters.search) params.search = filters.search;
    if (isSecureArea !== undefined) params.isSecureArea = isSecureArea;
    if (minRating !== undefined) params.minRating = minRating;
    if (createdAfter) params.createdAfter = createdAfter;
    clientAPI.getListings(params)
      .then(res => {
        setListings(res.data?.data || []);
      })
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [filters, isSecureArea, minRating, createdAfter]);

  const areaOptions = useMemo(() => Array.from(new Set(listings.map(l => l.locationText))), [listings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Optionally update URL params here
  };

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Area filter
      if (filters.area && listing.locationText !== filters.area) return false;
      // Room type filter
      if (filters.type && !listing.title?.toLowerCase().includes(filters.type.toLowerCase())) return false;
      // Price filter
      if (filters.price) {
        const price = listing.price;
        if (filters.price === '4000' && price >= 4000) return false;
        if (filters.price === '4000-6500' && (price < 4000 || price > 6500)) return false;
        if (filters.price === '6500-8000' && (price < 6500 || price > 8000)) return false;
        if (filters.price === '8000+' && price <= 8000) return false;
      }
      // Search filter
      if (filters.search && !listing.title?.toLowerCase().includes(filters.search.toLowerCase()) && !listing.locationText?.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters, listings]);

  const total = filteredListings.length;

  return (
    <div className="bg-[#0D1B2A] min-h-screen w-full">
      <div className="w-full py-12 px-0">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-start md:items-end gap-4 bg-[#112240] p-6 rounded-xl shadow-md mb-8 w-full mx-0">
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-white font-semibold mb-1">Area</label>
            <select name="area" value={filters.area} onChange={handleInputChange} className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500">
              <option value="">All Areas</option>
              {areaOptions.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-white font-semibold mb-1">Price</label>
            <select name="price" value={filters.price} onChange={handleInputChange} className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500">
              <option value="">All Prices</option>
              {priceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-white font-semibold mb-1">Room Type</label>
            <select name="type" value={filters.type} onChange={handleInputChange} className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500">
              {roomTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-white font-semibold mb-1">Search</label>
        <div className="flex items-center">
                <input
                  type="text"
                name="search"
                  placeholder="Search listings..."
                  value={filters.search}
                onChange={handleInputChange}
                className="rounded-l-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors duration-300 flex items-center justify-center">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-white font-semibold mb-1 flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSecureArea === true}
                onChange={e => setIsSecureArea(e.target.checked ? true : undefined)}
                className="mr-2"
              />
              Secure Area Only
            </label>
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-white font-semibold mb-1">Min Rating</label>
            <input
              type="number"
              min={1}
              max={5}
              value={minRating ?? ''}
              onChange={e => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
              className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col w-full md:w-1/4">
            <label className="text-white font-semibold mb-1">Created After</label>
            <input
              type="date"
              value={createdAfter ?? ''}
              onChange={e => setCreatedAfter(e.target.value || undefined)}
              className="rounded-lg p-2 bg-[#0D1B2A] text-white border border-blue-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        <h1 className="text-3xl font-bold text-white mb-6 pl-8">All Listings <span className="text-blue-400">({total} rooms available)</span></h1>
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
                <div key={listing.id} className="px-[10px]">
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

export default ListingsPage;