import React from 'react';
import Card from '../components/ui/Card';
import ContactForm from '../components/contact/ContactForm';
import ContactInfo from '../components/contact/ContactInfo';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <ContactForm />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-2xl font-semibold mb-6">Get in touch</h2>
            <ContactInfo />
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-6">Office Hours</h2>
            <div className="space-y-2 text-gray-600">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;