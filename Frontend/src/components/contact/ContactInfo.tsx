import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

type ContactItemProps = {
  icon: React.ReactNode;
  text: string;
};

const ContactItem: React.FC<ContactItemProps> = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="text-blue-600">{icon}</div>
    <span className="text-gray-600">{text}</span>
  </div>
);

const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <ContactItem 
        icon={<Mail className="w-5 h-5" />}
        text="contact@heartguard.ai"
      />
      <ContactItem 
        icon={<Phone className="w-5 h-5" />}
        text="+1 (555) 123-4567"
      />
      <ContactItem 
        icon={<MapPin className="w-5 h-5" />}
        text="123 AI Boulevard, Silicon Valley, CA 94025"
      />
    </div>
  );
};

export default ContactInfo;