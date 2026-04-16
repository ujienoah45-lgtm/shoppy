import { Link, useLocation } from 'react-router-dom';
import './InfoPage.css';

const pages = {
  '/help-center': {
    title: 'Help Center',
    description: 'Find quick answers to common questions about orders, payments, and your account.',
    points: ['Track your orders from your profile dashboard.', 'Contact support for delayed orders and payment issues.', 'Use secure checkout for cards and bank transfer.'],
  },
  '/how-to-shop': {
    title: 'How to Shop on Shoppy',
    description: 'Browse products, add to cart, review your order, and complete checkout in minutes.',
    points: ['Use the search bar to quickly find items.', 'Select quantity in cart before checkout.', 'Review delivery and payment details before placing an order.'],
  },
  '/delivery-options': {
    title: 'Delivery Options and Timelines',
    description: 'Choose standard or express delivery based on your location and urgency.',
    points: ['Lagos: 1-2 business days.', 'Outside Lagos: 2-5 business days.', 'Express delivery is available for select locations.'],
  },
  '/returns': {
    title: 'Returns and Refunds',
    description: 'Items can be returned within the allowed return window if they are unused and in original condition.',
    points: ['Start a return request from your order history.', 'Package must include original tags and receipt.', 'Refunds are processed after return inspection.'],
  },
  '/about-us': {
    title: 'About Shoppy',
    description: 'Shoppy is an ecommerce platform focused on quality products, fast delivery, and smooth checkout.',
    points: ['Curated product catalog.', 'Secure payment options.', 'Customer-first support experience.'],
  },
  '/careers': {
    title: 'Shoppy Careers',
    description: 'Join our team to build products and experiences used by thousands of shoppers.',
    points: ['Roles in engineering, product, and operations.', 'Remote-friendly collaboration.', 'Growth-focused culture.'],
  },
  '/shoppy-express': {
    title: 'Shoppy Express',
    description: 'Shoppy Express gives priority processing and faster shipping for selected orders.',
    points: ['Priority packing and dispatch.', 'Faster last-mile delivery.', 'Available for selected products and locations.'],
  },
  '/terms-and-conditions': {
    title: 'Terms and Conditions',
    description: 'Review your rights and responsibilities when using the Shoppy platform.',
    points: ['Account and order usage policies.', 'Payment and refund conditions.', 'Platform and service limitations.'],
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description: 'We explain how your personal data is collected, used, and protected.',
    points: ['Data collection for account and order fulfillment.', 'Security measures for sensitive information.', 'Your rights to update or remove account data.'],
  },
  '/cookie-policy': {
    title: 'Cookie Policy',
    description: 'Cookies help us improve performance, remember preferences, and personalize content.',
    points: ['Essential cookies keep the platform functional.', 'Analytics cookies improve product experience.', 'You can control cookie preferences in your browser.'],
  },
};

function InfoPage() {
  const location = useLocation();
  const page = pages[location.pathname];

  if (!page) return null;

  return (
    <div className="info-page">
      <div className="container info-page-content">
        <h2>{page.title}</h2>
        <p>{page.description}</p>
        <ul>
          {page.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <Link to="/" className="info-home-link">Back to Home</Link>
      </div>
    </div>
  );
}

export default InfoPage;
