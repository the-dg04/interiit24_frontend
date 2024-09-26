import React, { useState } from 'react';

const ToggleSection = ({ title, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  return (
    <div>
      <button onClick={toggleVisibility}>
        {isVisible ? 'Hide' : 'Show'} {title}
      </button>
      {isVisible && <div>{children}</div>}
    </div>
  );
};
export default ToggleSection;
