import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🚀 [SUBMIT API] Request received');
    console.log('📋 Full request body structure:');
    console.log(JSON.stringify(body, null, 2));
    
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
      location: body.location,
      accommodation: body.accommodation,
      hasInterests: !!body.interests,
      interestCount: body.interests?.length,
      otherInterest: body.otherInterest,
      developmentSelections: body.developmentSelections,
    });
    
    // Validate required fields
    if (!body.fullName || !body.email || !body.location || !body.accommodation) {
      console.warn('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, location, accommodation' },
        { status: 400 }
      );
    }

    // Resume required
    if (!body.resumeFilename || !body.resumeBase64) {
      console.warn('❌ Validation failed: Missing resume');
      return NextResponse.json(
        { error: 'Missing required field: resume (resumeFilename and resumeBase64)' },
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
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.metadata',
      ],
    });
    console.log('✅ JWT auth initialized');

    // 2. Initialize the document
    console.log('📄 Initializing Google Spreadsheet with ID:', process.env.GOOGLE_SHEET_ID);
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
    
    // 3. Load doc info
    await doc.loadInfo();
    console.log('📄 Spreadsheet loaded. Title:', doc.title);
    console.log('📄 Total sheets in this spreadsheet:', doc.sheetsByIndex.length);
    doc.sheetsByIndex.forEach((s: any, idx: number) => {
      console.log(`  Sheet ${idx}: "${s.title}" (${s.rowCount} rows)`);
    });
    
    // 4. Get the first sheet or create one if it does not exist yet
    let sheet = doc.sheetsByIndex[0];
    if (!sheet) {
      console.warn('⚠️ No worksheet found, creating Responses sheet...');
      sheet = await doc.addSheet({ title: 'Responses' });
      console.log('✅ Worksheet created');
      await doc.loadInfo();
    }
    console.log('📊 Using sheet:', sheet.title);
    console.log('📊 Sheet ID:', sheet.sheetId);
    console.log('📊 Current row count:', sheet.rowCount);

    // 5. Set up headers if they don't exist yet
    const headerRow = [
        'fullName',
        'email',
      'location',
      'accommodation',
        'discord',
        'twitter',
        'interests',
        'otherInterest',
        'developmentSelections',
        'resumeFilename',
        'resumeFileId',
        'resumeLink',
        'familiarity',
        'excites',
        'whyJoin',
        'proud',
        'timeCommit',
    ];
    
    let headersLoaded = false;

    try {
      await sheet.loadHeaderRow();
      headersLoaded = true;
      console.log('📊 Current headers:', sheet.headerValues);
    } catch (headerError: any) {
      console.warn('⚠️ Header row not loaded yet:', headerError.message);
    }

    if (!headersLoaded || !sheet.headerValues || sheet.headerValues.length === 0) {
      console.log('📝 No headers found, setting headers now...');
        await sheet.setHeaderRow(headerRow);
        console.log('✅ Headers set successfully');
        // Reload after setting headers
        await sheet.loadHeaderRow();
      console.log('📊 Reloaded headers:', sheet.headerValues);
    } else {
        console.log('✅ Headers already exist');
    }

    console.log('📊 Final headers:', sheet.headerValues);
    
    // 7. If a resume was provided, upload to Drive
    let resumeFileId = '';
    let resumeLink = '';

    if (body.resumeBase64 && body.resumeFilename) {
      try {
        console.log('📁 Uploading resume to Drive...');
        const driveAuth = new JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
          key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.metadata'],
        });

        const { access_token } = await driveAuth.authorize();
        if (!access_token) {
          throw new Error('Unable to acquire Google Drive access token');
        }

        const buffer = Buffer.from(body.resumeBase64, 'base64');

        const boundary = 'dc-hiring-resume-upload-boundary';
        const metadata = {
          name: body.resumeFilename,
          parents: process.env.DRIVE_FOLDER_ID ? [process.env.DRIVE_FOLDER_ID] : undefined,
        };

        const multipartBody = Buffer.concat([
          Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`),
          Buffer.from(JSON.stringify(metadata)),
          Buffer.from(`\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`),
          buffer,
          Buffer.from(`\r\n--${boundary}--`),
        ]);

        const uploadResponse = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': `multipart/related; boundary=${boundary}`,
            },
            body: multipartBody,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(`Drive upload failed: ${uploadResponse.status} ${await uploadResponse.text()}`);
        }

        const createRes = await uploadResponse.json();
        resumeFileId = createRes.id || '';
        resumeLink = createRes.webViewLink || createRes.webContentLink || '';
        console.log('✅ Resume uploaded to Drive:', resumeFileId, resumeLink);
      } catch (driveError: any) {
        console.warn('⚠️ Drive upload failed (continuing):', driveError.message);
      }
    }

    // 8. Prepare and append the row with all fields
    const newRow = {
        'fullName': body.fullName || '',
        'email': body.email || '',
      'location': body.location || '',
      'accommodation': body.accommodation || '',
        'discord': body.discord || '',
        'twitter': body.twitter || '',
        'interests': body.interests ? body.interests.join(', ') : '',
        'otherInterest': body.otherInterest || '',
        'developmentSelections': Array.isArray(body.developmentSelections) ? body.developmentSelections.join(', ') : '',
        'resumeFilename': body.resumeFilename || '',
        'resumeFileId': resumeFileId,
        'resumeLink': resumeLink,
        'familiarity': body.experience?.familiarity || '',
        'excites': body.experience?.excites || '',
        'whyJoin': body.experience?.whyJoin || '',
        'proud': body.contribution?.proud || '',
        'timeCommit': body.contribution?.timeCommit || '',
    };

    console.log('📤 Adding row with data:', Object.keys(newRow));
    console.log('📤 Row data:', newRow);
    
    // addRow is the correct method in google-spreadsheet. If insert: true is needed, we can try it.
    const addedRow = await sheet.addRow(newRow);
    console.log(`✅ Row added successfully to row index: ${addedRow.rowNumber}`);
    
    // Read back the last few rows to verify where the data went
    const rows = await sheet.getRows({ limit: 5, offset: Math.max(0, addedRow.rowNumber - 5) });
    console.log('🔄 Data verification - recent rows content:', rows.map(r => r.toObject()));

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
                attachments: body.resumeBase64 && body.resumeFilename ? [
                  { filename: body.resumeFilename, content: Buffer.from(body.resumeBase64, 'base64'), contentType: 'application/pdf' }
                ] : undefined,
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
