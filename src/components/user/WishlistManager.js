import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/Users/";

export default function WishlistManager() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  // 🧠 Fetch user favorites
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(`${API_BASE}favorites/vehicles/`, { headers });
      setFavorites(res.data);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  // ❤️ Toggle wishlist add/remove
  const toggleFavorite = async (vehicle) => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer ${token}` };

      const alreadyFav = favorites.some((f) => f.vehicle_id === vehicle.id);
      if (alreadyFav) {
        await axios.delete(`${API_BASE}favorites/vehicles/${vehicle.id}/`, { headers });
        setFavorites((prev) => prev.filter((f) => f.vehicle_id !== vehicle.id));
      } else {
        await axios.post(
          `${API_BASE}favorites/vehicles/`,
          { vehicle_id: vehicle.id },
          { headers }
        );
        setFavorites((prev) => [...prev, { vehicle_id: vehicle.id }]);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  const isFavorited = (id) => favorites.some((f) => f.vehicle_id === id);

  return { favorites, isFavorited, toggleFavorite };
}
