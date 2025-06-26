import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, CheckSquare } from 'lucide-react';

const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex items-center justify-center align-center">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        tabIndex={0}
        className="w-full flex items-center justify-center"
      >
        {children}
      </div>
      {show && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg z-20 transition-all duration-500 whitespace-nowrap">
          {text}
        </div>
      )}
    </div>
  );
};

const HouseCard = ({ listing }) => {
  const imageUrl = (listing.images && listing.images.length > 0) 
    ? listing.images[0] 
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  const whatsAppNumber = (listing.agentWhatsApp || listing.agentPhone).replace(/\D/g, '');
  const whatsAppLink = `https://wa.me/${whatsAppNumber}`;
  const callLink = `tel:${listing.agentPhone}`;

  return (
    <div className="bg-[#112240] rounded-2xl overflow-hidden group border-2 border-transparent hover:border-blue-500 transition-all duration-500 transform hover:scale-[1.03] hover:shadow-2xl flex flex-col w-full px-[9px]">
      <div className="w-full aspect-[4/3] overflow-hidden rounded-t-2xl mb-2">
        <img className="w-full h-full object-cover rounded-t-2xl transition-all duration-500" src={imageUrl} alt={listing.title} />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
        <div className="flex items-center text-gray-400 mb-3">
            <MapPin size={16} className="mr-2 text-blue-400"/>
            <span>{listing.locationText}</span>
        </div>
        <p className="text-blue-400 font-semibold text-lg mb-4">
          KES {listing.price.toLocaleString()} <span className="text-gray-400 text-sm">/ {listing.paymentFrequency}</span>
        </p>

        <p className="text-gray-300 text-sm mb-5 flex-grow">
          {listing.description.substring(0, 100)}{listing.description.length > 100 && '...'}
        </p>
        
        {listing.amenities && listing.amenities.length > 0 && (
          <div className="mb-5 border-t border-gray-700 pt-4">
            <h4 className="text-white font-semibold text-sm mb-3">What's inside:</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {listing.amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="flex items-center text-gray-400 text-sm">
                  <CheckSquare size={14} className="mr-2 text-green-400"/>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Agent Header */}
        <div className="mb-2 mt-4">
          <span className="text-xs text-gray-300 font-semibold tracking-wide">Contact Agent</span>
        </div>
        {/* Responsive Button Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-auto transition-all duration-500 w-full">
          <Tooltip text="Chat on WhatsApp">
            <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 text-white font-bold py-2 px-2 rounded-lg hover:bg-green-700 hover:scale-105 hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2 text-sm">
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </Tooltip>
          <Tooltip text="Call Agent">
            <a href={callLink} className="flex-1 bg-gray-700 text-white font-bold py-2 px-2 rounded-lg hover:bg-blue-600 hover:scale-105 hover:shadow-lg transition-all duration-500 flex items-center justify-center gap-2 text-sm">
              <Phone size={16} />
              <span className="truncate text-xs sm:text-sm md:text-base">{listing.agentPhone || 'Call'}</span>
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
