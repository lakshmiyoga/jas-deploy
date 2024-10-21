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
      <div className="terms_container">
        <h3>Terms And Conditions</h3>
        <h5>Personal Information</h5>
        <p>“RVP Sourcing” is the licensed owner for RVP Sourcing Online and the company respects your privacy. This Privacy Policy provides succinctly the manner your data is collected and used by RVP Sourcing Online on the Site. As a visitor to the Site/ Customer you are advised to please read the Privacy Policy carefully. By accessing the services provided by the Site you agree to the collection and use of your data by RVP Sourcing Online in the manner provided in this Privacy Policy.</p>

        <h5>Services overview</h5>
        <p>As part of the registration process on the Site, RVP Sourcing Online may collect the following personally identifiable information about you: Name including first and last name, alternate email address, mobile phone number and contact details, Postal code, Demographic profile (like your age, gender, occupation, education, address etc.) and information about the pages on the site you visit/access, the links you click on the site, the number of times you access the page and any such browsing information.</p>

        <h5>Eligibility</h5>
        <p>Services of the Site would be available to only select geographies in Chennai. Persons who are "incompetent to contract" within the meaning of the Indian Contract Act, 1872 including un-discharged insolvents etc. are not eligible to use the Site. If you are a minor i.e. under the age of 18 years but at least 13 years of age you may use the Site only under the supervision of a parent or legal guardian who agrees to be bound by these Terms of Use. If your age is below 18 years your parents or legal guardians can transact on behalf of you if they are registered users. You are prohibited from purchasing any material which is for adult consumption and the sale of which to minors is prohibited.</p>

        <h5>License & Site access</h5>
        <p>RVP Sourcing Online grants you a limited sub-license to access and make personal use of this site and not to download (other than page caching) or modify it, or any portion of it, except with express written consent of RVP Sourcing Online. This license does not include any resale or commercial use of this site or its contents; any collection and use of any product listings, descriptions, or prices; any derivative use of this site or its contents; any downloading or copying of account information for the benefit of another merchant; or any use of data mining, robots, or similar data gathering and extraction tools. This site or any portion of this site may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without express written consent of RVP Sourcing Online. You may not frame or utilize framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of the Site or of RVP Sourcing Online and its affiliates without express written consent. You may not use any meta tags or any other "hidden text" utilizing the Site’s or name or trademarks without the express written consent of RVP Sourcing Online. Any unauthorized use terminates the permission or license granted by RVP Sourcing Online.</p>

        <h5>Account & Registration Obligations</h5>
        <p>All shoppers have to register and login for placing orders on the Site. You have to keep your account and registration details current and correct for communications related to your purchases from the site. By agreeing to the terms and conditions, the shopper agrees to receive promotional communication and newsletters upon registration. The customer can opt out either by unsubscribing in "My Account" or by contacting the customer service.</p>

        <h5>Pricing</h5>
        <p>All the products listed on the Site will be sold with unique price tag which is considerably cheaper than MRP. The prices mentioned at the time of ordering will be the prices charged on the date of the delivery. Although prices of most of the products do not fluctuate on a daily basis but some of the commodities and fresh food prices do change on a daily basis. In case the prices are higher or lower on the date of delivery not additional charges will be collected or refunded as the case may be at the time of the delivery of the order.</p>

        <h5>Cancellation by Site / Customer</h5>
        <p>You as a customer can cancel your order anytime up to the cut-off time of the slot for which you have placed an order by calling our customer service. In such a case we will refund any payments already made by you for the order. If we suspect any fraudulent transaction by any customer or any transaction which defies the terms & conditions of using the website, we at our sole discretion could cancel such orders. We will maintain a negative list of all fraudulent transactions and customers and would deny access to them or cancel any orders placed by them.</p>

        <h5>Return & Refunds</h5>
        <p>We have a "no questions asked return and refund policy" which entitles all our members to return the product at the time of delivery if due to some reason they are not satisfied with the quality or freshness of the product. We will take the returned product back with us and issue a credit note for the value of the return products which will be credited to your account on the Site. This can be used to pay your subsequent shopping bills.</p>

        <h5>You Agree and Confirm</h5>
        <p>That in the event that a non-delivery occurs on account of a mistake by you (i.e. wrong name or address or any other wrong information) any extra cost incurred by RVP Sourcing Online for redelivery shall be claimed from you.
          That you will use the services provided by the Site, its affiliates, consultants and contracted companies, for lawful purposes only and comply with all applicable laws and regulations while using and transacting on the Site.
          You will provide authentic and true information in all instances where such information is requested of you. RVP Sourcing Online reserves the right to confirm and validate the information and other details provided by you at any point of time. If upon confirmation your details are found not to be true (wholly or partly), it has the right in its sole discretion to reject the registration and debar you from using the Services and / or other affiliated websites without prior intimation whatsoever.
          That you are accessing the services available on this Site and transacting at your sole risk and are using your best and prudent judgment before entering into any transaction through this Site.
          That the address at which delivery of the product ordered by you is to be made will be correct and proper in all respects.
          That before placing an order you will check the product description carefully. By placing an order for a product you agree to be bound by the conditions of sale included in the item's description.
          You may not use the Site for any of the following purposes:
          Disseminating any unlawful, harassing, libelous, abusive, threatening, harmful, vulgar, obscene, or otherwise objectionable material.
          Transmitting material that encourages conduct that constitutes a criminal offence or results in civil liability or otherwise breaches any relevant laws, regulations or code of practice.
          Gaining unauthorized access to other computer systems.
          Interfering with any other person's use or enjoyment of the Site.
          Breaching any applicable laws;
          Interfering or disrupting networks or web sites connected to the Site.
          Making, transmitting or storing electronic copies of materials protected by copyright without the permission of the owner.</p>

        <h5>Colors</h5>
        <p>We have made every effort to display the colors of our products that appear on the Website as accurately as possible. However, as the actual colors you see will depend on your monitor, we cannot guarantee that your monitor's display of any color will be accurate.</p>

        <h5>Modification of Terms & Conditions of Service</h5>
        <p>RVP Sourcing Online may at any time modify the Terms & Conditions of Use of the Website without any prior notification to you. You can access the latest version of these Terms & Conditions at any given time on the Site. You should regularly review the Terms & Conditions on the Site. In the event the modified Terms & Conditions is not acceptable to you, you should discontinue using the Service. However, if you continue to use the Service you shall be deemed to have agreed to accept and abide by the modified Terms & Conditions of Use of this Site.</p>

        <h5>Governing Law and Jurisdiction</h5>
        <p>This User Agreement shall be constructed in accordance with the applicable laws of India. The Courts at Chennai shall have exclusive jurisdiction in any proceedings arising out of this agreement. Any dispute or difference either in interpretation or otherwise, of any terms of this User Agreement between the parties hereto, the same shall be referred to an independent arbitrator who will be appointed by RVP Sourcing Online and his decision shall be final and binding on the parties hereto. The above arbitration shall be in accordance with the Arbitration and Conciliation Act, 1996 as amended from time to time. The arbitration shall be held in Chennai. The High Court of judicature at Chennai alone shall have the jurisdiction and the Laws of India shall apply.</p>

        <h5>Reviews, Feedback, Submissions</h5>
        <p>All reviews, comments, feedback, postcards, suggestions, ideas, and other submissions disclosed, submitted or offered to the Site on or by this Site or otherwise disclosed, submitted or offered in connection with your use of this Site (collectively, the "Comments") shall be and remain the property of RVP Sourcing Online. Such disclosure, submission or offer of any Comments shall constitute an assignment to RVP Sourcing Online of all worldwide rights, titles and interests in all copyrights and other intellectual properties in the Comments. Thus, RVP Sourcing Online owns exclusively all such rights, titles and interests and shall not be limited in any way in its use, commercial or otherwise, of any Comments. RVP Sourcing Online will be entitled to use, reproduce, disclose, modify, adapt, create derivative works from, publish, display and distribute any Comments you submit for any purpose whatsoever, without restriction and without compensating you in any way. RVP Sourcing Online is and shall be under no obligation (1) to maintain any Comments in confidence; (2) to pay you any compensation for any Comments; or (3) to respond to any Comments. You agree that any Comments submitted by you to the Site will not violate this policy or any right of any third party, including copyright, trademark, privacy or other personal or proprietary right(s), and will not cause injury to any person or entity. You further agree that no Comments submitted by you to the Website will be or contain libelous or otherwise unlawful, threatening, abusive or obscene material, or contain software viruses, political campaigning, commercial solicitation, chain letters, mass mailings or any form of "spam". RVP Sourcing Online does not regularly review posted Comments, but does reserve the right (but not the obligation) to monitor and edit or remove any Comments submitted to the Site. You grant RVP Sourcing Online the right to use the name that you submit in connection with any Comments. You agree not to use a false email address, impersonate any person or entity, or otherwise mislead as to the origin of any Comments you submit. You are and shall remain solely responsible for the content of any Comments you make and you agree to indentify RVP Sourcing Online and its affiliates for all claims resulting from any Comments you submit. RVP Sourcing Online and its affiliates take no responsibility and assume no liability for any Comments submitted by you or any third party.</p>

        <h5>Objectionable Material</h5>
        <p>You understand that by using this Site or any services provided on the Site, you may encounter Content that may be deemed by some to be offensive, indecent, or objectionable, which Content may or may not be identified as such. You agree to use the Site and any service at your sole risk and that to the fullest extent permitted under applicable law, RVP Sourcing Online and its affiliates shall have no liability to you for Content that may be deemed offensive, indecent, or objectionable to you.</p>

        <h5>Termination</h5>
        <p>This User Agreement is effective unless and until terminated by either you or RVP Sourcing Online. You may terminate this User Agreement at any time, provided that you discontinue any further use of this Site. RVP Sourcing Online may terminate this User Agreement at any time and may do so immediately without notice, and accordingly deny you access to the Site, Such termination will be without any liability to RVP Sourcing Online. Upon any termination of the User Agreement by either you or RVP Sourcing Online, you must promptly destroy all materials downloaded or otherwise obtained from this Site, as well as all copies of such materials, whether made under the User Agreement or otherwise. RVP Sourcing’s right to any Comments shall survive any termination of this User Agreement. Any such termination of the User Agreement shall not cancel your obligation to pay for the product already ordered from the Website or affect any liability that may have arisen under the User Agreement.</p>



      </div>
    </div>

  )
}

export default TermsAndConditions
