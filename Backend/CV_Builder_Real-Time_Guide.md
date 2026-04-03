# CV Builder Real-Time Data Integration Guide

## 🎯 Problem Solved
CV builder now updates data in real-time across entire app, just like profile page. When you edit details in CV builder, whole app updates immediately.

## ✅ Solution Implemented

### **1. Real-Time CV Data Fetch**
CV builder now fetches fresh data including user profile:
```javascript
// Get CV by email with fresh user data
GET /cv/email/:email
// Response: { 
//   success: true, 
//   data: {...}, // CV data
//   user: { // Fresh user data for real-time updates
//     fullName: user.fullName,
//     gmail: user.gmail,
//     skills: user.skills,
//     mode: user.mode,
//     timePreference: user.timePreference,
//     address: user.address,
//     age: user.age,
//     phoneNo: user.phoneNo,
//     education: user.education,
//     experience: user.experience
//   },
//   dataFreshness: 'real-time'
// }
```

### **2. Real-Time CV Updates**
When CV is saved/updated, it now syncs multiple user fields:
- **Skills** → User.skills
- **Phone** → User.phoneNo  
- **Address** → User.address
- **Age** → User.age

### **3. Enhanced Response Indicators**
All CV operations now return:
- `dataFreshness: 'real-time'` - Confirms fresh data
- `userUpdated: true/false` - Indicates if user data was synced

## 📊 CV Builder Endpoints

### **Load CV Builder**
```javascript
// Load fresh CV and user data
GET /cv/email/:email
// Returns CV data + fresh user profile data
```

### **Save CV (Regular)**
```javascript
// Save CV and sync user data
POST /cv
// Response: { success: true, data: {...}, userUpdated: true, dataFreshness: 'real-time' }
```

### **Save CV (Email-based)**
```javascript
// Save CV via email and sync user data
POST /cv/email/:email
// Response: { success: true, data: {...}, userUpdated: true, dataFreshness: 'real-time' }
```

## 🔧 Frontend Integration

### **CV Builder Page Load**
```javascript
// Load fresh data when CV builder opens
const loadCVBuilder = async (userEmail) => {
  try {
    const response = await fetch(`/cv/email/${userEmail}`);
    const data = await response.json();
    
    if (data.success && data.dataFreshness === 'real-time') {
      // Populate CV form with fresh data
      populateCVForm(data.data);
      
      // Also populate user-related fields
      if (data.user) {
        updateUserFields(data.user);
      }
    }
  } catch (error) {
    console.error('Error loading CV builder:', error);
  }
};

// Call on page load
window.addEventListener('load', () => {
  const userEmail = localStorage.getItem('userEmail');
  loadCVBuilder(userEmail);
});
```

### **CV Builder Save**
```javascript
// Save CV and update real-time data
const saveCV = async (cvData) => {
  try {
    const userEmail = localStorage.getItem('userEmail');
    const response = await fetch(`/cv/email/${userEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cvData)
    });
    
    const result = await response.json();
    
    if (result.success && result.dataFreshness === 'real-time') {
      // CV saved and user data synced
      showSuccess('CV saved successfully!');
      
      // Optionally refresh other parts of UI
      if (result.userUpdated) {
        refreshUserProfile(); // Update profile data in UI
        refreshMatches(); // Update matches if skills changed
      }
    }
  } catch (error) {
    console.error('Error saving CV:', error);
  }
};
```

### **React Component Example**
```javascript
import React, { useEffect, useState } from 'react';

const CVBuilder = () => {
  const [cvData, setCVData] = useState(null);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const loadCVData = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await fetch(`/cv/email/${userEmail}`);
        const data = await response.json();
        
        if (data.success && data.dataFreshness === 'real-time') {
          setCVData(data.data); // Fresh CV data
          setUserData(data.user); // Fresh user data
        }
      } catch (error) {
        console.error('Error loading CV:', error);
      }
    };
    
    loadCVData();
  }, []);
  
  const handleSave = async (formData) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(`/cv/email/${userEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success && result.dataFreshness === 'real-time') {
        // CV saved and user data synced across app
        alert('CV saved and updated across all pages!');
        
        // Optionally reload fresh data
        if (result.userUpdated) {
          loadCVData(); // Reload fresh data
        }
      }
    } catch (error) {
      console.error('Error saving CV:', error);
    }
  };
  
  return (
    <div>
      {/* CV Form with fresh data */}
      {cvData && (
        <form onSubmit={handleSave}>
          <input defaultValue={cvData.personalInfo?.fullName} />
          <input defaultValue={userData?.skills} placeholder="Skills from profile" />
          <input defaultValue={userData?.phoneNo} placeholder="Phone from profile" />
          <input defaultValue={userData?.address} placeholder="Address from profile" />
          <button type="submit">Save CV</button>
        </form>
      )}
    </div>
  );
};
```

## 🚀 Key Features

### **Real-Time Data Sync**
1. **CV Load**: Fetches fresh CV + user data
2. **CV Save**: Syncs skills, phone, address, age to user profile
3. **Immediate Updates**: Changes reflect across all pages instantly
4. **Data Freshness**: `dataFreshness: 'real-time'` confirms fresh data

### **Synced Fields**
When CV is saved, these user fields are updated:
- `skills` ← CV skills
- `phoneNo` ← CV personalInfo.phone
- `address` ← CV personalInfo.address  
- `age` ← CV personalInfo.age

### **Response Indicators**
- `dataFreshness: 'real-time'` - Data is fresh from database
- `userUpdated: true` - User profile was synced
- `userUpdated: false` - No user data needed syncing

## 📈 Data Flow

```
User Opens CV Builder → Fresh CV + User Data Loaded
        ↓
User Edits & Saves CV → CV Saved + User Data Synced
        ↓
All Pages Updated → Real-Time Data Available Everywhere
```

## ✅ Implementation Benefits

1. **No Logout Required**: CV updates reflect immediately across app
2. **Complete Sync**: Multiple user fields updated from CV
3. **Fresh Data**: `.lean()` prevents caching
4. **Consistent Experience**: Same real-time behavior as profile page
5. **Immediate UI Updates**: All pages see changes instantly

## 🔍 Usage Checklist

- [ ] CV builder loads fresh data on page open
- [ ] CV form populated with fresh CV + user data
- [ ] CV save updates user profile fields
- [ ] Changes reflect immediately across all pages
- [ ] `dataFreshness: 'real-time'` confirmed in responses
- [ ] `userUpdated` indicator checked after saves

**CV builder now provides real-time data updates across entire application!** 🎉
