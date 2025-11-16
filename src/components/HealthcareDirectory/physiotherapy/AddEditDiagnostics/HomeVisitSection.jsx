import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function HomeVisitSection({ formData, setFormData }) {
  const [locationData, setLocationData] = useState({
    days: [],
    fromTime: "",
    toTime: "",
    locationName: "",
    city: "",
    pincode: "",
    radius: ""
  });

  const daysList = [
    "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Toggle Days
  const toggleDay = (day) => {
    setLocationData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day]
    }));
  };

  // Add New Home Visit Location
  const addHomeVisitLocation = () => {
    const {
      days, fromTime, toTime, locationName,
      city, pincode
    } = locationData;

    if (
      days.length === 0 ||
      !fromTime ||
      !toTime ||
      !locationName.trim() ||
      !city.trim() ||
      pincode.length !== 6
    ) {
      alert("Please fill all required fields");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      homeVisitLocations: [...prev.homeVisitLocations, locationData]
    }));

    // Reset form
    setLocationData({
      days: [],
      fromTime: "",
      toTime: "",
      locationName: "",
      city: "",
      pincode: "",
      radius: ""
    });
  };

  // Remove location
  const removeLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      homeVisitLocations: prev.homeVisitLocations.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">Home Visit</h3>

      {/* ---------------------- Days Available ---------------------- */}
      <label className="block text-sm font-medium mb-2">Days Available *</label>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
        {daysList.map((day) => (
          <label
            key={day}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
              locationData.days.includes(day)
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={locationData.days.includes(day)}
              onChange={() => toggleDay(day)}
            />
            {day}
          </label>
        ))}
      </div>

      {/* ---------------------- Time Selection ---------------------- */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">From Time *</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={locationData.fromTime}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, fromTime: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">To Time *</label>
          <input
            type="time"
            className="w-full border rounded px-3 py-2"
            value={locationData.toTime}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, toTime: e.target.value }))
            }
          />
        </div>
      </div>

      {/* ---------------------- Location Info ---------------------- */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Location Name *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={locationData.locationName}
            onChange={(e) =>
              setLocationData((prev) => ({
                ...prev,
                locationName: e.target.value
              }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">City *</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={locationData.city}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, city: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Pincode *</label>
          <input
            type="text"
            maxLength="6"
            className="w-full border rounded px-3 py-2"
            value={locationData.pincode}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, pincode: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium">Radius Coverage (km)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={locationData.radius}
            onChange={(e) =>
              setLocationData((prev) => ({ ...prev, radius: e.target.value }))
            }
          />
        </div>
      </div>

      {/* ---------------------- Add Button ---------------------- */}
      {/* <button
        type="button"
        onClick={addHomeVisitLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FaPlus /> Add Home Visit Location
      </button> */}

      {/* ---------------------- Added Locations ---------------------- */}
      <div className="mt-6 space-y-3">
        {formData.homeVisitLocations.map((item, index) => (
          <div
            key={index}
            className="bg-gray-50 border rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold text-lg">{item.locationName}</p>
              <p>{item.city} - {item.pincode}</p>
              <p>Days: {item.days.join(", ")}</p>
              <p>{item.fromTime} - {item.toTime}</p>
              {item.radius && <p>Radius: {item.radius} km</p>}
            </div>

            <button
              type="button"
              onClick={() => removeLocation(index)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
