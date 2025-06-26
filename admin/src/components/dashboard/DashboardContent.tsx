import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, MessageSquare, Home, Eye, Edit, Trash2, BarChart2, Star } from 'lucide-react';
import { adminAPI } from '../../services/api';

const DashboardContent: React.FC = () => {
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
    return <div className="text-center py-12 text-blue-600 font-semibold">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-600 font-semibold">{error}</div>;
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
          <Home className="text-blue-600" size={32} />
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalListings ?? 0}</div>
            <div className="text-gray-600">Total Listings</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
          <Users className="text-blue-600" size={32} />
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalInquiries ?? 0}</div>
            <div className="text-gray-600">Total Inquiries</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
          <Star className="text-blue-600" size={32} />
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats?.averageRating?.toFixed(1) ?? 'N/A'}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Categories</h3>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.available} available</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{category.count}</p>
                    <p className="text-xs text-gray-500">total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Listings</h3>
              <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            <div className="space-y-4">
              {recentListings.length > 0 ? (
                recentListings.map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={listing.imageUrl}
                      alt={listing.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{listing.title}</h4>
                      <p className="text-sm text-gray-600">{listing.location}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-medium text-gray-900">KSh {listing.price}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                          {listing.status}
                        </span>
                        <span className="text-sm text-gray-500">{listing.views} views</span>
                      </div>
                    </div>
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
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Home size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No listings found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors duration-200">
            <Home size={20} className="mr-2" />
            Add New Listing
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors duration-200">
            <MessageSquare size={20} className="mr-2" />
            View Inquiries
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors duration-200">
            <TrendingUp size={20} className="mr-2" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent; 