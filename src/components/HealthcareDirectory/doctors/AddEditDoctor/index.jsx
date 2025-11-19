

//  export default AddEditDoctor; 
// //17.11.25
// // src/components/HealthcareDirectory/doctors/AddEditDoctor/index.jsx
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useSnackbar } from "../../../../contexts/SnackbarContext";
import { doctorsService } from "../../../../services/doctorsService";

// SECTION COMPONENTS
import FileUploadSection from "./FileUploadSection";
import BasicInfoSection from "./BasicInfoSection";
import QualificationSection from "./QualificationSection";
import DepartmentServiceSection from "./DepartmentServiceSection";
import ServiceTypeSection from "./ServiceTypeSection";
import HomeVisitSection from "./HomeVisitSection";
import AddressSection from "./AddressSection";
import TimeSlotSection from "./TimeSlotSection";
import IntroductionSection from "./IntroductionSection";

export default function AddEditDoctor({
  onClose,
  initialData,
  isEditing,
  onSuccess,
}) {
  const { showSnackbar } = useSnackbar();

  // ---------------------------------------------------------------
  // MAIN FORM STATE
  // ---------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone?.replace("+91", "") || "",
    gender: initialData?.gender || "",
   // qualification: initialData?.qualification || [],
   qualification: Array.isArray(initialData?.qualification)
  ? initialData.qualification
  : initialData?.qualification
  ? [initialData.qualification]
  : [],
    medicalCouncilRegistrationNumber:
      initialData?.medicalCouncilRegistrationNumber || "",
    experienceYears: initialData?.experienceYears || "",
    languagesSpoken: initialData?.languagesSpoken || [],
    specialty: initialData?.specialty || "",
    specializations: initialData?.specializations || [],
    serviceTypes: initialData?.serviceTypes || [],
    areas:
      initialData?.areas?.map((a) => ({
        pincode: a.pincode,
        region: a.region,
        _id: a._id || a.region,
      })) || [],
    address: initialData?.offlineAddress
      ? {
          street: initialData.offlineAddress.description || "",
          landmark: initialData.offlineAddress.landmark || "",
          pincode: initialData.offlineAddress.pinCode || "",
          region: initialData.offlineAddress.region || "",
          city: initialData.offlineAddress.city || "",
          state: initialData.offlineAddress.state || "",
          country: initialData.offlineAddress.country || "India",
        }
      : {
          street: "",
          landmark: "",
          pincode: "",
          region: "",
          city: "",
          state: "",
          country: "India",
        },
    onlineConsultationTimeSlots:
      initialData?.onlineConsultationTimeSlots || [],
    offlineConsultationTimeSlots:
      initialData?.offlineConsultationTimeSlots || [],
    homeVisitEnabled: initialData?.homeVisitEnabled || false,
    homeVisitLocations: initialData?.homeVisitLocations || [],
    photoUrl: initialData?.photoUrl || "",
    photoPublicId: initialData?.photoPublicId || "",
    introduction: initialData?.introduction || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow digits and limit to 10 characters
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: phoneValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }
  
  
  // Update the formatTimeSlots function
  const formatTimeSlots = (slots) => {
    return slots.map(slot => ({
      day: slot.day.toLowerCase(),
      slots: slot.slots.map(timeSlot => {
        // Handle both formats: "HH:mm - HH:mm" and "HH:mm | HH:mm"
        const [start, end] = timeSlot.includes('|') 
          ? timeSlot.split('|').map(t => t.trim())
          : timeSlot.split('-').map(t => t.trim());
        return `${start} | ${end}`;
      })
    }));
  };

  // Update the initial state for time slots
  const [onlineTimeSlots, setOnlineTimeSlots] = useState(
    initialData?.onlineConsultationTimeSlots?.map(slot => ({
      day: slot.day,
      slots: slot.slots.map(timeSlot => {
        const [start, end] = timeSlot.split('|').map(t => t.trim());
        return `${start} - ${end}`;
      })
    })) || []
  );

  const [offlineTimeSlots, setOfflineTimeSlots] = useState(
    initialData?.offlineConsultationTimeSlots?.map(slot => ({
      day: slot.day,
      slots: slot.slots.map(timeSlot => {
        const [start, end] = timeSlot.split('|').map(t => t.trim());
        return `${start} - ${end}`;
      })
    })) || []
  );


  // Specialties from DB
  const [specialties, setSpecialties] = useState([]);
  const [subSpecialties, setSubSpecialties] = useState([]);

  // Pincode → region lookup
  const [regionOptions, setRegionOptions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);

  const [saving, setSaving] = useState(false);
const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  // ---------------------------------------------------------------
  // LOAD SPECIALTIES
  // ---------------------------------------------------------------
  useEffect(() => {
    doctorsService.getSpecialties().then((res) => {
      if (res.status === "success") setSpecialties(res.data);
    });
  }, []);

  // ---------------------------------------------------------------
  // LOAD SUBSPECIALTIES WHEN SPECIALTY CHANGES
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!formData.specialty) {
      setSubSpecialties([]);
      return;
    }

    doctorsService.getSubSpecialties(formData.specialty).then((res) => {
      if (res.status === "success") setSubSpecialties(res.data);
    });
  }, [formData.specialty]);

  // ---------------------------------------------------------------
  // GENERIC CHANGE HANDLER
  // ---------------------------------------------------------------
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ---------------------------------------------------------------
  // QUALIFICATION HANDLER
  // ---------------------------------------------------------------
  const handleQualificationChange = (val) => {
    updateField("qualification", val);
  };

  // ---------------------------------------------------------------
  // LANGUAGE HANDLER
  // ---------------------------------------------------------------
  const handleLanguageChange = (lang) => {
    const exists = formData.languagesSpoken.includes(lang);
    updateField(
      "languagesSpoken",
      exists
        ? formData.languagesSpoken.filter((l) => l !== lang)
        : [...formData.languagesSpoken, lang]
    );
  };

  // ---------------------------------------------------------------
  // SERVICE TYPE HANDLER (online/offline/homeVisit)
  // ---------------------------------------------------------------
  const handleServiceTypeChange = (type) => {
    const exists = formData.serviceTypes.includes(type);
    const updated = exists
      ? formData.serviceTypes.filter((t) => t !== type)
      : [...formData.serviceTypes, type];

    setFormData((prev) => ({
      ...prev,
      serviceTypes: updated,
      homeVisitEnabled: type === "homeVisit" ? !prev.homeVisitEnabled : prev.homeVisitEnabled,
    }));
  };

  // ---------------------------------------------------------------
  // PINCODE LOOKUP
  // ---------------------------------------------------------------
  const fetchLocationDetails = async (pincode, section) => {
    if (pincode.length !== 6) return;

    try {
      setIsLoadingRegions(true);
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();

      if (data[0].Status !== "Success") {
        setRegionOptions([]);
        showSnackbar("Invalid pincode", "error");
        return;
      }

      const offices = data[0].PostOffice;

      setRegionOptions(
        offices.map((o) => ({
          value: o.Name,
          label: `${o.Name} (${o.District})`,
        }))
      );

      if (section === "address") {
        const first = offices[0];
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            city: first.District,
            state: first.State,
          },
        }));
      }
    } catch (e) {
      showSnackbar("Error fetching pincode", "error");
    } finally {
      setLoadingRegions(false);
    }
  };

  // ---------------------------------------------------------------
  // FILE UPLOAD
  // ---------------------------------------------------------------
  const handlePhotoUpload = async (file) => {
    try {
      const res = await doctorsService.uploadPhoto(file);
      if (res.status === "success") {
        updateField("photoUrl", res.data.url);
        updateField("photoPublicId", res.data.public_id);
        showSnackbar("Photo uploaded", "success");
      }
    } catch (e) {
      showSnackbar("Upload failed", "error");
    }
  };
  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };
    const handleAddressPincodeChange = (e) => {
    const pincode = e.target.value;
    handleAddressChange('pincode', pincode);
    
    if (pincode.length === 6) {
      fetchLocationDetails(pincode, 'address');
    } else {
      setRegionOptions([]);
      handleAddressChange('region', '');
      handleAddressChange('city', '');
      handleAddressChange('state', '');
    }
  };

  const handleServicePincodeChange = (e) => {
    const pincode = e.target.value;
    
    if (pincode.length === 6) {
      fetchLocationDetails(pincode, 'service');
    } else {
      setRegionOptions([]);
    }
  };

  const handleServiceAreaChange = (newAreas) => {
    setFormData(prev => ({
      ...prev,
      areas: newAreas.map(area => ({
        pincode: area.pincode,
        region: area.region,
        _id: area._id || area.region
      }))
    }));
  };

  const handleRegionChange = (selectedOptions) => {
    const currentPincode = formData.areas.length > 0 ? formData.areas[0].pincode : '';
    const selectedPincode = document.querySelector('input[name="servicePincode"]').value;
    
    // Get existing areas that don't have the current pincode
    const existingAreas = formData.areas.filter(area => area.pincode !== selectedPincode);
    
    // Add new areas with the current pincode
    const newAreas = selectedOptions.map(option => ({
      pincode: selectedPincode,
      region: option.value,
      _id: option.value
    }));

    // Combine existing areas with new areas
    setFormData(prev => ({
      ...prev,
      areas: [...existingAreas, ...newAreas]
    }));
  };

  // ---------------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------------
  const formatForDB = (slots) =>
  slots.map((slot) => ({
    day: slot.day.toLowerCase(),
    slots: slot.slots.map((s) => s.replace(" - ", " | ")), // correct DB format
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return showSnackbar("Name required", "error");
    if (!formData.email.trim()) return showSnackbar("Email required", "error");
    if (formData.phone.length !== 10)
      return showSnackbar("Phone must be 10 digits", "error");
  const payload = {
    ...formData,
    phone: `+91${formData.phone}`,

    onlineConsultationTimeSlots: formData.serviceTypes.includes('online')
      ? formatTimeSlots(onlineTimeSlots)
      : [],

    offlineConsultationTimeSlots: formData.serviceTypes.includes('offline')
      ? formatTimeSlots(offlineTimeSlots)
      : [],
  };

  console.log("FINAL PAYLOAD:", payload);

    console.log(payload);
    

    try {
      setSaving(true);
      let res;

      if (isEditing)
        res = await doctorsService.updateDoctor(initialData._id, payload);
      else res = await doctorsService.createDoctor(payload);

      if (res.status === "success") {
        showSnackbar("Saved!", "success");
        onSuccess?.();
        onClose();
      } else {
        showSnackbar("Failed", "error");
      }
    } catch (e) {
      showSnackbar("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };
  // Add days of the week array
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Function to handle adding time slots
const handleAddTimeSlot = (type) => {
  const slots = type === "online" ? onlineTimeSlots : offlineTimeSlots;
  const existingDays = slots.map(s => s.day);

  const nextDay = daysOfWeek.find(d => !existingDays.includes(d));
  if (!nextDay) return showSnackbar("All days added", "info");

  const updated = [...slots, { day: nextDay, slots: [] }];

  if (type === "online") {
    setOnlineTimeSlots(updated);
    setFormData(prev => ({
      ...prev,
      onlineConsultationTimeSlots: updated
    }));
  } else {
    setOfflineTimeSlots(updated);
    setFormData(prev => ({
      ...prev,
      offlineConsultationTimeSlots: updated
    }));
  }
};


  // Update the handleAddTimeToSlot function
  // const handleAddTimeToSlot = (type, dayIndex, startTime, endTime) => {
  //   // Validate time range
  //   if (!startTime || !endTime) {
  //     showSnackbar('Please select both start and end times', 'error');
  //     return;
  //   }

  //   // Convert times to comparable format
  //   const start = new Date(`1970-01-01T${startTime}`);
  //   const end = new Date(`1970-01-01T${endTime}`);

  //   if (start >= end) {
  //     showSnackbar('End time must be after start time', 'error');
  //     return;
  //   }

  //   const timeString = `${startTime} - ${endTime}`;
    
  //   // Check for duplicate time slots
  //   const existingSlots = type === 'online' ? onlineTimeSlots : offlineTimeSlots;
  //   const daySlots = existingSlots[dayIndex].slots || [];
    
  //   // Check for exact duplicates
  //   if (daySlots.includes(timeString)) {
  //     showSnackbar('This time slot already exists', 'error');
  //     return;
  //   }

  //   // Check for overlapping time slots
  //   const newStart = start.getTime();
  //   const newEnd = end.getTime();
    
  //   const hasOverlap = daySlots.some(slot => {
  //     const [existingStart, existingEnd] = slot.split(' - ').map(time => 
  //       new Date(`1970-01-01T${time}`).getTime()
  //     );
  //     return (newStart >= existingStart && newStart < existingEnd) ||
  //            (newEnd > existingStart && newEnd <= existingEnd) ||
  //            (newStart <= existingStart && newEnd >= existingEnd);
  //   });

  //   if (hasOverlap) {
  //     showSnackbar('This time slot overlaps with an existing slot', 'error');
  //     return;
  //   }
    
  //   // Create a new array to avoid mutating state directly
  //   const updatedSlots = [...existingSlots];
  //   if (!updatedSlots[dayIndex].slots) {
  //     updatedSlots[dayIndex].slots = [];
  //   }
  //   updatedSlots[dayIndex].slots = [...updatedSlots[dayIndex].slots, timeString];
    
  //   if (type === 'online') {
  //     setOnlineTimeSlots(updatedSlots);
  //   } else {
  //     setOfflineTimeSlots(updatedSlots);
  //   }
  // };
const handleAddTimeToSlot = (type, dayIndex, startTime, endTime) => {
  if (!startTime || !endTime) return;

  const newSlot = `${startTime} - ${endTime}`;

  const target = type === "online" ? onlineTimeSlots : offlineTimeSlots;

  const updated = [...target];
  updated[dayIndex].slots = [...updated[dayIndex].slots, newSlot];

  if (type === "online") {
    setOnlineTimeSlots(updated);
    setFormData((p) => ({ ...p, onlineConsultationTimeSlots: updated }));
  } else {
    setOfflineTimeSlots(updated);
    setFormData((p) => ({ ...p, offlineConsultationTimeSlots: updated }));
  }
};

//  const handleAddTimeToSlot = (type, dayIndex, startTime, endTime) => {
//   if (!startTime || !endTime) {
//     showSnackbar('Please select both start and end times', 'error');
//     return;
//   }

//   const start = new Date(`1970-01-01T${startTime}`);
//   const end = new Date(`1970-01-01T${endTime}`);

//   if (start >= end) {
//     showSnackbar('End time must be after start time', 'error');
//     return;
//   }

//   const timeString = `${startTime} - ${endTime}`;

//   const source = type === "online" ? onlineTimeSlots : offlineTimeSlots;

//   const daySlots = source[dayIndex].slots || [];

//   if (daySlots.includes(timeString)) {
//     showSnackbar('This time slot already exists', 'error');
//     return;
//   }

//   const updated = [...source];
//   updated[dayIndex].slots = [...updated[dayIndex].slots, timeString];

//   if (type === "online") {
//     setOnlineTimeSlots(updated);
//     setFormData(prev => ({
//       ...prev,
//       onlineConsultationTimeSlots: updated
//     }));
//   } else {
//     setOfflineTimeSlots(updated);
//     setFormData(prev => ({
//       ...prev,
//       offlineConsultationTimeSlots: updated
//     }));
//   }
// };


  // Function to handle removing time from a slot
const handleRemoveTimeFromSlot = (type, dayIndex, timeIndex) => {
  const source = type === "online" ? onlineTimeSlots : offlineTimeSlots;

  const updated = [...source];
  updated[dayIndex].slots.splice(timeIndex, 1);

  if (type === "online") {
    setOnlineTimeSlots(updated);
    setFormData(prev => ({
      ...prev,
      onlineConsultationTimeSlots: updated
    }));
  } else {
    setOfflineTimeSlots(updated);
    setFormData(prev => ({
      ...prev,
      offlineConsultationTimeSlots: updated
    }));
  }
};


  // Function to handle removing a day's slots
const handleRemoveDaySlots = (type, dayIndex) => {
  if (type === "online") {
    const updated = onlineTimeSlots.filter((_, i) => i !== dayIndex);
    setOnlineTimeSlots(updated);
    setFormData(prev => ({
      ...prev,
      onlineConsultationTimeSlots: updated
    }));
  } else {
    const updated = offlineTimeSlots.filter((_, i) => i !== dayIndex);
    setOfflineTimeSlots(updated);
    setFormData(prev => ({
      ...prev,
      offlineConsultationTimeSlots: updated
    }));
  }
};


  // Update formData when time slots change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      onlineConsultationTimeSlots: onlineTimeSlots,
      offlineConsultationTimeSlots: offlineTimeSlots
    }));
  }, [onlineTimeSlots, offlineTimeSlots]);

  // ---------------------------------------------------------------
  // UI RENDER
  // ---------------------------------------------------------------
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-xl p-6 lg:p-8 w-[95%] max-w-6xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditing ? "Edit Doctor" : "Add New Doctor"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUploadSection
            formData={formData}
            handlePhotoUpload={handlePhotoUpload}
          />

          <BasicInfoSection
            formData={formData}
            updateField={updateField}
            specialties={specialties}
            subSpecialties={subSpecialties}
            handleInputChange={handleInputChange}
          />

          <QualificationSection
            formData={formData}
            handleQualificationChange={handleQualificationChange}
            handleLanguageChange={handleLanguageChange}
          />

          {/* <DepartmentServiceSection formData={formData} setFormData={setFormData} /> */}
          <DepartmentServiceSection
    formData={formData}
    setFormData={setFormData}
    specialties={specialties}
    subSpecialties={subSpecialties}
/>

          {/* <ServiceTypeSection
            formData={formData}
            handleServiceTypeChange={handleServiceTypeChange}
            regionOptions={regionOptions}
            loadingRegions={loadingRegions}
            fetchLocationDetails={fetchLocationDetails}
            setFormData={setFormData}
          /> */}

                  <ServiceTypeSection
            formData={formData}
            handleServiceTypeChange={handleServiceTypeChange}
            handleServiceAreaChange={handleServiceAreaChange}
            regionOptions={regionOptions}
            isLoadingRegions={isLoadingRegions}
            handleRegionChange={handleRegionChange}
            handlePincodeChange={handleServicePincodeChange}
          />

          {formData.homeVisitEnabled && (
            <HomeVisitSection formData={formData} setFormData={setFormData} />
          )}

         

          {/* {formData.serviceTypes.includes("online") && (
            <TimeSlotSection
              type="online"
              slots={onlineSlots}
              setSlots={setOnlineSlots}
            />
          )}

          {formData.serviceTypes.includes("offline") && (
            <TimeSlotSection
              type="offline"
              slots={offlineSlots}
              setSlots={setOfflineSlots}
            />
          )} */}
          
           {formData.serviceTypes.includes('offline') && (
            <AddressSection
              formData={formData}
              handleAddressChange={handleAddressChange}
              regionOptions={regionOptions}
              handlePincodeChange={handleAddressPincodeChange}
            />
          )}

          {formData.serviceTypes.includes('online') && (
            <TimeSlotSection
              type="online"
              timeSlots={onlineTimeSlots}
              handleAddTimeSlot={handleAddTimeSlot}
              handleAddTimeToSlot={handleAddTimeToSlot}
              handleRemoveTimeFromSlot={handleRemoveTimeFromSlot}
              handleRemoveDaySlots={handleRemoveDaySlots}
            />
          )}

          {formData.serviceTypes.includes('offline') && (
            <TimeSlotSection
              type="offline"
              timeSlots={offlineTimeSlots}
              handleAddTimeSlot={handleAddTimeSlot}
              handleAddTimeToSlot={handleAddTimeToSlot}
              handleRemoveTimeFromSlot={handleRemoveTimeFromSlot}
              handleRemoveDaySlots={handleRemoveDaySlots}
            />
          )}

          <IntroductionSection
            formData={formData}
            updateField={updateField}
              handleInputChange={handleInputChange}
          />

          {/* BUTTONS */}
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
