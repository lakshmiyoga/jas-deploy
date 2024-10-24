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
          <p>I am Balasanthanam G., and I have over 10 years of experience in the service industry, specializing in the supply of high-quality fruits and vegetables. Throughout my journey, I have built strong relationships with more than 50 restaurant chains and 30 supermarkets, ensuring they receive fresh and reliable produce. Our commitment to quality, competitive pricing, and exceptional service has earned us a reputation for excellence. A2B (Adyar Ananda Bhavan) is one of our key clients, and we take pride in maintaining the high standards they expect.
            At our core, we are dedicated to meeting the evolving needs of our clients, consistently delivering the best produce, and fostering long-term partnerships based on trust and reliability.
            <br /><br />
            <h3>Introducing Jas Fruits and Vegetables</h3>
            We are excited to expand into the online retail space, focusing on delivering fresh fruits and vegetables directly to customers at the best prices. At Jas Fruits and Vegetables, our mission is to provide high-quality produce with the convenience of direct delivery, ensuring both affordability and freshness.

            Our motto, “Best Price and Best Saving,” reflects our commitment to offering competitive prices while helping our customers save without compromising on quality. We are dedicated to making healthy, fresh food accessible and affordable for everyone.
            <br /><br />
            {/* RVP Sourcing is a wholesale trader established in 2014. We are wholesale trading in Vegetables and Fruits. */}
          </p>
        </div>
        <div className='about_image'>
          <img src="./images/all.jpg" alt="Fruits and Vegetables" />
        </div>
      </div>
    </div>
  )
}

export default About;
