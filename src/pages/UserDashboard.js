import React, { useState, useEffect } from 'react';
import { userService } from '../services/user';
import { authService } from '../services/auth';  // Fixed import path
import '../styles/global.css';


const UserDashboard = () => {
    const [userData, setUserData] = useState({});
    const [rides, setRides] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [wallet, setWallet] = useState({ balance: 0 });
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingData, setBookingData] = useState({
        pickup_location: '',
        dropoff_location: '',
        vehicle_type: 'escooter'
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [profileData, ridesData, vehiclesData, walletData, statsData] = await Promise.all([
                userService.getProfile(),
                userService.getRideHistory(),
                userService.getAvailableVehicles(),
                userService.getWalletBalance(),
                userService.getRideStatistics()
            ]);
            
            setUserData(profileData);
            setRides(ridesData);
            setVehicles(vehiclesData);
            setWallet(walletData);
            setStats(statsData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleBookRide = async (e) => {
        e.preventDefault();
        try {
            // First find an available vehicle
            const availableVehicle = vehicles.find(v => v.status === 'available');
            if (!availableVehicle) {
                alert('No vehicles available at the moment');
                return;
            }

            // Start ride (you'll need QR code in real implementation)
            const rideData = {
                vehicle_id: availableVehicle.vehicle_id,
                qr_code: 'DEMO_QR_CODE', // In real app, scan QR code
                start_location_lat: 12.9716, // Current location
                start_location_lng: 77.5946,
                start_location_name: bookingData.pickup_location
            };

            await userService.startRide(rideData);
            alert('Ride started successfully!');
            setBookingData({
                pickup_location: '',
                dropoff_location: '',
                vehicle_type: 'escooter'
            });
            fetchUserData(); // Refresh to show new ride
        } catch (error) {
            console.error('Error booking ride:', error);
            alert('Failed to book ride. Please try again.');
        }
    };

    const handleEndRide = async () => {
        try {
            const currentRide = await userService.getCurrentRide();
            if (currentRide.active_ride) {
                const endData = {
                    ride_id: currentRide.id,
                    end_location_lat: 12.9716, // Current location
                    end_location_lng: 77.5946,
                    end_location_name: bookingData.dropoff_location || 'Destination'
                };

                await userService.endRide(endData);
                alert('Ride completed successfully!');
                fetchUserData(); // Refresh data
            }
        } catch (error) {
            console.error('Error ending ride:', error);
            alert('Failed to end ride.');
        }
    };

    const handleLogout = async () => {
        await authService.logout();
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
        <div className="dashboard user-dashboard">
            <header className="dashboard-header">
                <h1>🚗 Smart Ride - User Portal</h1>
                <div>
                    <span style={{marginRight: '15px', color: '#666'}}>
                        Welcome, {userData.username || userData.email}
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

            <div className="scrollable-content">
                {/* User Profile Section */}
                <section className="user-profile">
                    <h2>👤 Your Profile</h2>
                    <div className="profile-card">
                        <p><strong>Name:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Phone:</strong> {userData.phone_number || 'Not provided'}</p>
                        <p><strong>Wallet Balance:</strong> ₹{wallet.balance || '0.00'}</p>
                        <p><strong>Verification Status:</strong> 
                            <span style={{
                                color: userData.verification_status === 'approved' ? '#28a745' : 
                                       userData.verification_status === 'pending' ? '#ffc107' : '#dc3545',
                                fontWeight: 'bold',
                                marginLeft: '5px'
                            }}>
                                {userData.verification_status?.toUpperCase() || 'NOT VERIFIED'}
                            </span>
                        </p>
                    </div>
                </section>

                {/* Quick Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Rides</h3>
                        <p>{stats.total_rides || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Distance Covered</h3>
                        <p>{stats.total_distance ? `${stats.total_distance} km` : '0 km'}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Carbon Saved</h3>
                        <p>{stats.total_carbon_saved ? `${stats.total_carbon_saved} kg` : '0 kg'}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Spent</h3>
                        <p>₹{stats.total_spent || '0.00'}</p>
                    </div>
                </div>

                {/* Book Ride Section */}
                <section className="book-ride">
                    <h2>🎯 Book New Ride</h2>
                    <div style={{background: '#f8f9fa', padding: '25px', borderRadius: '10px', maxWidth: '500px'}}>
                        <form onSubmit={handleBookRide}>
                            <div style={{display: 'grid', gap: '15px'}}>
                                <div>
                                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                                        Pickup Location:
                                    </label>
                                    <input 
                                        type="text" 
                                        value={bookingData.pickup_location}
                                        onChange={(e) => setBookingData({...bookingData, pickup_location: e.target.value})}
                                        placeholder="Enter pickup address"
                                        style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px'}}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                                        Dropoff Location:
                                    </label>
                                    <input 
                                        type="text" 
                                        value={bookingData.dropoff_location}
                                        onChange={(e) => setBookingData({...bookingData, dropoff_location: e.target.value})}
                                        placeholder="Enter destination address"
                                        style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px'}}
                                    />
                                </div>
                                <div>
                                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '600'}}>
                                        Vehicle Type:
                                    </label>
                                    <select 
                                        value={bookingData.vehicle_type}
                                        onChange={(e) => setBookingData({...bookingData, vehicle_type: e.target.value})}
                                        style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px'}}
                                    >
                                        <option value="escooter">E-Scooter</option>
                                        <option value="ebike">E-Bike</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit"
                                    style={{
                                        padding: '15px', 
                                        background: '#28a745', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '5px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Start Ride
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* Available Vehicles */}
                <section className="available-vehicles">
                    <h2>🚲 Available Vehicles ({vehicles.length})</h2>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px'}}>
                        {vehicles.slice(0, 6).map(vehicle => (
                            <div key={vehicle.id} className="ride-card">
                                <h4>{vehicle.vehicle_id} - {vehicle.vehicle_type}</h4>
                                <p><strong>Model:</strong> {vehicle.model_name}</p>
                                <p><strong>Battery:</strong> {vehicle.battery_level}%</p>
                                <p><strong>Status:</strong> 
                                    <span style={{
                                        color: vehicle.status === 'available' ? '#28a745' : '#dc3545',
                                        fontWeight: 'bold',
                                        marginLeft: '5px'
                                    }}>
                                        {vehicle.status.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Ride History */}
                <section className="ride-history">
                    <h2>📋 Ride History</h2>
                    <div className="rides-list">
                        {rides.length > 0 ? (
                            rides.slice(0, 5).map(ride => (
                                <div key={ride.id} className="ride-card">
                                    <h4>Ride #{ride.ride_id} - {new Date(ride.created_at).toLocaleDateString()}</h4>
                                    <p><strong>From:</strong> {ride.start_location_name}</p>
                                    <p><strong>To:</strong> {ride.end_location_name || 'In Progress'}</p>
                                    <p><strong>Amount:</strong> ₹{ride.cost}</p>
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
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                <p>No ride history found.</p>
                                <p>Book your first ride to get started!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;