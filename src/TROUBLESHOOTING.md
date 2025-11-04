# Blood Donation Website - Phone & Location Troubleshooting Guide

## Issue
Phone numbers and locations showing as "Phone not provided" and "Location not provided" even after submitting form with these details.

## Latest Updates (Use This!)

### NEW: Debug Panel Added ✨
I've added a **Database Debug Panel** at the bottom of the Donors page that will:
- Show exactly what data is in your database
- Tell you if phone numbers and locations are being stored
- Display raw JSON data so you can see the actual values
- Identify which donors have missing fields

**How to use it:**
1. Go to the **Donors page**
2. Scroll to the bottom
3. Click **"Run Database Test"** button
4. Review the results to see what's actually stored in the database

This will immediately tell you if the problem is:
- ❌ Data not being saved to database
- ❌ Data saved but not displayed correctly
- ✅ Everything working (old records just don't have the fields)

## What I Fixed

### 1. Enhanced Donor Card Display
- Made phone number and location **MORE PROMINENT** with colored backgrounds:
  - 📍 **Location**: Red background box with "Location" label
  - 📞 **Phone**: Blue background box with "Contact" label
- Added fallback text: "Location not provided" / "Phone not provided" if data is missing

### 2. Added Debug Information
- **Blue debug panel** at the top of Donors page shows:
  - Total number of donors
  - Whether any donors have phone & location data
  - Warning if no data is found

### 3. Console Logging
- **DonationForm**: Logs the data being submitted when you fill the form
- **DonorsPage**: Logs all donor data received from the database
- Open browser DevTools (F12) → Console tab to see these logs

## How to Test (Updated with Debug Panel!)

### Step 0: Use the Debug Panel (EASIEST!)
1. Go to **Donors page**
2. Scroll to the **bottom**
3. Click the purple **"Run Database Test"** button
4. Read the results - it will tell you exactly what's wrong!

### Step 1: Check Server Logs (Supabase Dashboard)
To see what the backend is receiving/storing:
1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Go to **Logs** → **Edge Functions**
4. You should see console logs showing:
   - "Received donation request body:" - Shows what data the form sent
   - "Storing donation:" - Shows what's being saved to database
   - "Total donations retrieved:" - Shows what's being fetched
5. Look for the `contactNumber` and `location` fields in these logs

### Step 2: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Go to the Donors page
4. Look for: `"Fetched donors data:"` - this shows what the database returned

### Step 2: Submit a NEW Donation
**Important**: Old donations may not have phone/location fields!

1. **Login** to your account
2. Fill out the **complete donation form** including:
   - Name: (e.g., "John Doe")
   - Age: 25 (must be 18+)
   - Gender: Male
   - Blood Group: A+
   - Weight: 70 (must be 60+)
   - **📞 Contact Number**: (e.g., "9876543210")
   - **📍 Location**: (e.g., "Mumbai")
3. Submit the form
4. Check the console for: `"Submitting donation with data:"` - verify phone & location are included
5. Go to **Donors page**
6. Look for the new donor card - it should show the phone and location in colored boxes

### Step 3: Check the Debug Panel
On the Donors page, look at the blue box at the top:
- ✅ **Green message**: "Some donors have phone & location data" = SUCCESS!
- ⚠️ **Red message**: "No donors have phone & location" = Need to submit new donation

## Common Issues & Solutions

### Issue: Only icons showing, no text
**Cause**: Old donor records don't have phone/location fields  
**Solution**: Submit a NEW donation with the updated form

### Issue: "Location not provided" / "Phone not provided" showing
**Cause**: The data wasn't saved in the database  
**Solution**: 
1. Check console logs to see if data was sent
2. Verify you filled all form fields
3. Check that you're logged in (auth token required)

### Issue: Location filter is empty
**Cause**: No donors have location data yet  
**Solution**: Submit donations with different locations (e.g., "Mumbai", "Delhi", "Chennai")

## Database Structure

Each donor record should have:
```javascript
{
  donorName: "John Doe",
  age: 25,
  gender: "Male",
  bloodGroup: "A+",
  weight: 70,
  contactNumber: "9876543210",  // ← Should be here
  location: "Mumbai",            // ← Should be here
  isEligible: true,
  timestamp: "2025-10-31T10:30:00.000Z"
}
```

## Verification Checklist

- [ ] Opened browser console (F12)
- [ ] Checked console logs when visiting Donors page
- [ ] Submitted a NEW donation with phone & location
- [ ] Verified console shows the submitted data includes phone & location
- [ ] Refreshed the Donors page
- [ ] Saw the new donor card with phone & location in colored boxes
- [ ] Debug panel shows green success message

## Still Not Working?

If after submitting a new donation, the phone and location still don't show:

1. **Check the console logs** for any errors (red text)
2. **Verify the backend** is running (server endpoint should be accessible)
3. **Clear browser cache** and reload
4. **Check that eligibility criteria are met**: Age ≥18, Weight ≥60 (ineligible donations are not saved!)

---

## Quick Test Data

Use this to quickly test:
- Name: Test Donor
- Age: 25
- Gender: Male  
- Blood Group: O+
- Weight: 70
- Contact: +91-9876543210
- Location: New Delhi

This donor is eligible and should appear on the Donors page immediately after submission.
