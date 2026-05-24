import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Initialize auth
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    if (!process.env.GOOGLE_SHEET_ID) {
        return NextResponse.json(
            { error: 'Google Sheet ID is not configured.' },
            { status: 500 }
        );
    }

    // 2. Initialize the document
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
    
    // 3. Load doc info
    await doc.loadInfo();
    
    // 4. Get the first sheet
    const sheet = doc.sheetsByIndex[0];
    
    // 5. Append the row
    // We map the incoming JSON body to columns. 
    // This assumes the sheet has headers matching these keys, or we just append values in order.
    // Ensure your Google Sheet has headers like "Name", "Email", "About", "Interests", "Experience", "Contribution"
    
    const newRow = {
        Timestamp: new Date().toISOString(),
        About: body.about || '',
        Interests: body.interests ? body.interests.join(', ') : '',
        Experience: body.experience || '',
        Contribution: body.contribution || '',
        // You can add more fields here if the form sends them
        Name: body.name || '',
        Email: body.email || '',
    };

    await sheet.addRow(newRow);

    // 6. Send confirmation email
    if (body.email) {
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
    }

    return NextResponse.json({ success: true, message: 'Data saved successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving to Google Sheets:', error);
    return NextResponse.json(
      { error: 'Failed to save data', details: error.message },
      { status: 500 }
    );
  }
}
