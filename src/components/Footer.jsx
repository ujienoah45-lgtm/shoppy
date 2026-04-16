import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>LET US HELP YOU</h4>
            <ul>
              <li><Link className="footer-link" to="/help-center">Help Center</Link></li>
              <li><Link className="footer-link" to="/how-to-shop">How to Shop on Shoppy</Link></li>
              <li><Link className="footer-link" to="/delivery-options">Delivery Options and Timelines</Link></li>
              <li><Link className="footer-link" to="/returns">How to Return a Product</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>ABOUT SHOPPY</h4>
            <ul>
              <li><Link className="footer-link" to="/about-us">About Us</Link></li>
              <li><Link className="footer-link" to="/careers">Shoppy Careers</Link></li>
              <li><Link className="footer-link" to="/shoppy-express">Shoppy Express</Link></li>
              <li><Link className="footer-link" to="/terms-and-conditions">Terms and Conditions</Link></li>
              <li><Link className="footer-link" to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="footer-link" to="/cookie-policy">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>CONTACT US</h4>
            <p className="contact-info">Email: support@shoppy.com</p>
            <p className="contact-info">Phone: +234 800 SHOPPY</p>
            <p className="contact-info">Address: 45 Fashion Avenue, Lagos</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">Facebook</a>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="Instagram">Instagram</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>PAYMENT METHODS</h4>
            <div className="payment-icons">
              <span title="Visa">Visa</span>
              <span title="Mastercard">Mastercard</span>
              <span title="Bank Transfer">Transfer</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Shoppy. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
