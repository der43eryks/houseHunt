import React from 'react';
import { Edit, Trash2, MapPin, Users, Wifi, Shield } from 'lucide-react';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    price: number;
    locationText: string;
    roomType: string;
    description: string;
    available: boolean;
    images: string[];
    amenities: string[];
    agentPhone: string;
    agentWhatsApp?: string;
    agentFacebook?: string;
    isSecureArea: boolean;
    stayTwoPeople: boolean;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onEdit, onDelete }) => {
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=60";

  const features = [
    ...listing.amenities,
    listing.isSecureArea && "Security",
    listing.stayTwoPeople && "Two People"
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="relative">
        <img src={imageUrl} alt={listing.title} className="w-full h-56 object-cover"/>
        <div className="absolute top-4 left-4">
          <span className={`${listing.available ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
            {listing.available ? 'Available' : 'Not Available'}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {listing.roomType}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">{listing.title}</h3>
            <div className="flex items-center text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{listing.locationText}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">KES {listing.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">per month</p>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <Users className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">
            {listing.stayTwoPeople ? 'Two People' : 'Single Person'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              {feature === "Wi-Fi" && <Wifi className="w-3 h-3 mr-1" />}
              {feature === "Security" && <Shield className="w-3 h-3 mr-1" />}
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              +{features.length - 3} more
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {listing.description.length > 120 
            ? `${listing.description.substring(0, 120)}...` 
            : listing.description}
        </p>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => onEdit?.(listing.id)}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Edit size={16} className="mr-2"/> Edit Listing
          </button>
          <button 
            onClick={() => onDelete?.(listing.id)}
            className="px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200"
          >
            <Trash2 size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard; 