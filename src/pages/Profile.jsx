import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import './Signup.css';
import { updateMe } from '../Utils/user';

function Profile() {
    const { auth, saveLogin } = useUser();
    const [formData, setFormData] = useState({
        name: auth.userObj?.name || '',
        email: auth.userObj?.email || '',
        phone: auth.userObj?.phone || '',
        address: auth.userObj?.address || '',
    });


    const [isEditing, setIsEditing] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await updateMe(formData);
            saveLogin(formData); // Update user state
            setIsEditing(false);
            toast.success('Profile updated successfully!');

        } catch (error) {
            toast.error("Could not update profile, please check your internet connection and try again");
        };
    };

    if (!auth.userObj) {
        return (
            <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
                <h2>Please log in to view your profile.</h2>
            </div>
        );
    }

    return (
        <div className="signup-page">
            <div className="container">
                <div className="signup-container">
                    <h2>My Profile</h2>
                    <p className="signup-subtitle">Manage your personal information</p>

                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Delivery Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                rows="3"
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                required
                            />
                        </div>

                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="signup-btn">Save Changes</button>
                                <button type="button" className="signup-btn" style={{ background: '#666' }} onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        ) : (
                            <button type="button" className="signup-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;
