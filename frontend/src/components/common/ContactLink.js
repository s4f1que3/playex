import React, { useState } from 'react';
import ContactFormModal from './ContactForm';

const ContactLink = ({ children, className = '', subject = '', buttonStyle = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (buttonStyle) {
    return (
      <>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={className}
        >
          {children}
        </button>
        
        <ContactFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          subject={subject}
        />
      </>
    );
  }

  return (
    <>
      <span 
        onClick={() => setIsModalOpen(true)}
        className={`cursor-pointer ${className}`}
      >
        {children}
      </span>
      
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subject={subject}
      />
    </>
  );
};

export default ContactLink;
