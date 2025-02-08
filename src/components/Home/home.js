
import React, { useState } from 'react';
import "../Home/home.css";
import imageSrc from '../pikaso_texttoimage_Steps-to-Becoming-a-Professional-Chef-in-India.jpeg';
import { faqData } from '../FAQ/faqData'; // Đảm bảo bạn có dữ liệu faqData
import IconsMinus from '../assets/images/icon-minus.svg';
import IconsPlus from '../assets/images/icon-plus.svg';
function Home() {
  const [Index, setIndex] = useState(null); 
  const [isClicked, setIsClicked] = useState(false);

  const toggleFaq = (index) => {
    setIsClicked((prevClicked) => (prevClicked === index ? null : index));
  };

  return (
    <div className="home">
      <div className="home-content">
        <div className="home-info">
          <img
            src={imageSrc}
            alt="James Thew"
            className="home-image"
          />
          <h3>About James Thew</h3>
          <p>
            James Thew is a renowned chef with a passion for culinary arts and innovation in cooking. He has won numerous awards and authored several cookbooks.
          </p>
          
          <div className="achievements">
            <h3>Notable Achievements:</h3>
            <ul>
              <li> Best Chef of the Year 2020</li>
              <li> Author of 5 Bestselling Cookbooks</li>
              <li> Owner of a Renowned Restaurant Chain</li>
            </ul>
          </div>

          <div className="achievements">
            <h3>The Great Donate:</h3>
            <ul>
              <li>During this festive period, James Thew Restaurants is supporting the fundraising efforts of the James and Tana Thew Foundation by adding a voluntary £1 donation to guest bills. This donation will support GOSH Charity in building a new Children's Cancer Centre at Great Ormond Street Hospital.</li>
              <li>The James and Tana Thew Foundation is a fund within Great Ormond Street Hospital Children’s Charity. All funds raised support priority projects at the charity.</li>
              <li>If you would like to support us, you can donate to GOSH Charity via the James and Tana Thew Foundation.</li>
            </ul>
          </div>

          {/* Accordion Section */}
          <div className="achievements questions-section ">
            <h2>Frequently asked questions:</h2>
            {faqData.map((item, index) => (
          <div key={index} className="faq" onClick={() => toggleFaq(index)}>
            <div className="question">
              <h2>{item.question}</h2>

              {isClicked === index ? (
                <img className="icon" src={IconsMinus} alt="" />
              ) : (
                <img className="icon" src={IconsPlus} alt="" />
              )}
            </div>

            <p className={`content ${isClicked === index ? 'show' : ''}`}>
              {item.answer}
            </p>
            </div>
          ))}
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
