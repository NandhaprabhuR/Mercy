import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';

// Normally fetch from backend, but simulating based on our mocked Auth backend
const MOCK_USERS = [
    { id: 'u-1', username: 'admin', role: 'ADMIN', lastLogin: '10 mins ago' },
    { id: 'u-2', username: 'john', role: 'CONSUMER', lastLogin: '2 days ago' },
    { id: 'u-3', username: 'sarah_fitness', role: 'CONSUMER', lastLogin: 'Just now' }
];

interface UserNode {
    id: string;
    username: string;
    role: string;
    lastLogin: string;
    avatarUrl?: string;
}

export default function AdminUserList() {
    const [users, setUsers] = useState<UserNode[]>(MOCK_USERS);
    const [selectedUser, setSelectedUser] = useState<UserNode | null>(null);
    const [showBanConfirm, setShowBanConfirm] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/auth/users`)
            .then(res => res.json())
            .then((data: { id: string; username: string; role: string; avatarUrl?: string }[]) => {
                const mappedUsers = data.map(u => ({
                    id: u.id,
                    username: u.username,
                    role: u.role,
                    avatarUrl: u.avatarUrl,
                    lastLogin: 'Active recently' // We do not have a real lastLogin field in the schema
                }));
                setUsers(mappedUsers);
            })
            .catch(err => console.error(err));
    }, []);

    const closeModal = () => {
        setSelectedUser(null);
        setShowBanConfirm(false);
    };

    const handleBan = () => {
        if (selectedUser) {
            setUsers(users.filter(u => u.id !== selectedUser.id));
            closeModal();
            // Here you would also call a backend endpoint to actually ban the user
        }
    };

    return (
        <div className="admin-products">
            <div className="admin-header-actions">
                <h2>User Management</h2>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Photo</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="font-medium text-muted">{u.id}</td>
                                <td>
                                    {u.avatarUrl ? (
                                        <img src={u.avatarUrl} alt={u.username} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>👤</span>
                                        </div>
                                    )}
                                </td>
                                <td className="font-medium">{u.username}</td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        backgroundColor: u.role === 'ADMIN' ? 'var(--neon-green)' : 'var(--bg-body)',
                                        color: u.role === 'ADMIN' ? 'var(--bg-darker-green)' : 'var(--text-muted)'
                                    }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>{u.lastLogin}</td>
                                <td>
                                    <button
                                        className="action-btn edit"
                                        onClick={() => setSelectedUser(u)}
                                    >
                                        View Profile
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>User Profile: {selectedUser.username}</h3>

                        <div className="user-details-grid">
                            <p><strong>ID:</strong> {selectedUser.id}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Last Active:</strong> {selectedUser.lastLogin}</p>
                        </div>

                        {!showBanConfirm ? (
                            <div className="admin-modal-actions" style={{ justifyContent: 'space-between', marginTop: '1.5rem' }}>
                                {selectedUser.role !== 'ADMIN' ? (
                                    <button className="delete-btn" onClick={() => setShowBanConfirm(true)}>Ban User</button>
                                ) : (
                                    <span className="text-muted" style={{ display: 'flex', alignItems: 'center' }}>Admins cannot be banned.</span>
                                )}
                                <button className="cancel-btn" onClick={closeModal}>Close</button>
                            </div>
                        ) : (
                            <div className="ban-confirmation" style={{ background: '#fff8f8', padding: '1rem', border: '1px solid #ffcccc', borderRadius: '4px', marginTop: '1.5rem' }}>
                                <p style={{ color: '#c0392b', marginBottom: '1rem', fontWeight: 600 }}>Are you absolutely sure you want to ban {selectedUser.username}? This action is irreversible.</p>
                                <div className="admin-modal-actions">
                                    <button className="cancel-btn" onClick={() => setShowBanConfirm(false)}>Cancel</button>
                                    <button className="confirm-btn" style={{ backgroundColor: '#d9534f', color: '#fff' }} onClick={handleBan}>Yes, Ban User</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
