# Step-by-Step Debugging Guide
## Fixing "Phone not provided" and "Location not provided" Issue

---

## 🎯 Quick Fix - Follow These Steps in Order

### Step 1: Run the Database Debug Panel
**This is the FASTEST way to diagnose the problem!**

1. Open your blood donation website
2. Navigate to the **Donors** page
3. Scroll all the way to the **bottom**
4. You'll see a purple **"Database Debug Panel"**
5. Click the **"Run Database Test"** button
6. Read the results carefully

**What the results mean:**

✅ **If it says "Some donors have phone & location data!"**
- Good news! The database is working correctly
- The problem is that OLD donors don't have these fields
- **Solution:** Submit a NEW donation (see Step 2)

❌ **If it says "No donors have phone & location data in database!"**
- The fields are not being saved
- Continue to Step 3 to check the backend logs

❌ **If it says "No donors found in database"**
- No donations yet, or they're all from >7 days ago
- **Solution:** Submit a NEW donation (see Step 2)

---

### Step 2: Submit a NEW Test Donation

**Important:** Old donations don't have phone/location fields. You MUST submit a new one to test!

1. Make sure you're **logged in**
2. Go to the **Home page**
3. Click **"Donate Now"** or **"Register to Donate"**
4. Fill out the form with these TEST VALUES:
   ```
   Name: Test Donor Alpha
   Age: 25
   Gender: Male
   Blood Group: O+
   Weight: 70
   Contact Number: +91-9876543210
   Location: Mumbai, Maharashtra
   ```
5. Click **Submit**
6. You should see: "Thanks for filling data. You are eligible to donate!"
7. **Immediately** open browser DevTools:
   - Press **F12**
   - Go to **Console** tab
   - Look for: `"Submitting donation with data:"` 
   - **VERIFY** that the logged object includes:
     - `contactNumber: "+91-9876543210"`
     - `location: "Mumbai, Maharashtra"`

8. Go back to the **Donors page**
9. **Refresh** the page
10. Look for "Test Donor Alpha" in the donor cards
11. Check if phone and location are now showing

---

### Step 3: Check Backend Server Logs

If the phone and location are STILL not showing after Step 2, check the backend:

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Login and select your project
3. In the left sidebar, click **Logs** 
4. Click **Edge Functions**
5. Look for recent log entries

**What to look for:**

Search for these log messages (most recent first):

```
"Received donation request body:"
```
- This shows what data the form sent to the backend
- **VERIFY** that `contactNumber` and `location` are present
- If missing → Problem is in the frontend form

```
"Storing donation:"
```
- This shows what data is being saved to the database
- **VERIFY** that `contactNumber` and `location` are present
- If missing → Problem is in the backend processing

```
"Donation stored successfully"
```
- If you see this, the data was saved
- If not, check if donor was eligible (age ≥18, weight ≥60)

```
"Total donations retrieved:"
"Sample donation data:"
```
- Shows what data is being fetched from database
- **VERIFY** that `contactNumber` and `location` are in the sample

---

### Step 4: Use the Per-Card Debug Feature

Each donor card now has a "View raw data" option:

1. Go to **Donors page**
2. Find any donor card
3. At the bottom of the card, click **"🔍 Debug: View raw data"**
4. This shows the EXACT data for that donor
5. Check if `contactNumber` and `location` fields exist

**What to look for:**

✅ **Good:**
```json
{
  "donorName": "Test Donor Alpha",
  "age": 25,
  "contactNumber": "+91-9876543210",
  "location": "Mumbai, Maharashtra",
  ...
}
```

❌ **Bad (old donor):**
```json
{
  "donorName": "John Doe",
  "age": 30,
  "contactNumber": undefined,
  "location": undefined,
  ...
}
```

---

## 🔧 Common Problems & Solutions

### Problem 1: All donors show "not provided"
**Cause:** All current donors were added before the phone/location fields existed  
**Solution:** Submit a NEW donation following Step 2

### Problem 2: New donors also show "not provided"
**Cause:** Data is not being saved to the database  
**Solutions:**
- Check that you filled ALL form fields (including phone & location)
- Check that you're logged in (required for saving)
- Check backend logs (Step 3) to see what's being received
- Check that donor is eligible (age ≥18, weight ≥60) - ineligible donations are NOT saved!

### Problem 3: Form fields are empty/not showing
**Cause:** Form might be cached  
**Solution:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Problem 4: "Authorization error" in backend logs
**Cause:** Not logged in or token expired  
**Solution:** 
- Logout and login again
- Clear cookies and cache
- Try with a new account

---

## 📊 Expected Data Flow

Here's what should happen when you submit a donation:

1. **Frontend (Browser):**
   - Form collects all data including phone & location
   - Validates all fields are filled
   - Console logs: `"Submitting donation with data:"`
   - Sends POST request to `/donate` endpoint

2. **Backend (Supabase Edge Function):**
   - Receives the request
   - Console logs: `"Received donation request body:"`
   - Validates user is logged in
   - Validates all required fields
   - Checks eligibility (age ≥18, weight ≥60)
   - Console logs: `"Storing donation:"`
   - Saves to database (only if eligible!)
   - Console logs: `"Donation stored successfully"`

3. **Database (Supabase KV Store):**
   - Stores the donation object with ALL fields
   - Key format: `donation:${userId}:${timestamp}`

4. **Retrieval (Donors Page):**
   - Frontend requests `/recent-donors`
   - Backend queries database for donations from last 7 days
   - Console logs: `"Total donations retrieved:"` and `"Sample donation:"`
   - Returns array of donor objects
   - Frontend displays each donor card

---

## 🎯 Quick Verification Checklist

Run through this checklist:

- [ ] Opened Donors page and clicked "Run Database Test"
- [ ] Read the debug panel results
- [ ] Logged in to the website
- [ ] Submitted a NEW donation with phone: "+91-9876543210" and location: "Mumbai"
- [ ] Checked browser console for "Submitting donation with data:"
- [ ] Verified console log includes contactNumber and location
- [ ] Refreshed the Donors page
- [ ] Found the new donor card (Test Donor Alpha)
- [ ] Verified phone and location are showing in colored boxes
- [ ] Clicked "View raw data" on the card to see the JSON

**If ALL steps pass but phone/location still show "not provided":**
- Take a screenshot of the debug panel results
- Take a screenshot of the browser console
- Take a screenshot of the Supabase Edge Function logs
- Review all three to identify where the data is being lost

---

## 📝 Test Data Template

Copy and paste these into the donation form for testing:

**Test Donor 1:**
- Name: Alpha Test Donor
- Age: 25
- Gender: Male
- Blood Group: O+
- Weight: 70
- Contact: +91-9876543210
- Location: Mumbai, Maharashtra

**Test Donor 2:**
- Name: Beta Test Donor  
- Age: 30
- Gender: Female
- Blood Group: A+
- Weight: 65
- Contact: +91-8765432109
- Location: Delhi, NCR

**Test Donor 3:**
- Name: Gamma Test Donor
- Age: 28
- Gender: Other
- Blood Group: B+
- Weight: 75
- Contact: +91-7654321098
- Location: Bangalore, Karnataka

---

## 🆘 Still Not Working?

If you've followed all steps and it's still not working:

1. **Check you met eligibility criteria:**
   - Age must be ≥ 18 years
   - Weight must be ≥ 60 kg
   - **Ineligible donations are NOT saved to database!**

2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Select "Cached images and files"
   - Select "All time"
   - Click "Clear data"

3. **Check Supabase project status:**
   - Go to Supabase Dashboard
   - Check if project is active
   - Check if Edge Functions are deployed

4. **Redeploy the backend:**
   - Sometimes Edge Functions need redeployment
   - Contact your developer or check deployment status

---

## 💡 Understanding the Debug Panel

The Database Debug Panel shows you:

1. **Total Donors Found** - How many eligible donations from the last 7 days
2. **Contact Info Status** - Whether ANY donor has phone & location
3. **Donor Details** - Lists each donor with their phone/location status
4. **Raw JSON Data** - Shows exactly what's in the database

Use this to immediately identify:
- ✅ Everything working (old donors just don't have fields)
- ❌ New donors missing fields (data not being saved)
- ❌ No donors at all (need to submit one)
