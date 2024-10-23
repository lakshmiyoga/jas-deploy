import React from 'react';
import MetaData from './MetaData';
import { useLocation } from 'react-router-dom';


const PrivacyPolicy = () => {
  const location = useLocation();
  sessionStorage.setItem('redirectPath', location.pathname);
  return (
    <div>
      {/* <MetaData title={'Privacy Policy'} /> */}
      <MetaData
        title="Privacy Policy"
        description="Understand how we handle and protect your personal information. Read our privacy policy to learn about your rights and our data practices."
      />

      <div className="products_heading">Privacy Policy</div>

      {/* <div className="privacy_container">
        <h3>Privacy Policy</h3>
        <h5>Personal Information</h5>
        <p>“RVP Sourcing” is the licensed owner for RVP Sourcing Online and the company respects your privacy. This Privacy Policy provides succinctly the manner your data is collected and used by RVP Sourcing Online on the Site. As a visitor to the Site/ Customer you are advised to please read the Privacy Policy carefully. By accessing the services provided by the Site you agree to the collection and use of your data by RVP Sourcing Online in the manner provided in this Privacy Policy.</p>

        <h5>What information is, or may be, collected from you?</h5>
        <p>As part of the registration process on the Site, RVP Sourcing Online may collect the following personally identifiable information about you: Name including first and last name, alternate email address, mobile phone number and contact details, Postal code, Demographic profile (like your age, gender, occupation, education, address etc.) and information about the pages on the site you visit/access, the links you click on the site, the number of times you access the page and any such browsing information.</p>

        <h5>How do we collect the information?</h5>
        <p>RVP Sourcing Online will collect personally identifiable information about you only as part of a voluntary registration process, on-line survey or any combination thereof. The Site may contain links to other Web sites. RVP Sourcing Online is not responsible for the privacy practices of such Web sites which it does not own, manage or control. The Site and third-party vendors, including Google, use first-party cookies (such as the Google Analytics cookie) and third-party cookies (such as the Double Click cookie) together to inform, optimize, and serve ads based on someone's past visits to the Site.</p>

        <h5>How is information used?</h5>
        <p>RVP Sourcing Online will use your personal information to provide personalized features to you on the Site and to provide for promotional offers to you through the Site and other channels. RVP Sourcing Online will also provide this information to its business associates and partners to get in touch with you when necessary to provide the services requested by you. RVP Sourcing Online will use this information to preserve transaction history as governed by existing law or policy. RVP Sourcing Online may also use contact information internally to direct its efforts for product improvement, to contact you as a survey respondent, to notify you if you win any contest; and to send you promotional materials from its contest sponsors or advertisers. RVP Sourcing Online will also use this information to serve various promotional and advertising materials to you via display advertisements through the Google Ad network on third party websites. You can opt out of Google Analytics for Display Advertising and customize Google Display network ads using the Ads Preferences Manager. Information about Customers on an aggregate (Excluding any information that may identify you specifically) covering Customer transaction data and Customer demographic and location data may be provided to partners of RVP Sourcing Online for the purpose of creating additional features on the website, creating appropriate merchandising or creating new products and services and conducting marketing research and statistical analysis of customer behavior and transactions.</p>

        <h5>With whom your information will be shared</h5>
        <p>RVP Sourcing Online will not use your financial information for any purpose other than to complete a transaction with you. RVP Sourcing Online does not rent, sell or share your personal information and will not disclose any of your personally identifiable information to third parties. In cases where it has your permission to provide products or services you've requested and such information is necessary to provide these products or services the information may be shared with RVP Sourcing Online’ s business associates and partners. RVP Sourcing Online may, however, share consumer information on an aggregate with its partners or third parties where it deems necessary. In addition RVP Sourcing Online may use this information for promotional offers, to help investigate, prevent or take action regarding unlawful and illegal activities, suspected fraud, potential threat to the safety or security of any person, violations of the Site’s terms of use or to defend against legal claims; special circumstances such as compliance with subpoenas, court orders, requests/order from legal authorities or law enforcement agencies requiring such disclosure.</p>

        <h5>What choices are available to you regarding collection, use and distribution of your information?</h5>
        <p>To protect against the loss, misuse and alteration of the information under its control, RVP Sourcing Online has in place appropriate physical, electronic and managerial procedures. For example, RVP Sourcing Online servers are accessible only to authorized personnel and your information is shared with employees and authorized personnel on a need to know basis to complete the transaction and to provide the services requested by you. Although RVP Sourcing Online will endeavor to safeguard the confidentiality of your personally identifiable information, transmissions made by means of the Internet cannot be made absolutely secure. By using this site, you agree that RVP Sourcing Online will have no liability for disclosure of your information due to errors in transmission or unauthorized acts of third parties.</p>

        <h5>How can you correct inaccuracies in the information?</h5>
        <p>To correct or update any information you have provided, the Site allows you to do it online. In the event of loss of access details you can send an</p>
        <br />
        <p>Email to: info@rvpsourcing.firm.in</p>

        <h5>Policy updates</h5>
        <p>“RVP Sourcing Online” reserves the right to change or update this policy at any time. Such changes shall be effective immediately upon posting to the Site.</p>

      </div> */}
      <div className="refund-policy-container">
  <h3>Privacy Policy</h3>
  <p>Effective Date: [22-10-2024]</p>

  <h5>Introduction</h5>
  <p>This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our online platform for purchasing fruits and vegetables.</p>

  <h5>Information We Collect</h5>
  <ul>
    <li>Personal Information: We collect information that can identify you, such as your name, email address, phone number, billing address, and shipping address when you create an account or place an order.</li>
    <li>Payment Information: We collect payment information through our secure payment processor. We do not store your credit card details.</li>
    <li>Usage Data: We may collect information about how you interact with our website, including IP addresses, browser types, and pages visited.</li>
  </ul>

  <h5>How We Use Your Information</h5>
  <ul>
    <li>To process and fulfill your orders.</li>
    <li>To communicate with you regarding your account and orders.</li>
    <li>To improve our website and services based on user feedback and usage patterns.</li>
    <li>To send promotional communications, if you have opted in.</li>
  </ul>

  <h5>Sharing Your Information</h5>
  <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
  <ul>
    <li>Service Providers: Trusted third-party vendors who assist with payment processing, order fulfillment, and delivery.</li>
    <li>Legal Authorities: When required by law or to protect our rights.</li>
  </ul>

  <h5>Data Security</h5>
  <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no online platform can guarantee complete security.</p>

  <h5>Your Rights</h5>
  <ul>
    <li>You have the right to access the personal information we hold about you.</li>
    <li>You may request correction of any inaccuracies in your information.</li>
    <li>You may request deletion of your personal information, subject to legal obligations.</li>
  </ul>

  <h5>Cookies and Tracking Technologies</h5>
  <p>We use cookies and similar technologies to enhance your browsing experience. You can manage your cookie preferences through your browser settings.</p>

  <h5>Third-Party Links</h5>
  <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices of these sites. We encourage you to read their privacy policies.</p>

  <h5>Changes to This Privacy Policy</h5>
  <p>We may update this policy from time to time. Changes will be posted on our website, and your continued use constitutes acceptance of the new terms.</p>

  <h5>Contact Us</h5>
  <p>If you have any questions or concerns about this Privacy Policy, please contact us at Jasfruitsandvegetables@gmail.com.</p>
</div>

    </div>

  )
}

export default PrivacyPolicy
