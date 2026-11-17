import React from "react";
import { SlidersHorizontal, MapPin, Zap, RefreshCw } from "lucide-react";
import "../../styles/dark-glass.css";

export default function FilterDock({ value, onChange, onReset }) {
  return (
    <div className="filter-dock glass d-flex flex-wrap align-items-center justify-content-center gap-3 py-2 px-3">
      <div className="d-flex align-items-center gap-2">
        <SlidersHorizontal size={16} />
        <select
          className="filter-input"
          value={value.type || ""}
          onChange={(e) => onChange((f) => ({ ...f, type: e.target.value || null }))}
        >
          <option value="">All Types</option>
          <option value="scooter">Scooter</option>
          <option value="bike">Bike</option>
        </select>
      </div>

      <div className="d-flex align-items-center gap-2">
        <Zap size={16} />
        <select
          className="filter-input"
          value={value.minBattery || ""}
          onChange={(e) => onChange((f) => ({ ...f, minBattery: e.target.value || null }))}
        >
          <option value="">Any Battery</option>
          <option value="50">Above 50%</option>
          <option value="70">Above 70%</option>
          <option value="90">Above 90%</option>
        </select>
      </div>

      <div className="d-flex align-items-center gap-2">
        <MapPin size={16} />
        <input
          className="filter-input"
          type="text"
          placeholder="Area"
          value={value.area || ""}
          onChange={(e) => onChange((f) => ({ ...f, area: e.target.value }))}
        />
      </div>

      <button className="filter-reset" onClick={onReset}>
        <RefreshCw size={14} className="me-1" /> Reset
      </button>
    </div>
  );
}
