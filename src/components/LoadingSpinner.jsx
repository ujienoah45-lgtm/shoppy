import './LoadingSpinner.css';

const LoadingSpinner = ({ fullPage = false }) => {
    return (
        <div className={`spinner-container ${fullPage ? 'full-page' : ''}`}>
            <div className="spinner">
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
                <div className="spinner-dot"></div>
            </div>
            <p className="loading-text">Loading Shoppy...</p>
        </div>
    );
};

export default LoadingSpinner;
