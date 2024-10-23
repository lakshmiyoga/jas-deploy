import React from 'react';
import MetaData from './MetaData';
import { useLocation } from 'react-router-dom';


const TermsAndConditions = () => {
  const location = useLocation();
  sessionStorage.setItem('redirectPath', location.pathname);
  return (
    <div>
      {/* <MetaData title={'Terms And Conditions'} /> */}
      <MetaData
        title="Terms and Conditions"
        description="Review the terms and conditions that govern your use of our website, services, and products. Ensure you understand our policies before proceeding."
      />

      <div className="products_heading">Terms And Conditions</div>
      <div className="refund-policy-container">
        <h3>Terms And Conditions</h3>
        <h5>Introduction</h5>
        <p>These Terms and Conditions govern the sale of fruits and vegetables through our online platform. By accessing our website and placing an order, you agree to these terms.</p>

        <h5>Acceptance of Terms</h5>
        <p>By using our services, you confirm that you accept these terms and conditions in full. If you disagree with any part, you must not use our services.</p>

        <h5>User Eligibility</h5>
        <p>You must be at least 18 years old to place an order. By placing an order, you confirm that you meet this age requirement.</p>

        <h5>Account Registration</h5>
        <p>Users must create an account to place orders. You are responsible for maintaining the confidentiality of your account information and for all activities under your account.</p>

        <h5>Product Descriptions</h5>
        <p>We strive to provide accurate descriptions and images of our products. However, variations in color, size, and appearance may occur.</p>

        <h5>Pricing</h5>
        <p>All prices are listed in [Rs] and are subject to change. Prices do not include delivery fees unless specified.</p>

        <h5>Order Process</h5>
        <p>To place an order, select your desired products, provide necessary information, and complete the payment process. An order confirmation will be sent via email.</p>

        <h5>Payment Terms</h5>
        <p>Payments must be made at the time of order. We accept UPI, Credit Cards,Debit Cards, Wallets, and Net Banking. All transactions are secured.</p>

        <h5>Delivery</h5>
        <p>Delivery times may vary based on location. We are not responsible for delays caused by unforeseen circumstances.</p>

        <h5>Returns and Refunds</h5>
        <p>Due to the perishable nature of our products, returns are only accepted for damaged or incorrect items. Please notify us within 24 hours of delivery for resolution.</p>

        <h5>Risk of Loss</h5>
        <p>Risk of loss for the products passes to you upon delivery. We are not liable for any loss or damage after delivery.</p>

        <h5>Health and Safety</h5>
        <p>We comply with all relevant health and safety regulations. If you have allergies, please check product descriptions or contact us for more information.</p>

        <h5>Limitation of Liability</h5>
        <p>Our liability is limited to the maximum extent permitted by law. We are not liable for indirect or consequential losses.</p>

        <h5>Indemnification</h5>
        <p>You agree to indemnify us against any claims arising from your use of our services or violation of these terms.</p>

        <h5>Changes to Terms</h5>
        <p>We reserve the right to modify these terms at any time. Changes will be posted on our website, and your continued use constitutes acceptance of the new terms.</p>

        <h5>Governing Law</h5>
        <p>These terms are governed by the laws of India. Any disputes will be resolved in the courts of India.</p>

        <h5>Contact Information</h5>
        <p>For questions or concerns regarding these terms, please contact us at Jasfruitsandvegetables@gmail.com.</p>

      </div>
    </div>

  )
}

export default TermsAndConditions
