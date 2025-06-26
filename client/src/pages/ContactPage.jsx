import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { clientAPI } from '../services/api';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

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

  // Submit contact form mutation
  const submitContactMutation = useMutation(
    (data) => clientAPI.submitFeedback({ ...data, listingId: null }),
    {
      onSuccess: () => {
        toast.success('Thank you for your message! We will get back to you soon.');
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      },
      onError: (error) => {
        toast.error(error.error || 'Failed to send message. Please try again.');
      }
    }
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    submitContactMutation.mutate(contactForm);
  };

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

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our support team',
      action: 'Call Now',
      onClick: () => handleContact('phone'),
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick messaging for instant support',
      action: 'Chat Now',
      onClick: () => handleContact('whatsapp'),
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us a detailed message',
      action: 'Send Email',
      onClick: () => handleContact('email'),
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Facebook,
      title: 'Facebook',
      description: 'Follow us for updates and support',
      action: 'Visit Page',
      onClick: () => handleContact('facebook'),
      color: 'bg-blue-100 text-blue-600'
    }
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're here to help you find your perfect student accommodation. 
            Get in touch with us through any of the channels below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${method.color}`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      <p className="text-gray-600 text-sm">{method.description}</p>
                    </div>
                    <button
                      onClick={method.onClick}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      {method.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Office Information */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Office Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">Kakamega, Kenya</p>
                    <p className="text-gray-600">Near MMUST Campus</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">{helpDesk?.availableHours || 'Monday - Friday: 8:00 AM - 6:00 PM'}</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Us</h2>
              
              <div className="flex space-x-4">
                <a
                  href={helpDesk?.facebook || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Forms */}
          <div className="space-y-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
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
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitContactMutation.isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>
                    {submitContactMutation.isLoading ? 'Sending...' : 'Send Message'}
                  </span>
                </button>
              </form>
            </div>

            {/* Feedback Form */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Feedback</h2>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <svg
                          className={`h-6 w-6 ${
                            star <= feedbackForm.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {feedbackForm.rating} out of 5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Share your experience with us..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitFeedbackMutation.isLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>
                    {submitFeedbackMutation.isLoading ? 'Submitting...' : 'Submit Feedback'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-gray-600">Visit our office in Kakamega</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7!2d34.8!3d0.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMTgnMDAuMCJOIDM0wrA0OCcwMC4wIkU!5e0!3m2!1sen!2ske!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HouseHunt Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 