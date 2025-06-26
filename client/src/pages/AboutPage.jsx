import React from 'react';
import { Users, Home, Shield, Heart, Award, Target, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { clientAPI } from '../services/api';

const AboutPage = () => {
  const stats = [
    { icon: Home, number: '500+', label: 'Properties Listed' },
    { icon: Users, number: '1000+', label: 'Happy Students' },
    { icon: Shield, number: '100%', label: 'Secure Areas' },
    { icon: Award, number: '4.8', label: 'Average Rating' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Student-Focused',
      description: 'We understand the unique needs of students and provide housing solutions that fit their lifestyle and budget.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'All our properties are vetted for security and located in safe, student-friendly neighborhoods.'
    },
    {
      icon: Target,
      title: 'Quality Assurance',
      description: 'Every listing is personally verified by our team to ensure it meets our high standards.'
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'We help students find not just housing, but a community where they can thrive academically and socially.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Former student who experienced the housing challenges firsthand.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      description: 'Expert in property management with 10+ years of experience.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Aisha Patel',
      role: 'Student Relations',
      description: 'Dedicated to ensuring every student finds their perfect home.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D1B2A] w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white w-full">
        <div className="w-full px-8 py-20">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About HouseHunt</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl">Your trusted partner in finding the perfect student accommodation in Kakamega</p>
            <div className="flex items-center">
              <MapPin className="h-6 w-6 mr-2" />
              <span className="text-lg">Serving MMUST and surrounding areas since 2020</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-[#112240] w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-left bg-[#0D1B2A] p-6 rounded-xl shadow-md border-2 border-transparent hover:border-blue-500 transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-[#0D1B2A] w-full">
        <div className="px-8">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-xl text-gray-300 max-w-3xl">To simplify the student housing search process by providing a reliable, secure, and user-friendly platform that connects students with quality accommodation options near their educational institutions.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Why Choose HouseHunt?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Verified Properties</h4>
                    <p className="text-gray-300">Every listing is personally verified by our team to ensure quality and safety.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Student Community</h4>
                    <p className="text-gray-300">Connect with other students and find roommates through our platform.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">24/7 Support</h4>
                    <p className="text-gray-300">Our support team is always available to help you with any questions.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#112240] p-8 rounded-lg shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1523240798131-33771a4c0e6b?auto=format&fit=crop&w=900&q=80" 
                alt="Student housing" 
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-[#112240] w-full">
        <div className="px-8">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-xl text-gray-300">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-left p-6 bg-[#0D1B2A] rounded-lg border-2 border-transparent hover:border-blue-500 transition-all duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-[#0D1B2A] w-full">
        <div className="px-8">
          <div className="text-left mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300">The passionate people behind HouseHunt</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-[#112240] rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-72 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-blue-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-300">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-[#112240] w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center px-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                HouseHunt was born from a simple observation: finding quality student accommodation 
                in Kakamega was unnecessarily difficult and stressful. As former students ourselves, 
                we experienced firsthand the challenges of securing safe, affordable, and convenient housing.
              </p>
              <p>
                In 2020, we decided to change this. We started with a simple mission: to create a 
                platform that would make student housing search transparent, reliable, and stress-free. 
                What began as a small local initiative has grown into a trusted community resource.
              </p>
              <p>
                Today, we're proud to serve thousands of students, connecting them with quality 
                accommodation options and building a supportive community around student housing.
              </p>
            </div>
          </div>
          <div className="bg-[#0D1B2A] p-8 rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80" 
              alt="Our journey" 
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white w-full">
        <div className="text-left px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl mb-8 max-w-2xl">Join thousands of students who have found their ideal accommodation through HouseHunt</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Browse Listings</button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">Contact Us</button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-12 bg-[#0D1B2A] text-white w-full">
        <div className="grid md:grid-cols-3 gap-8 text-left px-8">
          <div>
            <Phone className="h-8 w-8 mb-4 text-blue-400" />
            <h3 className="font-semibold mb-2">Call Us</h3>
            <p>+254 712 345 678</p>
          </div>
          <div>
            <Mail className="h-8 w-8 mb-4 text-blue-400" />
            <h3 className="font-semibold mb-2">Email Us</h3>
            <p>info@househunt.com</p>
          </div>
          <div>
            <MessageCircle className="h-8 w-8 mb-4 text-blue-400" />
            <h3 className="font-semibold mb-2">WhatsApp</h3>
            <p>+254 712 345 678</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 