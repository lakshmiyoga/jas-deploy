import React from 'react';
import MetaData from './MetaData';
import { useLocation } from 'react-router-dom';


const About = () => {
  const location = useLocation();
  // sessionStorage.setItem('redirectPath', location.pathname);
  return (
    <div>
      {/* <MetaData title={'About Us'} /> */}
      <MetaData
        title="About Us"
        description="Learn more about our mission, values, and commitment to providing the best products and services. Discover our story and what drives us to serve you better."
      />

      <div className="products_heading">About Us</div>

      <div className='about_container'>

        <div className='about_text'>
          {/* <h3>JAS FRUITS AND VEGETABLES</h3> */}
          <p>I’m Balasanthanam G., with over 18 years of expertise in the service industry, specializing in providing top-quality fruits and vegetables. Over the years, I’ve cultivated strong partnerships with more than 50 restaurant chains and 30 supermarkets, ensuring they consistently receive fresh, premium produce. Our dedication to quality, competitive pricing, and exceptional service has earned us a reputation for excellence.</p>

          <p> One of our standout clients, A2B (Adyar Ananda Bhavan), trusts us to meet their high standards, and we take great pride in delivering on that promise every day.</p>

          <p> At the heart of our business is a commitment to understanding and meeting the ever-changing needs of our clients. We focus on providing the best produce, fostering lasting partnerships built on trust, and ensuring our customers can always rely on us.</p>
          <br /><br />
          <h3>Introducing Jas Fruits and Vegetables</h3>
          <p>We are thrilled to announce our expansion into the online retail space, bringing the freshest fruits and vegetables straight to your doorstep at unbeatable prices. At JAS Fruits and Vegetables, we are committed to provide top-quality produce with the ease and convenience of direct delivery, ensuring that freshness and affordability go hand in hand.</p>

          <p>Our motto, “Best Price, Best Savings,” embodies our promise to offer competitive pricing without ever compromising on quality. We believe everyone deserves access to fresh, healthy food, and we’re here to make that a reality—affordable, accessible, and delivered to you.</p>
          <br /><br />
          {/* RVP Sourcing is a wholesale trader established in 2014. We are wholesale trading in Vegetables and Fruits. */}

        </div>
        <div className='about_image'>
          <img src="./images/all.jpg" alt="Fruits and Vegetables" />
        </div>
      </div>
    </div>
  )
}

export default About;
