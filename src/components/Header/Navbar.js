import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Header/Navbar.css';
import { MdFoodBank } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 60);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop,
        behavior: "smooth",
      });
    }
  };
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
        <div className="brand-and-toggler flex align-center justify-between">
              <Link to="/" className="navbar-brand fw-3 fs-22 flex align-center"  onClick={scrollToTop}>
                <MdFoodBank />
                <span className="navbar-brand-text fw-7">James Thew</span>
              </Link>
              <div >
              <Link to="/recipe" className="login-btn"  onClick={scrollToTop}>Recipe</Link>
              <Link to="/contest" className="login-btn"  onClick={scrollToTop}>Competition</Link>
              <Link className="login-btn" onClick={scrollToContact} > Contact </Link>
              <Link to="/helppage" className="login-btn"  onClick={scrollToTop}>HelpPage</Link>
              <Link to="/login" className="login-btn"  onClick={scrollToTop}>Login</Link>             
              <button onClick={toggleModal} className="login-btn">
                <FaBell size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Winner Announcement</h2>
            <div className="winner-info">
              {/* <img src={selectedWinnerAvatar} alt="Avatar" className="winner-avatar" /> */}
              <p>Congratulations to the contest winner!</p>
            </div>
            <button onClick={toggleModal} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
