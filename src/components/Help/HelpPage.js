import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Help/HelpPage.css";

const FAQSection = ({ faq, selectedFAQ, toggleFAQ }) => (
  <div className="faq-list">
    {faq.map((item, index) => (
      <div key={index} className="faq-item">
        <h3 onClick={() => toggleFAQ(index)} className={selectedFAQ === index ? "active" : ""}>
          {item.question}
        </h3>
        {selectedFAQ === index && <p>{item.answer}</p>}
      </div>
    ))}
  </div>
);

const PrivacyPolicySection = ({ privacyPolicy, selectedPolicy, togglePolicy }) => (
  <div className="privacy-policy">
    {privacyPolicy.map((item, index) => (
      <div key={index} className="privacy-item">
        <h3 onClick={() => togglePolicy(index)} className={selectedPolicy === index ? "active" : ""}>
          {item.item}
        </h3>
        {selectedPolicy === index && <div>{item.answer}</div>}
      </div>
    ))}
  </div>
);

const FeedbackForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = "User Feedback";
    const body = `Name: ${name}\n\nMessage: ${message}`;
    const mailtoLink = `mailto:htaicode@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <label htmlFor="name">Your Name:</label>
      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      <label htmlFor="message">Your Feedback:</label>
      <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
      <button type="submit">Send Feedback</button>
    </form>
  );
};

const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for help topics..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const navigate = useNavigate();

  const topics = useMemo(() => [
    { title: "FAQ", description: "Frequently Asked Questions." },
    { title: "Privacy Policy", description: "Our privacy policy." },
    { title: "Feedback", description: "User feedback and suggestions." },
  ], []);

  const faq = useMemo(() => [
    {
      question: "How to become a member of this site?",
      answer:
        "To become a member, click on the Sign-Up button on the homepage, fill out the registration form, and choose a subscription plan (10 USD/month or 100 USD/year). Once your payment is successful, you’ll officially become a member.",
    },
    {
      question: "Will there be any subscription charges?",
      answer:
        "Yes, the subscription fee is 10 USD per month or 100 USD per year. The annual plan offers better savings compared to the monthly plan.",
    },
    {
      question: "How to view the recipes and tips? Will there be any charges for that?",
      answer:
        "You need to be a registered member to access the Recipes & Tips section. Once subscribed, you can enjoy unlimited access without any additional charges.",
    },
    {
      question: "I am not a registered member of the site. Can I participate in the contests?",
      answer:
        "No, only registered members can participate in the contests. Sign up now to enjoy exclusive participation opportunities.",
    },
    {
      question: "How to upload or post recipes and tips?",
      answer:
        "Once logged in, go to the Submit Recipe/Tip section. Fill out the required details, upload images if needed, and click Post. Your submission will be reviewed before being published.",
    },
    {
      question: "How to post feedback?",
      answer:
        "To post feedback, visit the Feedback section on the site. Fill out the form with your comments or suggestions and click Submit. Your feedback helps us improve!",
    },
    {
      question: "I have posted a recipe or tip for the contest. How can I know who the winner is?",
      answer:
        "After the contest ends, winners will be announced on the Contest Results page. You will also receive an email notification if you are one of the winners.",
    },
  ], []);


    // Privacy policy content
    const privacyPolicy = useMemo(() => [
      {
        item: "1. Data Collection",
        answer: (
          <>
            We collect only the necessary data required for account creation, processing payments, and providing a seamless user experience.
            <p>This data may include your name, email address, payment information, and any other details needed for account management.</p>
            <p>We may also collect non-personal information, such as browser type, operating system, and browsing behavior, to enhance user experience.</p>
          </>
        ),
      },
      {
        item: "2. Data Usage",
        answer: (
          <>
            Your personal data is used strictly for the purposes mentioned above and to improve our services.
            <p>We may use your email address to send you updates, newsletters, or promotional content. You can opt out of receiving these communications at any time.</p>
            <p>We do not sell, rent, or share your information with third parties without your explicit consent, except as required by law.</p>
          </>
        ),
      },
      {
        item: "3. Data Storage",
        answer: (
          <>
            All personal information is stored securely using industry-standard encryption and access control mechanisms.
            <p>We regularly review our data storage practices to ensure compliance with the latest security standards.</p>
            <p>Personal data will only be retained for as long as it is necessary to fulfill the purposes for which it was collected, unless a longer retention period is required by law.</p>
          </>
        ),
      },
      {
        item: "4. Data Sharing",
        answer: (
          <>
            Your information will only be shared with trusted third-party services essential for payment processing and service delivery.
            <p>Any third parties we work with are required to maintain the same level of security and confidentiality.</p>
          </>
        ),
      },
      {
        item: "5. Your Rights",
        answer: (
          <>
            You have the right to access, update, or delete your personal information at any time.
            <p>You can request a copy of the data we hold about you by contacting our support team.</p>
            <p>If you wish to exercise these rights, please contact our support team for assistance.</p>
          </>
        ),
      },
      {
        item: "6. Cookies and Tracking",
        answer: (
          <>
            Our website uses cookies to enhance your browsing experience and analyze usage patterns.
            <p>Cookies may also be used to remember your preferences and login details for faster access.</p>
            <p>You can control cookie preferences through your browser settings. However, disabling cookies may impact the functionality of certain features.</p>
          </>
        ),
      },
      {
        item: "7. Third-Party Links",
        answer: (
          <>
            Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of these external sites.
            <p>We recommend reading the privacy policies of these sites before sharing any personal information.</p>
          </>
        ),
      },
      {
        item: "8. Security Measures",
        answer: (
          <>
            We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure.
            <p>Regular audits and updates are performed to maintain the highest security standards.</p>
            <p>In case of a data breach, we will notify affected users promptly and take necessary steps to mitigate the impact.</p>
          </>
        ),
      },
      {
        item: "9. Changes to the Policy",
        answer: (
          <>
            We may update our privacy policy from time to time to reflect changes in our practices or legal requirements.
            <p>Any changes will be communicated through our website, and the updated policy will take effect immediately.</p>
          </>
        ),
      },
      {
        item: "10. Contact Us",
        answer: (
          <>
            If you have any questions, concerns, or feedback about our privacy practices, please feel free to contact us through the support section of our website.
          </>
        ),
      }
      // Add other privacy policy sections here...
    ], []);

  const filteredTopics = useMemo(() => topics.filter(topic => topic.title.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, topics]);

  const toggleTopic = (index) => {
    setSelectedTopic(selectedTopic === index ? null : index);
    setSelectedFAQ(null);
    setSelectedPolicy(null);
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Help Center</h1>
        <SearchBar onSearch={setSearchTerm} />
        <button className="back-button" onClick={() => navigate("/")}>Back to Home</button>
      </div>

      <div className="help-topics">
        {filteredTopics.map((topic, index) => (
          <div key={index} className="topic-item">
            <h2 onClick={() => toggleTopic(index)} className={selectedTopic === index ? "active" : ""}>
              {topic.title}
            </h2>

            {selectedTopic === index && topic.title === "FAQ" && (
              <FAQSection faq={faq} selectedFAQ={selectedFAQ} toggleFAQ={setSelectedFAQ} />
            )}

            {selectedTopic === index && topic.title === "Privacy Policy" && (
              <PrivacyPolicySection privacyPolicy={privacyPolicy} selectedPolicy={selectedPolicy} togglePolicy={setSelectedPolicy} />
            )}

            {selectedTopic === index && topic.title === "Feedback" && <FeedbackForm />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
