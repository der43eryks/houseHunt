import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Search, Filter, Plus } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface Listing {
  id: string;
  title: string;
  type: string;
  price: string;
  location: string;
  status: 'Available' | 'Rented' | 'Pending';
  createdAt: string;
  imageUrl: string;
}

const ListingsView: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSecureArea, setIsSecureArea] = useState<boolean | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [createdAfter, setCreatedAfter] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (isSecureArea !== undefined) params.isSecureArea = isSecureArea;
        if (minRating !== undefined) params.minRating = minRating;
        if (createdAfter) params.createdAfter = createdAfter;
        const response = await adminAPI.getListings(params);
        setListings(response.data?.data || response.data || response); // support both paginated and flat
      } catch (err: any) {
        setError(err?.error || err?.message || 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [searchTerm, isSecureArea, minRating, createdAfter]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Rented':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Listings</h1>
          <p className="text-gray-600">Manage all your property listings</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
          onClick={() => navigate('/dashboard/add-listing')}
        >
          <Plus size={20} />
          Add New Listing
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <fieldset className="border border-blue-200 rounded-xl p-4 mb-2">
          <legend className="text-base font-semibold text-blue-700 px-2">Filters</legend>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <label htmlFor="searchTerm" className="sr-only">Search listings</label>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="searchTerm"
                name="searchTerm"
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label="Search listings"
              />
            </div>
            <label htmlFor="statusFilter" className="sr-only">Status filter</label>
            <select
              id="statusFilter"
              name="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Status filter"
            >
              <option value="all">All Status</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Pending">Pending</option>
            </select>
            <div className="flex items-center gap-2 group cursor-pointer" tabIndex={0}>
              <input
                id="isSecureAreaFilter"
                name="isSecureAreaFilter"
                type="checkbox"
                checked={isSecureArea === true}
                onChange={e => setIsSecureArea(e.target.checked ? true : undefined)}
                className="accent-blue-600 focus:ring-2 focus:ring-blue-500"
                aria-checked={isSecureArea === true}
              />
              <label htmlFor="isSecureAreaFilter" className={isSecureArea === true ? 'font-semibold text-blue-700' : ''}>
                Secure Area Only
              </label>
              <span className="ml-1 text-xs text-gray-400 group-hover:text-blue-600" title="Show only listings in secure or gated areas.">
                (i)
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer" tabIndex={0}>
              <label htmlFor="createdAfter" className="mr-1">Created After:</label>
              <input
                id="createdAfter"
                name="createdAfter"
                type="date"
                value={createdAfter ?? ''}
                onChange={e => setCreatedAfter(e.target.value || undefined)}
                className={createdAfter ? 'border-blue-500 border-2 rounded-xl px-2 py-1' : 'border border-gray-200 rounded-xl px-2 py-1'}
                aria-label="Created After date filter"
              />
              <span className="ml-1 text-xs text-gray-400 group-hover:text-blue-600" title="Show only listings created after this date.">
                (i)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="minRating" className="mr-1">Min Rating:</label>
              <input
                id="minRating"
                name="minRating"
                type="number"
                min={1}
                max={5}
                value={minRating ?? ''}
                onChange={e => setMinRating(e.target.value ? Number(e.target.value) : undefined)}
                className="w-16 border border-gray-200 rounded-xl px-2 py-1"
                aria-label="Minimum rating filter"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSecureArea(undefined);
                setCreatedAfter(undefined);
                setMinRating(undefined);
                setSearchTerm('');
              }}
              className="ml-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        </fieldset>
      </div>

      {/* Loading/Error State */}
      {loading && (
        <div className="text-center py-12 text-blue-600 font-semibold">Loading listings...</div>
      )}
      {error && (
        <div className="text-center py-12 text-red-600 font-semibold">{error}</div>
      )}

      {/* Listings Table */}
      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date Added</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={listing.imageUrl}
                          alt={listing.title}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{listing.title}</div>
                          <div className="text-sm text-gray-500">ID: {listing.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{listing.type}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">KSh {listing.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{listing.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{listing.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ListingsView; 