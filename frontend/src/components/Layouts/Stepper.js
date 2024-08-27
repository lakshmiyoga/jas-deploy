import React from 'react';
import PropTypes from 'prop-types';
// import './Stepper.css'; // Create and style this CSS as needed

const Stepper = ({ currentStep }) => {
   
    const steps = [
        { name: 'Open', value: 'open' },
        { name: 'Accepted', value: 'accepted' },
        { name: 'Live', value: 'live' },
        { name: 'Completed', value: 'ended' },
        { name: 'Cancelled', value: 'cancelled' },
    ];

    return (
        <div className="stepper">
            {steps.map((step, index) => (
                <div
                    key={step.value}
                    className={`step ${currentStep === step.value ? 'active' : ''} ${index < steps.findIndex(s => s.value === currentStep) ? 'ended' : ''}`}
                >
                    <div className="step-number">{index + 1}</div>
                    <div className="step-name">{step.name}</div>
                </div>
            ))}
        </div>
    );
};

Stepper.propTypes = {
    currentStep: PropTypes.string.isRequired,
};

export default Stepper;
