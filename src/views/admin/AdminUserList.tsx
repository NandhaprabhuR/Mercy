import { useState, useEffect } from 'react';

// Normally fetch from backend, but simulating based on our mocked Auth backend
const MOCK_USERS = [
    { id: 'u-1', username: 'admin', role: 'ADMIN', lastLogin: '10 mins ago' },
    { id: 'u-2', username: 'john', role: 'CONSUMER', lastLogin: '2 days ago' },
    { id: 'u-3', username: 'sarah_fitness', role: 'CONSUMER', lastLogin: 'Just now' }
];

export default function AdminUserList() {
    const [users, setUsers] = useState(MOCK_USERS);

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
                                    <button className="action-btn edit">View Profile</button>
                                    {u.role !== 'ADMIN' && <button className="action-btn delete">Ban</button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
