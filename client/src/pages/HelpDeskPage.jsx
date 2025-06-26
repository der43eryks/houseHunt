import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Phone, Mail, MessageCircle, Facebook, Clock, MapPin, Star, Send } from 'lucide-react';
import { clientAPI } from '../services/api';
import toast from 'react-hot-toast';

const HelpDeskPage = () => {
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });

  // Fetch help desk info
  const { data: helpDeskData, isLoading } = useQuery(
    'helpDesk',
    clientAPI.getHelpDesk,
    { staleTime: 5 * 60 * 1000 }
  );

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation(
    (data) => clientAPI.submitFeedback(data),
    {
      onSuccess: () => {
        toast.success('Thank you for your feedback!');
        setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
      },
      onError: (error) => {
        toast.error(error.error || 'Failed to submit feedback. Please try again.');
      }
    }
  );

  const helpDesk = helpDeskData?.data;

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    submitFeedbackMutation.mutate(feedbackForm);
  };

  const handleContact = (type) => {
    switch (type) {
      case 'phone':
        if (helpDesk?.phone) {
          window.location.href = `tel:${helpDesk.phone}`;
        } else {
          toast.error('Phone number not available');
        }
        break;
      case 'whatsapp':
        if (helpDesk?.whatsappLink) {
          window.open(helpDesk.whatsappLink, '_blank');
        } else {
          toast.error('WhatsApp not available');
        }
        break;
      case 'facebook':
        if (helpDesk?.facebook) {
          window.open(helpDesk.facebook, '_blank');
        } else {
          toast.error('Facebook not available');
        }
        break;
      case 'email':
        if (helpDesk?.email) {
          window.location.href = `mailto:${helpDesk.email}`;
        } else {
          toast.error('Email not available');
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you find your perfect student accommodation. 
            Get in touch with us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{helpDesk?.phone || 'Not available'}</p>
                  </div>
                  {helpDesk?.phone && (
                    <button
                      onClick={() => handleContact('phone')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Call Now
                    </button>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                    <p className="text-gray-600">Quick messaging support</p>
                  </div>
                  {helpDesk?.whatsappLink && (
                    <button
                      onClick={() => handleContact('whatsapp')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Chat Now
                    </button>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{helpDesk?.email || 'Not available'}</p>
                  </div>
                  {helpDesk?.email && (
                    <button
                      onClick={() => handleContact('email')}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Send Email
                    </button>
                  )}
                </div>

                {/* Facebook */}
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Facebook className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Facebook</h3>
                    <p className="text-gray-600">Follow us for updates</p>
                  </div>
                  {helpDesk?.facebook && (
                    <button
                      onClick={() => handleContact('facebook')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Visit Page
                    </button>
                  )}
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Available Hours</h3>
                    <p className="text-gray-600">{helpDesk?.availableHours || 'Not specified'}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Kakamega, Kenya</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            {helpDesk?.faq && helpDesk.faq.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {helpDesk.faq.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us Feedback</h2>
            <p className="text-gray-600 mb-6">
              We'd love to hear from you! Share your experience or suggestions to help us improve our service.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={feedbackForm.name}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={feedbackForm.email}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= feedbackForm.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {feedbackForm.rating} out of 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows="4"
                  value={feedbackForm.message}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your experience or suggestions..."
                />
              </div>

              <button
                type="submit"
                disabled={submitFeedbackMutation.isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>
                  {submitFeedbackMutation.isLoading ? 'Sending...' : 'Send Feedback'}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-600 mb-6">
            For urgent matters, please call us directly or send us a WhatsApp message. 
            We typically respond within 30 minutes during business hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            {helpDesk?.phone && (
              <button
                onClick={() => handleContact('phone')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Call Now</span>
              </button>
            )}
            {helpDesk?.whatsappLink && (
              <button
                onClick={() => handleContact('whatsapp')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>WhatsApp</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDeskPage; 