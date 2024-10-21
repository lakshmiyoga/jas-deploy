import React from 'react';
import MetaData from './MetaData';
import { useLocation } from 'react-router-dom';


const RefundPolicy = () => {
  const location = useLocation();
  sessionStorage.setItem('redirectPath', location.pathname);
  return (

    <div>
      {/* <MetaData title={'Privacy Policy'} /> */}
      <MetaData
        title="Refund Policy"
        description="Read our refund policy to learn about the conditions and process for requesting refunds on your purchases. We strive to provide a hassle-free experience."
      />

      <div className="products_heading">Refund Policy</div>
      <div className="refund-policy-container">
        <h3>Refund Policy</h3>
        <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.</p>
        <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
        <p>Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases.</p>

        <h6>Additional non-returnable items:</h6>
        <ul>
          <li>Gift cards</li>
          <li>Some health and personal care items</li>
        </ul>

        <p>To complete your return, we require a receipt or proof of purchase. Please do not send your purchase back to the manufacturer.</p>

        <h6>There are certain situations where only partial refunds are granted: (if applicable)</h6>
        <ul>
          <li>Any item not in its original condition, is damaged or missing parts for reasons not due to our error.</li>
          <li>Any item that is returned more than 30 days after delivery</li>
        </ul>

        <h5>Refunds (if applicable)</h5>
        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>

        <h5>Late or missing refunds (if applicable)</h5>
        <p>If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted. If you’ve done all of this and you still have not received your refund yet, please contact us at info@rvpsourcing.firm.in.</p>

        <h5>Sale items (if applicable)</h5>
        <p>Only regular priced items may be refunded, unfortunately sale items cannot be refunded.</p>

        <h5>Exchanges (if applicable)</h5>
        <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at info@rvpsourcing.firm.in</p>

        <h5>Shipping</h5>
        <p>To return your product, you should mail your product to: RVP Sourcing</p>
        <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
        <p>Depending on where you live, the time it may take for your exchanged product to reach you, may vary. If you are shipping an item over ₹ 1000, you should consider using a trackable shipping service or purchasing shipping insurance. We don’t guarantee that we will receive your returned item.</p>
      </div>
    </div>
  );
};

export default RefundPolicy;
