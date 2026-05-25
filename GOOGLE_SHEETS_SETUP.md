# Google Sheets Integration Setup Guide

This guide will help you connect your DC Hiring application to Google Sheets to store all form responses automatically.

## Prerequisites

- Google Account
- Node.js and npm installed
- Your application running locally or on a server

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the **Project dropdown** at the top
3. Click **"NEW PROJECT"**
4. Enter:
   - **Project Name**: `DC Hiring`
   - **Location**: (optional)
5. Click **"CREATE"**
6. Wait for the project to be created (may take a minute)
7. Once created, select it from the dropdown

---

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, search for **"Google Sheets API"** in the search bar at the top
2. Click on "Google Sheets API" from the results
3. Click the **"ENABLE"** button
4. Wait for it to enable - you should see a message confirming it's enabled
5. Also enable **"Google Drive API"** by searching for it and clicking ENABLE

---

## Step 3: Create Service Account & Download Credentials

1. In the Google Cloud Console, go to **"IAM & Admin"** → **"Service Accounts"**
   - Or search for "Service Accounts" in the search bar
2. Click **"CREATE SERVICE ACCOUNT"**
3. Fill in:
   - **Service account name**: `dc-hiring-bot`
   - **Service account ID**: (auto-filled, keep as is)
   - **Description**: (optional) `Bot for storing DC Hiring responses`
4. Click **"CREATE AND CONTINUE"**
5. Skip the optional permission steps - just click **"CONTINUE"** then **"DONE"**
6. You're now back at the Service Accounts list
7. Click on the **`dc-hiring-bot`** service account you just created
8. Go to the **"KEYS"** tab
9. Click **"ADD KEY"** → **"Create new key"**
10. Choose **"JSON"** and click **"CREATE"**
11. A JSON file will download automatically - **save this securely**
12. Open the JSON file and copy:
    - `"client_email"` value
    - `"private_key"` value (the entire string including `\n`)
    - `"project_id"` value (optional, for reference)

---

## Step 4: Create Google Sheet & Share with Service Account

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** → **"Blank spreadsheet"**
3. Name it: `DC Hiring Responses`
4. The sheet will open - you should see an empty spreadsheet
5. **Share with Service Account:**
   - Click the **"Share"** button (top right)
   - In the email field, paste the service account email from your JSON file
   - Example: `dc-hiring-bot@PROJECT_ID.iam.gserviceaccount.com`
   - Select **"Editor"** access
   - Click **"Share"** (uncheck "Notify people" as it's a bot)
6. **Get Sheet ID:**
   - Look at your browser URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`
   - Copy the long string between `/d/` and `/edit` - this is your **SHEET_ID**
   - Save it somewhere

---

## Step 5: Configure Environment Variables

1. In your project root, create or open `.env.local`
2. Add the following variables:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=YOUR_SHEET_ID_HERE
GOOGLE_SERVICE_ACCOUNT_EMAIL=dc-hiring-bot@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"

# Email Configuration (for confirmation emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**How to fill in these values:**

- **GOOGLE_SHEET_ID**: The string you copied from the URL in Step 4
- **GOOGLE_SERVICE_ACCOUNT_EMAIL**: From the JSON file, the `"client_email"` value
- **GOOGLE_PRIVATE_KEY**: From the JSON file, the `"private_key"` value
  - Important: Keep the quotes and `\n` characters exactly as they appear
- **SMTP_USER**: Your Gmail address
- **SMTP_PASS**: An App-specific password (see below)

### Getting Gmail App Password (for SMTP_PASS)

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **"Security"** in the left sidebar
3. Scroll down to **"App passwords"**
4. Select **"Mail"** and **"Windows Computer"** (or your device)
5. Generate a password
6. Copy and use it as `SMTP_PASS` in `.env.local`

---

## Step 6: Install Required Packages

Run this command in your project directory:

```bash
npm install google-spreadsheet google-auth-library nodemailer
```

---

## Step 7: Restart Your Application

1. If your app is running, stop it (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

---

## Step 8: Test the Integration

1. Fill out the form in your application
2. Click "Submit Application"
3. Check your Google Sheet - a new row should appear with all the data!
4. You should receive a confirmation email at the email address you provided

---

## Troubleshooting

### Error: "Google Sheet ID is not configured"

- Check that `GOOGLE_SHEET_ID` is in `.env.local`
- Restart your dev server after adding env variables

### Error: "Permission denied" or "Forbidden"

- Make sure you shared the Google Sheet with the service account email
- Double-check the email address is correct
- Wait a minute for permissions to propagate

### Error: "Invalid authentication"

- Verify `GOOGLE_PRIVATE_KEY` has the newlines (`\n`) preserved
- Check that `GOOGLE_SERVICE_ACCOUNT_EMAIL` is correct
- Ensure the JSON file hasn't been modified

### Data not appearing in Google Sheets

- Check the browser console for errors
- Check your terminal logs for backend errors
- Verify the sheet name is correct in the API code

### Email not sending

- This is optional - the form will still work
- Check SMTP credentials are correct
- Make sure you used an App-specific password (not your regular password)

---

## What Happens Now

When a user submits the form:

1. ✅ All form data is validated in the frontend
2. ✅ Data is sent to your backend API (`/api/submit`)
3. ✅ Backend authenticates with Google Sheets using the service account
4. ✅ A new row is added to your Google Sheet with:
   - Timestamp
   - Full Name
   - Email
   - Country & City
   - Discord & Twitter handles
   - Selected interests
   - Experience level & responses
   - Time commitment
5. ✅ A confirmation email is sent to the user
6. ✅ Success response is sent back to the frontend

---

## Google Sheet Structure

Your Google Sheet will automatically have these columns:

| Timestamp | Full Name | Email | Country | City | Discord | Twitter | Interests | Familiarity Level | What Excites You | Why Join | Something Proud Of | Time Commitment |
| --------- | --------- | ----- | ------- | ---- | ------- | ------- | --------- | ----------------- | ---------------- | -------- | ------------------ | --------------- |

Each form submission creates a new row.

---

## Additional Features

### Access Sheet Programmatically

You can also access and manage the sheet from other applications:

- Download responses as CSV
- Create charts and analytics
- Set up notifications for new submissions
- Integrate with other tools (Zapier, Make.com, etc.)

### Backup Your Data

Google Sheets automatically backs up your data, but you can also:

- Download as Excel/CSV regularly
- Set up a scheduled backup using Google Sheets API

---

## Security Notes

⚠️ **Important:**

- Never commit `.env.local` to Git - add it to `.gitignore`
- Don't share your `GOOGLE_PRIVATE_KEY` or JSON file publicly
- Keep the service account JSON file secure
- Rotate credentials periodically for production apps

---

For more information:

- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [google-spreadsheet NPM Package](https://www.npmjs.com/package/google-spreadsheet)
