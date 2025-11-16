// src/components/HealthcareDirectory/diagnostics/AddEditDiagnostics/index.jsx

import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { doctorsService } from "../../../../services/doctorsService"; 
import DiagnosticsServicesSection from "./DiagnosticsServicesSection";
import IntroductionSection from "./IntroductionSection";
import DiagnosticsAddressSection from "./DiagnosticsAddressSection";

const AddEditDiagnostics = ({ onClose, initialData, isEditing, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // -------------------------
  // formData: Diagnostics fields only
  // -------------------------
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    addressStreet: initialData?.address?.street || initialData?.address || "",
    area: initialData?.area || initialData?.address?.area || "",
    city: initialData?.city || initialData?.address?.city || "",
    state: initialData?.state || initialData?.address?.state || "",
    pincode: initialData?.pincode || initialData?.address?.pincode || "",
    gstNumber: initialData?.gstNumber || "",
    services: initialData?.services || [],
    introduction: initialData?.introduction || "",
   addresses: initialData?.addresses || [
  {
    locationName: "",
    addressStreet: "",
    area: "",
    city: "",
    pincode: ""
  }
],
servicetype: initialData?.servicetype || '',

  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // handle simple inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, phone: phoneValue }));
      return;
    }

    if (name === "pincode") {
      const pin = value.replace(/\D/g, "").slice(0, 6);
      setFormData(prev => ({ ...prev, pincode: pin }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Validation
      if (!formData.name.trim()) throw new Error("Name is required");
      if (!formData.services.length) throw new Error("Select at least one service");
      if (!formData.phone || formData.phone.length !== 10)
        throw new Error("Valid 10-digit phone number required");

      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        throw new Error("Valid email required");

      if (!formData.addressStreet.trim()) throw new Error("Address is required");
      if (!formData.area.trim()) throw new Error("Area is required");
      if (!formData.city.trim()) throw new Error("City is required");
      if (!formData.pincode || formData.pincode.length !== 6)
        throw new Error("Valid pincode required");

      if (!formData.servicetype) {
        throw new Error('Please select a service');
      }

      // Build payload
      const data = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone.startsWith("+91") ? formData.phone : `+91${formData.phone}`,
        website: formData.website,
        address: {
          street: formData.addressStreet,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        gstNumber: formData.gstNumber,
        services: formData.services,
        introduction: formData.introduction,
        locationName: formData.locationName,
 addresses: formData.addresses, // <-- final,
  servicetype: formData.servicetype,
      };

      let response;

      if (isEditing) {
        response = await doctorsService.updateDoctor(initialData._id, data);
      } else {
        response = await doctorsService.createDoctor(data);
      }

      if (response?.status === "success") {
        showSnackbar(
          isEditing ? "Diagnostics Updated Successfully!" : "Diagnostics Added Successfully!",
          "success"
        );
        onSuccess?.();
        onClose?.();
      } else {
        throw new Error(response?.message || "Failed to save diagnostics");
      }

    } catch (err) {
      console.log(err);
      showSnackbar(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl p-6 lg:p-8 w-[95%] max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Physiotherapy" : "Add Physiotherapy"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                maxLength="10"
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div> */}
            <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Type *
        </label>
        <select
          name="servicetype"
          value={formData.servicetype}
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Service</option>
          <option value="Home Visit">Home Visit</option>
          <option value="Centre">Centre</option>
          <option value="Both">Both</option>
        </select>
      </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address *</label>
              <textarea
                name="addressStreet"
                value={formData.addressStreet}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2 h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Area *</label>
              <input
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">City *</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pincode *</label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                maxLength="6"
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GST Number</label>
              <input
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleInputChange}
                className="border rounded-lg w-full px-3 py-2"
              />
            </div>
          </div>

          {/* Diagnostic Services */}
          <DiagnosticsServicesSection
            formData={formData}
            setFormData={setFormData}
          />


          <DiagnosticsAddressSection 
                formData={formData}
                setFormData={setFormData}
            />

          {/* Introduction (optional) */}
          <IntroductionSection
            formData={formData}
            setFormData={setFormData}
          />

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 rounded-lg text-white disabled:bg-blue-300"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Physiotherap"
                : "Add Physiotherap"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddEditDiagnostics;
