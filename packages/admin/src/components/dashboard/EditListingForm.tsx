import React, { useState } from 'react';
import FormSection from './FormSection';
import AuthInput from '../AuthInput';
import { UploadCloud, Save, Plus } from 'lucide-react';

const EditListingForm: React.FC = () => {
  const [status, setStatus] = useState<'published' | 'draft' | 'booked' | 'archived'>('published');
  const [available, setAvailable] = useState(true);

  const handleBook = () => {
    setStatus('booked');
    setAvailable(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-gray-900">Add New Listing</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </button>
      </div>
      
      <form className="space-y-6">
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput label="Title*" type="text" placeholder="e.g. Bedsitter - Lurambi, Near MMUST" />
            <AuthInput label="Area Nickname/Tags" type="text" placeholder="e.g. Student Zone, Campus" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type*</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200">
                <option>Select Room Type</option>
                <option>Bedsitter</option>
                <option>Single Room</option>
                <option>Two Bedroom</option>
              </select>
            </div>
            <AuthInput label="Location*" type="text" placeholder="e.g. Lurambi, Near MMUST Gate" />
          </div>
        </FormSection>

        <FormSection title="Pricing Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput label="Price*" type="number" placeholder="e.g. 4000" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency*</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200">
                <option>Select Payment Frequency</option>
                <option>Monthly</option>
                <option>Per Semester</option>
              </select>
            </div>
          </div>
        </FormSection>

        <FormSection title="Features & Amenities">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Wi-Fi', 'Water Included', 'Security', 'Tiled Floors', 'Token Meter', 'Freshly Painted'].map(item => (
              <label key={item} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700 font-medium">{item}</span>
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="Description & Details">
          <textarea
            placeholder="Describe the house, amenities, distance to campus, etc."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200 resize-none"
          ></textarea>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender Restriction</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-all duration-200">
                <option>Any Gender</option>
                <option>Male Only</option>
                <option>Female Only</option>
              </select>
            </div>
            <AuthInput label="Walk Time to Campus (minutes)" type="number" placeholder="e.g. 10" />
          </div>
        </FormSection>

        <FormSection title="Images">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 bg-gray-50 transition-all duration-200">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 font-medium">Click to upload images or drag and drop here</p>
              <p className="text-xs text-gray-500 mt-1">(You can select multiple images)</p>
          </div>
        </FormSection>

        <FormSection title="Agent Contact Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AuthInput label="Agent Phone*" type="text" placeholder="e.g. +254712345678" />
            <AuthInput label="Agent Email*" type="email" placeholder="e.g. info@enigmatic.com" />
          </div>
        </FormSection>

        <FormSection title="Listing Status">
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="booked">Booked</option>
              <option value="archived">Archived</option>
            </select>
            <label className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
              <input
                type="checkbox"
                checked={available}
                onChange={e => setAvailable(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-green-800 font-medium">Mark as Available</span>
            </label>
            <button
              type="button"
              onClick={handleBook}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-medium mt-2"
            >
              Book Listing
            </button>
            <div className="mt-2 text-xs text-gray-500">Current status: <span className="font-semibold">{status}</span></div>
          </div>
        </FormSection>

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors duration-200 font-medium flex items-center justify-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Publish Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListingForm; 