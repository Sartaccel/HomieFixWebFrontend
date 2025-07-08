import React, { useEffect } from "react";
import "../styles/LoginLoading.css";

const LoginLoading = ({ onFinish }) => {
  useEffect(() => {
    // Reset animation by forcing reflow
    const progress = document.querySelector('.progress');
    if (progress) {
      progress.style.animation = 'none';
      void progress.offsetWidth; // Trigger reflow
      progress.style.animation = 'progressLoad 2.5s ease-in-out forwards';
    }

    const timer = setTimeout(onFinish, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="loading-container">
      <div className="homiefix-text">HomieFix</div>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginLoading;