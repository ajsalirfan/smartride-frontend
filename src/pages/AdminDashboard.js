import React, { useState, useEffect } from 'react';
import { adminService } from '../services/admin';
import '../styles/global.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, usersData] = await Promise.all([
                adminService.getStats(),
                adminService.getUsers()
            ]);
            
            setStats(statsData);
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (userId, action, userData = null) => {
        try {
            if (action === 'edit' && userData) {
                await adminService.updateUser(userId, userData);
                alert('User updated successfully');
                fetchDashboardData(); // Refresh data
            } else if (action === 'delete') {
                if (window.confirm('Are you sure you want to delete this user?')) {
                    await adminService.deleteUser(userId);
                    alert('User deleted successfully');
                    fetchDashboardData(); // Refresh data
                }
            }
        } catch (error) {
            console.error('Error performing user action:', error);
            alert('Action failed. Please try again.');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="dashboard" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <div className="loading"></div>
            </div>
        );
    }

    return (
        <div className="dashboard admin-dashboard">
            <header className="dashboard-header">
                <h1>👑 Admin Dashboard</h1>
                <div>
                    <span style={{marginRight: '15px', color: '#666'}}>
                        Welcome, {localStorage.getItem('user_name') || 'Admin'}
                    </span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>

            {error && (
                <div style={{
                    background: '#fee',
                    color: '#c33',
                    padding: '15px',
                    margin: '20px 30px',
                    borderRadius: '5px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p>{stats.total_users?.toLocaleString() || '0'}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Rides</h3>
                    <p>{stats.active_rides || '0'}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>${stats.total_revenue?.toLocaleString() || '0'}</p>
                </div>
                <div className="stat-card">
                    <h3>Staff Members</h3>
                    <p>{stats.staff_members || '0'}</p>
                </div>
            </div>

            <div className="content-section">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                    <h2>User Management</h2>
                    <button 
                        style={{padding: '10px 20px', background: '#28a745', color: 'white'}}
                        onClick={() => alert('Add user functionality to be implemented')}
                    >
                        + Add User
                    </button>
                </div>
                <div className="scrollable-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>User Type</th>
                                <th>Status</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name || user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                background: user.user_type === 'admin' ? '#dc3545' : 
                                                           user.user_type === 'staff' ? '#ffc107' : '#007bff',
                                                color: user.user_type === 'staff' ? 'black' : 'white'
                                            }}>
                                                {user.user_type?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                color: user.is_active ? '#28a745' : '#dc3545',
                                                fontWeight: 'bold'
                                            }}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleUserAction(user.id, 'edit', user)}
                                                style={{background: '#007bff'}}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleUserAction(user.id, 'delete')}
                                                style={{background: '#dc3545'}}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{textAlign: 'center', padding: '20px'}}>
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="content-section">
                <h2>Quick Actions</h2>
                <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                    <button style={{padding: '12px 20px', background: '#007bff', color: 'white'}}>
                        View Reports
                    </button>
                    <button style={{padding: '12px 20px', background: '#28a745', color: 'white'}}>
                        Manage System Settings
                    </button>
                    <button style={{padding: '12px 20px', background: '#ffc107', color: 'black'}}>
                        Backup Database
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;