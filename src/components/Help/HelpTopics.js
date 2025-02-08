import React from "react";
import "../../css/Help/HelpTopics.css";

const HelpTopics = ({ topics }) => {
  return (
    <div className="help-topics">
      {topics.map((topic, index) => (
        <div className="card" key={index}>
          <h3>{topic.title}</h3>
          <p>{topic.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HelpTopics;
