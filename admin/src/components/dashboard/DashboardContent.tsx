import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, MessageSquare, Home, Eye, Edit, Trash2, BarChart2, Star } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

const DashboardContent: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats and listings in parallel
        const [statsResponse, listingsResponse] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getListings({ limit: 10 }) // Get recent listings
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (listingsResponse.success) {
          setListings(listingsResponse.data?.data || listingsResponse.data || []);
        }
      } catch (err: any) {
        setError(err?.error || err?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8 sm:py-12 text-blue-600 font-semibold text-sm sm:text-base">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-center py-8 sm:py-12 text-red-600 font-semibold text-sm sm:text-base">{error}</div>;
  }

  // Generate categories from real listings data
  const categories = [
    { name: 'Bedsitters', count: listings.filter(l => l.roomType === 'Bedsitter').length, available: listings.filter(l => l.roomType === 'Bedsitter' && l.available).length },
    { name: 'Single Rooms', count: listings.filter(l => l.roomType === 'Single').length, available: listings.filter(l => l.roomType === 'Single' && l.available).length },
    { name: 'Two Bedrooms', count: listings.filter(l => l.roomType === 'Two-bedroom').length, available: listings.filter(l => l.roomType === 'Two-bedroom' && l.available).length }
  ];

  // Use real recent listings data
  const recentListings = listings.slice(0, 3).map(listing => ({
    id: listing.id,
    title: listing.title,
    type: listing.roomType,
    price: listing.price.toLocaleString(),
    location: listing.locationText,
    status: listing.available ? 'Available' : 'Not Available',
    views: Math.floor(Math.random() * 50) + 10, // Mock views for now
    imageUrl: listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=60'
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'Rented':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'Pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="overflow-x-hidden w-full max-w-full container mx-auto px-2 sm:px-4 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow flex items-center gap-3 sm:gap-4 border border-gray-100 dark:border-gray-700">
          <Home className="text-blue-600" size={24} />
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalListings ?? 0}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Listings</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow flex items-center gap-3 sm:gap-4 border border-gray-100 dark:border-gray-700">
          <Users className="text-blue-600" size={24} />
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalInquiries ?? 0}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Inquiries</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow flex items-center gap-3 sm:gap-4 sm:col-span-2 lg:col-span-1 border border-gray-100 dark:border-gray-700">
          <Star className="text-blue-600" size={24} />
          <div className="min-w-0 flex-1">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stats?.averageRating?.toFixed(1) ?? 'N/A'}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Categories Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Property Categories</h3>
            <div className="space-y-3 sm:space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{category.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{category.available} available</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{category.count}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Listings</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm">View All</button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {recentListings.length > 0 ? (
                recentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl">
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{listing.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{listing.location}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">KSh {listing.price}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                          {listing.status}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{listing.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <button className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200">
                        <Eye size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button className="p-1 sm:p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200">
                        <Edit size={14} className="sm:w-4 sm:h-4" />
                      </button>
                      <button className="p-1 sm:p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                        <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                  <Home size={32} className="mx-auto mb-3 sm:mb-4 text-gray-300 dark:text-gray-600 sm:w-12 sm:h-12" />
                  <p className="text-sm sm:text-base">No listings found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="flex items-center justify-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 text-sm sm:text-base">
            <Home size={16} className="mr-2 sm:w-5 sm:h-5" />
            <span className="truncate">Add New Listing</span>
          </button>
          <button className="flex items-center justify-center p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg sm:rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200 text-sm sm:text-base">
            <MessageSquare size={16} className="mr-2 sm:w-5 sm:h-5" />
            <span className="truncate">View Inquiries</span>
          </button>
          <button className="flex items-center justify-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg sm:rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 text-sm sm:text-base sm:col-span-2 lg:col-span-1">
            <TrendingUp size={16} className="mr-2 sm:w-5 sm:h-5" />
            <span className="truncate">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent; 