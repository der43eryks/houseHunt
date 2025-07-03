import React, { useState } from 'react';
import { UploadCloud, Save, Plus, X } from 'lucide-react';
import { adminAPI } from '../../services/api';

const AddListingView: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    roomType: 'Bedsitter',
    description: '',
    stayTwoPeople: false,
    price: '',
    paymentFrequency: 'Monthly',
    locationText: '',
    areaNickname: '',
    tags: [],
    images: [] as File[],
    amenities: ['Wi-Fi', 'Security'],
    isSecureArea: false,
    agentPhone: '',
    agentWhatsApp: '',
    agentFacebook: '',
    available: true
  });

  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const propertyTypes = ['Bedsitter', 'Single Room', 'Two Bedroom', 'Studio'];
  const genderOptions = ['Any', 'Male Only', 'Female Only'];
  const areaOptions = [
    'Lurambi',
    'Kakamega Bypass',
    'MMUST Area',
    'Town Centre',
    'Kefinco',
    'Milimani',
    'Shieywe',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.amenities.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(f => f !== feature)
    }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title || formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters.';
    if (!formData.description || formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters.';
    if (!formData.roomType) newErrors.roomType = 'Room type is required.';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number.';
    if (!formData.paymentFrequency) newErrors.paymentFrequency = 'Payment frequency is required.';
    if (!formData.locationText || formData.locationText.length < 10) newErrors.locationText = 'Location must be at least 10 characters.';
    if (!formData.amenities || formData.amenities.length === 0) newErrors.amenities = 'At least one amenity is required.';
    if (!formData.agentPhone || !/^\+254\d{9}$/.test(formData.agentPhone)) newErrors.agentPhone = 'Agent phone must be in Kenyan format: +254XXXXXXXXX';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, images: undefined };
      const response = await adminAPI.createListing(payload);
      if (response.success) {
        setSuccess('Listing created successfully!');
        setFormData({
          title: '',
          roomType: 'Bedsitter',
          description: '',
          stayTwoPeople: false,
          price: '',
          paymentFrequency: 'Monthly',
          locationText: '',
          areaNickname: '',
          tags: [],
          images: [],
          amenities: ['Wi-Fi', 'Security'],
          isSecureArea: false,
          agentPhone: '',
          agentWhatsApp: '',
          agentFacebook: '',
          available: true
        });
      } else {
        setError(response.error || 'Failed to create listing');
      }
    } catch (err: any) {
      setError(err?.error || err?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Listing</h1>
          <p className="text-gray-600">Create a new property listing</p>
        </div>
      </div>

      {/* Success/Error Feedback */}
      {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
      {error && <div className="text-red-600 font-semibold text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Bedsitter - Lurambi, Near MMUST Gate"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
            </div>
            <div>
              <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Single">Single</option>
                <option value="Bedsitter">Bedsitter</option>
                <option value="Two-bedroom">Two-bedroom</option>
                <option value="Other">Other</option>
              </select>
              {errors.roomType && <p className="text-red-600 text-xs mt-1">{errors.roomType}</p>}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (KSh)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="4000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="paymentFrequency" className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
              <select
                id="paymentFrequency"
                name="paymentFrequency"
                value={formData.paymentFrequency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Monthly">Monthly</option>
                <option value="Semester">Semester</option>
                <option value="Flexible">Flexible</option>
              </select>
              {errors.paymentFrequency && <p className="text-red-600 text-xs mt-1">{errors.paymentFrequency}</p>}
            </div>
            <div>
              <label htmlFor="locationText" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                id="locationText"
                name="locationText"
                value={formData.locationText}
                onChange={handleInputChange}
                placeholder="e.g., Lurambi, Kakamega"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              {errors.locationText && <p className="text-red-600 text-xs mt-1">{errors.locationText}</p>}
            </div>
            <div>
              <label htmlFor="areaNickname" className="block text-sm font-medium text-gray-700 mb-2">Area Nickname (optional)</label>
              <select
                id="areaNickname"
                name="areaNickname"
                value={formData.areaNickname === '' ? '' : areaOptions.includes(formData.areaNickname) ? formData.areaNickname : 'Other'}
                onChange={e => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    areaNickname: value === 'Other' ? '' : value
                  }));
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select area (optional)</option>
                {areaOptions.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              {formData.areaNickname === '' && (
                <input
                  type="text"
                  id="areaNicknameCustom"
                  name="areaNicknameCustom"
                  value={formData.areaNickname}
                  onChange={e => setFormData(prev => ({ ...prev, areaNickname: e.target.value }))}
                  placeholder="Enter custom area nickname"
                  className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={formData.areaNickname !== '' && areaOptions.includes(formData.areaNickname)}
                />
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe the property, amenities, and any special features..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
            </div>
            <div className="md:col-span-2 flex items-center gap-3 mt-2">
              <input
                id="isSecureArea"
                name="isSecureArea"
                type="checkbox"
                checked={formData.isSecureArea}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isSecureArea" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                Secure Area
              </label>
              <span className="ml-2 text-xs text-gray-400" title="Check if this property is in a secure or gated area.">
                (Check if this property is in a secure or gated area)
              </span>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 mt-2">
              <input
                id="stayTwoPeople"
                name="stayTwoPeople"
                type="checkbox"
                checked={formData.stayTwoPeople}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="stayTwoPeople" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                Suitable for Two People
              </label>
            </div>
            <div className="md:col-span-2 flex items-center gap-3 mt-2">
              <input
                id="available"
                name="available"
                type="checkbox"
                checked={formData.available}
                onChange={handleInputChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="available" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                Available
              </label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Amenities</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {genderOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h3>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">Upload images</span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB each</p>
            </div>
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="agentPhone"
                value={formData.agentPhone}
                onChange={handleInputChange}
                placeholder="+254 700 000 000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              {errors.agentPhone && <p className="text-red-600 text-xs mt-1">{errors.agentPhone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
              <input
                type="tel"
                name="agentWhatsApp"
                value={formData.agentWhatsApp}
                onChange={handleInputChange}
                placeholder="+254 700 000 000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
              <input
                type="text"
                name="agentFacebook"
                value={formData.agentFacebook}
                onChange={handleInputChange}
                placeholder="https://www.facebook.com/example"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors duration-200"
            disabled={loading}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListingView; 