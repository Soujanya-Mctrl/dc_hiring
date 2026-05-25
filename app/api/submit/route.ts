import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🚀 [SUBMIT API] Request received');
    
    // Check environment variables FIRST
    console.log('🔐 [SUBMIT API] Checking environment variables...');
    const missingVars = [];
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missingVars.push('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY');
    if (!process.env.GOOGLE_SHEET_ID) missingVars.push('GOOGLE_SHEET_ID');
    
    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars);
      return NextResponse.json(
        { error: 'Server configuration error', details: `Missing: ${missingVars.join(', ')}` },
        { status: 500 }
      );
    }
    console.log('✅ All environment variables present');
    
    console.log('📝 Request data:', {
      fullName: body.fullName,
      email: body.email,
      country: body.country,
      hasInterests: !!body.interests,
      interestCount: body.interests?.length,
    });
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.country) {
      console.warn('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, country' },
        { status: 400 }
      );
    }
    
    console.log('✅ Basic validation passed');
    
    // 1. Initialize auth
    console.log('🔐 Initializing JWT authentication...');
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });
    console.log('✅ JWT auth initialized');

    // 2. Initialize the document
    console.log('📄 Initializing Google Spreadsheet...');
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    
    // 3. Load doc info
    await doc.loadInfo();
    
    // 4. Get the first sheet
    let sheet = doc.sheetsByIndex[0];
    console.log('📊 Sheet found. Row count:', sheet.rowCount);
    
    // 5. Load header row first (required before accessing headerValues)
    await sheet.loadHeaderRow();
    console.log('📊 Current headers:', sheet.headerValues);
    
    // 6. Set up headers if they don't exist
    const headerRow = [
        'Timestamp',
        'Full Name',
        'Email',
        'Country',
        'City',
        'Discord',
        'Twitter',
        'Interests',
        'Familiarity Level',
        'What Excites You',
        'Why Join',
        'Something Proud Of',
        'Project Link',
        'Time Commitment',
    ];
    
    // Check if headers are empty - if so, set them
    if (!sheet.headerValues || sheet.headerValues.length === 0) {
        console.log('📝 No headers found, setting headers now...');
        await sheet.setHeaderRow(headerRow);
        console.log('✅ Headers set successfully');
        // Reload after setting headers
        await sheet.loadHeaderRow();
    } else {
        console.log('✅ Headers already exist');
    }
    
    console.log('📊 Final headers:', sheet.headerValues);
    
    // 7. Prepare and append the row with all fields
    const newRow = {
        'Timestamp': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        'Full Name': body.fullName || '',
        'Email': body.email || '',
        'Country': body.country || '',
        'City': body.city || '',
        'Discord': body.discord || '',
        'Twitter': body.twitter || '',
        'Interests': body.interests ? body.interests.join(', ') : '',
        'Familiarity Level': body.experience?.familiarity || '',
        'What Excites You': body.experience?.excites || '',
        'Why Join': body.experience?.whyJoin || '',
        'Something Proud Of': body.contribution?.proud || '',
        'Project Link': body.contribution?.link || '',
        'Time Commitment': body.contribution?.timeCommit || '',
    };

    console.log('📤 Adding row with data:', Object.keys(newRow));
    await sheet.addRow(newRow);
    console.log('✅ Row added successfully');

    // 8. Send confirmation email
    if (body.email) {
        console.log('📧 Attempting to send confirmation email...');
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_PORT === '465',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `"Hiring Team" <${process.env.SMTP_USER}>`,
                to: body.email,
                subject: 'Interview Confirmation',
                text: 'Look forward to your interview and your slot will be sent in due time.',
                html: '<p>Look forward to your interview and your slot will be sent in due time.</p>',
            });
            console.log('✅ Email sent successfully');
        } catch (emailError: any) {
            console.warn('⚠️ Email failed (continuing anyway):', emailError.message);
        }
    }

    console.log('🎉 Application submitted successfully!');
    return NextResponse.json({ success: true, message: 'Data saved successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('❌ ERROR in submit API:', error.message);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Failed to save data', details: error.message },
      { status: 500 }
    );
  }
}
