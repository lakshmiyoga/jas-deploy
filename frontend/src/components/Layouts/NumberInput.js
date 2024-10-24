import React, { useRef, useEffect } from 'react';


const NumberInput = ({ value, onChange, ...rest }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('wheel', handleWheel);

      return () => {
        inputElement.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <input
      type="number"
      ref={inputRef}
      min="0"
      
      value={value}
      onChange={onChange}
      className="no-arrow-input form-control"
      {...rest}
      required
    />
  );
};

export default NumberInput;