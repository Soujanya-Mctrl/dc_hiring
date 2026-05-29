import { NextResponse } from 'next/server';
import { getAuthorizedGoogleClient, isGoogleOAuthConfigured } from '@/lib/google';
import { uploadFileToDrive } from '@/lib/drive';
import { appendSubmissionRow, getPrimarySheetTitle, ensureSheetHeaders, SHEET_HEADERS } from '@/lib/sheets';
import { buildSubmissionRow, parseSubmissionRequest } from '@/lib/submission';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSpreadsheetId() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID is not configured');
  }

  return spreadsheetId;
}

function getDriveFolderId() {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
  }

  return folderId;
}

export async function POST(request: Request) {
  try {
    if (!isGoogleOAuthConfigured()) {
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details:
            'Missing Google OAuth configuration. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, and GOOGLE_REFRESH_TOKEN.',
        },
        { status: 500 }
      );
    }

    const submission = await parseSubmissionRequest(request);
    const spreadsheetId = getSpreadsheetId();
    const googleClient = getAuthorizedGoogleClient();
    const { sheetTitle } = await getPrimarySheetTitle(googleClient, spreadsheetId);

    console.log('🚀 [SUBMIT API] Submission received:', {
      fullName: submission.fullName,
      email: submission.email,
      hasResume: Boolean(submission.resumeFile || submission.resumeBase64),
      contentType: request.headers.get('content-type') || 'unknown',
    });

    await ensureSheetHeaders(googleClient, spreadsheetId, sheetTitle, SHEET_HEADERS);

    if (!submission.resumeFile && !submission.resumeBase64) {
      return NextResponse.json(
        { error: 'Missing required field: resume', details: 'Provide resumeFile or resumeBase64' },
        { status: 400 }
      );
    }

    if (submission.resumeFile && submission.resumeFile.size === 0) {
      return NextResponse.json(
        { error: 'Invalid resume file', details: 'The uploaded file is empty' },
        { status: 400 }
      );
    }

    if (submission.resumeFile && submission.resumeFile.type && submission.resumeFile.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid resume file', details: 'Only PDF resumes are accepted' },
        { status: 400 }
      );
    }

    let driveFileId = '';
    let driveLink = '';
    let fileName = submission.fileName || submission.resumeFilename || '';

    if (submission.resumeFile || submission.resumeBase64) {
      try {
        const uploadResult = await uploadFileToDrive({
          auth: googleClient,
          folderId: getDriveFolderId(),
          fileName: fileName || submission.resumeFilename || 'resume.pdf',
          mimeType: submission.resumeFile?.type || 'application/pdf',
          buffer: submission.resumeFile
            ? Buffer.from(await submission.resumeFile.arrayBuffer())
            : Buffer.from(submission.resumeBase64 || '', 'base64'),
        });

        driveFileId = uploadResult.fileId;
        driveLink = uploadResult.publicUrl;
        fileName = uploadResult.fileName;

        console.log('✅ Drive upload completed:', { driveFileId, driveLink, fileName });
      } catch (driveError: any) {
        console.warn('⚠️ Drive upload failed (continuing with Sheets save):', driveError.message);
      }
    }

    const row = buildSubmissionRow(submission, {
      fileName,
      driveLink,
    });

    await appendSubmissionRow({
      auth: googleClient,
      spreadsheetId,
      sheetTitle,
      headers: SHEET_HEADERS,
      row,
    });

    console.log('✅ Row written to Google Sheets successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Submission saved successfully',
        driveUploaded: Boolean(driveLink),
        driveFileId,
        driveLink,
        fileName,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ ERROR in submit API:', error.message);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Failed to save data', details: error.message },
      { status: 500 }
    );
  }
}