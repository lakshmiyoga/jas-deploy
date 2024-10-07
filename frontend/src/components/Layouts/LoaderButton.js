import React, { useEffect } from 'react';

const LoaderButton = ({ size }) => {
  useEffect(() => {
    // Create a <style> element
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    // Append the <style> element to the <head>
    document.head.appendChild(style);

    // Cleanup: Remove the style element when the component is unmounted
    return () => {
      document.head.removeChild(style);
    };
  }, []); // Run this effect only once

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        border: '2px solid #f3f3f3',
        borderTop: '2px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',  // Apply the animation
      }}>
      </div>
    </div>
  );
};

export default LoaderButton;
