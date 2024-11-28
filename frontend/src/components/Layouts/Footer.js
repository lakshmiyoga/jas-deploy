import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Footer = ({ openSide, setOpenSide, onLoginClick}) => {

  const { isAuthenticated, user } = useSelector(state => state.authState);
  const { getcategory } = useSelector((state) => state.categoryState);

  const freshCategories = getcategory.filter((fresh)=> fresh.type === 'Fresh')
  const groceriesCategories = getcategory.filter((fresh)=> fresh.type === 'Groceries')

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Order Here</h4>
          <ul>
            {freshCategories?.map((categoryItem) => (
              <li key={categoryItem._id}>
                <Link
                  to={`/categories/${categoryItem.category}`}
                  className="unstyled-link"
                  state={{ category: categoryItem.category, type: categoryItem.type }}
                >
                  {categoryItem.category}
                </Link>
              </li>
            ))}
            {/* <li>
              
              <Link to='/vegetables' className="unstyled-link">
                Vegetables
              </Link>
            </li>
            <li>
              <Link to='/fruits' className="unstyled-link">
                Fruits
              </Link>
            </li>
            <li>
              <Link to='/keerai' className="unstyled-link">
                Keerai
              </Link>
            </li> */}

          </ul>
        </div>
        <div className="footer-section">
          <h4>Monthly Groceries</h4>
          <ul>
            {groceriesCategories?.map((categoryItem) => (
              <li key={categoryItem._id}>
                <Link
                  to={`/categories/${categoryItem.category}/type/${categoryItem.type}`}
                  className="unstyled-link"
                  state={{ category: categoryItem.category, type: categoryItem.type }}
                >
                  {categoryItem.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-section">
          <h4>Information</h4>
          <ul>
            <li>
              <Link to='/termsAndConditions' className="unstyled-link">
                Terms & Condition
              </Link>
            </li>
            <li>
              <Link to='/privacyPolicy' className="unstyled-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to='/refundPolicy' className="unstyled-link">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Other Links</h4>
          <ul>
            {
              !isAuthenticated && (
                <>
                  <li>
                    <Link className="unstyled-link" onClick={onLoginClick}>
                      Login
                    </Link>
                  </li>
                  {/* <li>
                    <Link to='/register' className="unstyled-link">
                      Register
                    </Link>
                  </li> */}
                </>
              )
            }

            <li>
              <Link to='/enquiry' className="unstyled-link">
                Enquiry
              </Link>
            </li>
            <li>
              <Link to='/about' className="unstyled-link">
                Aboutus
              </Link>
            </li>

          </ul>
        </div>
        <div className="footer-section">
          <h4>Get In Touch</h4>
          <ul>
            <li>29, Reddy St, Nerkundram, Chennai - 600107</li>
            <li>
              <a href="tel:+919176720068" class="contact-link">+91 91767 20068</a>
            </li>
            <li>
              <a href="mailto:jasfruitsandvegetables@gmail.com" class="contact-link">jasfruitsandvegetables@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2023 Copyright JAS Fruits and Vegetables. All Rights Reserved</p>
        {/* <p>Design and Developed by Chennai Notes</p> */}
      </div>
      <img src="/images/fruitbasket.png" alt="Fruit" className="footer-fruit-image-right" />
      <img src="/images/emoji.jpg" alt="emoji" className="footer-fruit-image-left" />
    </footer>
  );
};

export default Footer
