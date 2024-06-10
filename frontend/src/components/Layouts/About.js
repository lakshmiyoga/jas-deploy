import React from 'react';
import MetaData from './MetaData';


const About = () => {
  return (
    <div>
      <MetaData title={'Buy Best Products'} />
      <div className="products_heading">About Us</div>
      
      <div className='about_container'>
        
        <div className='about_text'>
        <h3>JAS FRUITS AND VEGETABLES</h3>
          <p>Jas fruits and vegetables which is a part of RVP Sourcing have started in the Retail market online. This one is selling vegetables, fruits and Lettuce through an online portal and a mobile application.
            <br /><br />
            Our aim is to make vegetables, fruits and lettuce available to our customer at affordable prices. We think we can make this possible. Because RVP Sourcing is a wholesaler, we have all kinds of vegetables and fruits that are fresh and nutritious so that we can offer the best to our customers.
            <br /><br />
            RVP Sourcing is a wholesale trader established in 2014. We are wholesale trading in Vegetables and Fruits.
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
