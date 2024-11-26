import React, { useEffect, useState } from "react";
import NumberInput from "./NumberInput"; // Assuming you have a NumberInput component

const WeightInput = ({ product, weight, handleWeightChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1); // Tracks the focused option index

  // Generate dropdown options based on the product's measurement
  const options =
    product.measurement === "Kg"
      ? [...Array(6).keys()].map((i) => ((i + 1) * 0.5).toString())
      : [...Array(3).keys()].map((i) => (i + 1).toString());

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex < options.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : options.length - 1
      );
    } else if (e.key === "Enter" && focusedIndex !== -1) {
      handleWeightChange(
        product && product._id,
        options[focusedIndex],
        product && product.category,
        product && product.measurement,
        product && product.maximumQuantity
      );
      setShowDropdown(false);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const handleOptionClick = (option) => {
    handleWeightChange(
      product && product._id,
      option,
      product && product.category,
      product && product.measurement,
      product && product.maximumQuantity
    );
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowDropdown(false); // Close the dropdown when user starts scrolling
    };

    if (showDropdown) {
      window.addEventListener("scroll", handleScroll);
    }

    // Clean up the event listener when component unmounts or dropdown closes
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showDropdown]);

  return (
    <td className="Weight" style={{ position: "relative" }}>
      <NumberInput
        value={weight[product._id] || ""}
        style={{marginBottom:'5px'}}
        onChange={(e) =>
          handleWeightChange(
            product && product._id,
            e.target.value,
            product && product.category,
            product && product.measurement,
            product && product.maximumQuantity
          )
        }
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        onKeyDown={handleKeyDown}
        className="form-select no-arrow-input form-control custom-placeholder"
        placeholder={`Select/type`}
        min="0.25"
        type="number"
      />

      {showDropdown && (
        <div>
          
          {/* Dropdown Options */}
          <ul
            style={{
              position: "absolute",
              maxWidth:'100px',
              minWidth:'100px',
              left: "50%",
              transform: "translateX(-50%)",
            //   width: "70%",
              backgroundColor: "#fff",
              zIndex: 10,
              listStyle: "none",
              margin: 0,
              padding: 0,
              borderLeft: "solid transparent",
              borderRight: "solid transparent",
              borderBottom: "solid #fff",
              boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
              borderTop: "1px solid transparent", // Changed to borderTop for upward arrow
              height:'auto',
              overflowY: "auto",
              
            }}
          >

            {options.map((option, index) => (
              <li
                key={option}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  margin:'3px',
                  borderRadius:'5px',
                  fontSize:'13px',
                  backgroundColor: focusedIndex === index ? "#e9ecef" : "#fff",
                  color: focusedIndex === index ? "#495057" : "#000",
                  transition: "background-color 0.2s, color 0.2s",
                //   borderBottom: index < options.length - 1 ? "1px solid #f1f3f5" : "none",
                }}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setFocusedIndex(index)}
                onClick={() => handleOptionClick(option)}
              >
                {option} {product && product.measurement}
              </li>
            ))}
          </ul>
          </div>
      )}
    </td>
  );
};

export default WeightInput;