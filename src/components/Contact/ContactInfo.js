import React from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "../Contact/ContactInfo.css";
const ContactInfo = () => {
  return (
    <section id="contact-section" className="contact-info">
      <div className="container">
        <h2 className="contact-title">📞 Contact Us</h2>
        <p className="contact-text">We are always here to help you! Contact us anytime.</p>

        <div className="contact-content">
          {/* Contact details section */}
          <div className="contact-details">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <p><strong>Email:</strong> JameThrew@gmail.com</p>
            </div>
            <div className="contact-item">
              <FaPhoneAlt className="contact-icon" />
              <p><strong>Phone:</strong> +0354446188</p>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon-map"/>
              <p><strong>Address:</strong> 391A Nam Ky Khoi Nghia Str, Vo Thi Sau Ward,dist 3, Ho Chi Minh City</p>
            </div>
            <div className="contact-item">
              <FaClock className="contact-icon" />
              <p><strong>Hours:</strong> Mon - Fri (9:00 AM - 6:00 PM)</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="social-media">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="social-icon fb" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="social-icon ig" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="social-icon tw" />
              </a>

            </div>
          </div>

          {/* Support section */}
          <div className="support">
            <h3>Need Help?</h3>
            <p>If you need any help, feel free to reach out via email or use the social links above to stay in touch with us right away!!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
