import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './EditProfileView.css';

export default function EditProfileView() {
    const { user, login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('image', file);

        setIsUploading(true);
        try {
            const res = await fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setAvatarUrl(data.imageUrl);
                addToast("Image uploaded successfully!", "success");
            } else {
                addToast("Failed to upload image. Please try again.", "error");
            }
        } catch (err) {
            console.error(err);
            addToast("An error occurred during upload.", "error");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if they only filled half the password fields
        if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
            return addToast("To change your password, provide both old and new passwords.", "error");
        }

        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5001/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    oldPassword,
                    newPassword,
                    avatarUrl
                })
            });

            if (res.ok) {
                const data = await res.json();
                addToast("Profile updated successfully!", "success");
                // Update local auth context
                if (user) {
                    login({ ...user, avatarUrl: data.user.avatarUrl });
                }
                navigate('/profile');
            } else {
                addToast("Failed to update profile.", "error");
            }
        } catch (err: any) {
            console.error(err);
            addToast("Network Error: Could not reach the server.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="edit-profile-page">
            <button className="back-btn" onClick={() => navigate('/profile')}>&larr; Back to Profile</button>
            <h2>Edit Profile</h2>

            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label>Avatar URL</label>
                    <div className="avatar-preview">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Preview" onError={(e) => { e.currentTarget.src = ''; e.currentTarget.className = 'fallback'; }} />
                        ) : (
                            <div className="fallback">{user?.username.charAt(0).toUpperCase()}</div>
                        )}
                        <div className="upload-controls" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="file-input"
                                style={{ padding: '0.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--border-radius-sm)', cursor: 'pointer', background: 'var(--bg-body)' }}
                            />
                            {isUploading && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploading...</span>}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Old Password</label>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                    />
                </div>

                <button type="submit" className="primary-btn" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
