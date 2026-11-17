import React, { useState, useEffect } from 'react';
import { staffService } from '../services/staff';
import '../styles/global.css';

const StaffDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStaffData();
    }, []);

    const fetchStaffData = async () => {
        try {
            setLoading(true);
            const [tasksData, ridesData] = await Promise.all([
                staffService.getTasks(),
                staffService.getActiveRides()
            ]);
            
            setTasks(tasksData);
            setRides(ridesData);
        } catch (error) {
            console.error('Error fetching staff data:', error);
            setError('Failed to load staff data');
        } finally {
            setLoading(false);
        }
    };

    const handleTaskUpdate = async (taskId, newStatus) => {
        try {
            await staffService.updateTask(taskId, newStatus);
            alert('Task updated successfully');
            fetchStaffData(); // Refresh data
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
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
        <div className="dashboard staff-dashboard">
            <header className="dashboard-header">
                <h1>👨‍💼 Staff Dashboard</h1>
                <div>
                    <span style={{marginRight: '15px', color: '#666'}}>
                        Welcome, {localStorage.getItem('user_name') || 'Staff Member'}
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
                    <h3>Pending Tasks</h3>
                    <p>{tasks.filter(task => task.status === 'pending').length}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Rides</h3>
                    <p>{rides.filter(ride => ride.status === 'active').length}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Today</h3>
                    <p>{tasks.filter(task => task.status === 'completed').length}</p>
                </div>
                <div className="stat-card">
                    <h3>Support Tickets</h3>
                    <p>{tasks.filter(task => task.type === 'support').length}</p>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '30px'}}>
                <div className="content-section">
                    <h2>📋 Task Management</h2>
                    <div className="scrollable-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>Description</th>
                                    <th>Type</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length > 0 ? (
                                    tasks.map(task => (
                                        <tr key={task.id}>
                                            <td>#{task.id}</td>
                                            <td>{task.description}</td>
                                            <td>
                                                <span style={{
                                                    textTransform: 'capitalize',
                                                    fontWeight: '500'
                                                }}>
                                                    {task.type}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    color: task.priority === 'high' ? '#dc3545' : 
                                                           task.priority === 'medium' ? '#ffc107' : '#28a745',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td>
                                                <span style={{
                                                    color: task.status === 'completed' ? '#28a745' : 
                                                           task.status === 'in_progress' ? '#007bff' : '#6c757d',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>
                                                <select 
                                                    value={task.status}
                                                    onChange={(e) => handleTaskUpdate(task.id, e.target.value)}
                                                    style={{padding: '5px', borderRadius: '3px', border: '1px solid #ddd'}}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                                            No tasks assigned
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="content-section">
                    <h2>🚗 Active Rides</h2>
                    <div className="rides-list">
                        {rides.length > 0 ? (
                            rides.map(ride => (
                                <div key={ride.id} className="ride-card">
                                    <h4>Ride #{ride.id}</h4>
                                    <p><strong>Customer:</strong> {ride.customer_name}</p>
                                    <p><strong>Driver:</strong> {ride.driver_name || 'Not assigned'}</p>
                                    <p><strong>Location:</strong> {ride.current_location}</p>
                                    <p><strong>Vehicle:</strong> {ride.vehicle_type}</p>
                                    <p>
                                        <strong>Status:</strong> 
                                        <span style={{
                                            color: ride.status === 'completed' ? '#28a745' : 
                                                   ride.status === 'cancelled' ? '#dc3545' : 
                                                   ride.status === 'active' ? '#007bff' : '#ffc107',
                                            fontWeight: 'bold',
                                            marginLeft: '5px',
                                            textTransform: 'capitalize'
                                        }}>
                                            {ride.status}
                                        </span>
                                    </p>
                                    <button style={{marginTop: '10px', background: '#007bff', color: 'white'}}>
                                        View Details
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                                No active rides
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="content-section" style={{margin: '30px'}}>
                <h2>Quick Actions</h2>
                <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap'}}>
                    <button style={{padding: '12px 20px', background: '#007bff', color: 'white'}}>
                        Manage Drivers
                    </button>
                    <button style={{padding: '12px 20px', background: '#28a745', color: 'white'}}>
                        View Reports
                    </button>
                    <button style={{padding: '12px 20px', background: '#ffc107', color: 'black'}}>
                        Customer Support
                    </button>
                    <button style={{padding: '12px 20px', background: '#6c757d', color: 'white'}}>
                        System Logs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;