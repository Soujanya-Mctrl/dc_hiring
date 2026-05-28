import { google } from 'googleapis';
import type { OAuth2Client } from 'google-auth-library';
import { Readable } from 'stream';

export type DriveUploadInput = {
  auth: OAuth2Client;
  folderId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
};

function normalizeDriveError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown Google Drive error';
}

export async function uploadFileToDrive({ auth, folderId, fileName, mimeType, buffer }: DriveUploadInput) {
  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured');
  }

  if (!fileName) {
    throw new Error('Missing file name for Google Drive upload');
  }

  if (!buffer || buffer.length === 0) {
    throw new Error('Missing file content for Google Drive upload');
  }

  const drive = google.drive({ version: 'v3', auth });

  const folderResponse = await drive.files.get({
    fileId: folderId,
    fields: 'id, name, mimeType, driveId, capabilities(canAddChildren, canEdit)',
    supportsAllDrives: true,
  });

  const folder = folderResponse.data;

  console.log('📂 Google Drive folder metadata:', {
    id: folder.id,
    name: folder.name,
    mimeType: folder.mimeType,
    driveId: folder.driveId,
    canAddChildren: folder.capabilities?.canAddChildren,
    canEdit: folder.capabilities?.canEdit,
  });

  if (folder.mimeType !== 'application/vnd.google-apps.folder') {
    throw new Error(`Target ID ${folderId} is not a folder`);
  }

  const uploadResponse = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: 'id, name, webViewLink, webContentLink',
    supportsAllDrives: true,
    enforceSingleParent: true,
  });

  const fileId = uploadResponse.data.id;

  if (!fileId) {
    throw new Error('Drive upload completed but no file ID was returned');
  }

  try {
    await drive.permissions.create({
      fileId,
      supportsAllDrives: true,
      requestBody: {
        type: 'anyone',
        role: 'reader',
        allowFileDiscovery: false,
      },
    });
  } catch (permissionError) {
    console.error('❌ Drive permission error:', normalizeDriveError(permissionError));

    try {
      await drive.files.delete({ fileId, supportsAllDrives: true });
    } catch (cleanupError) {
      console.error('❌ Failed to clean up partially uploaded Drive file:', normalizeDriveError(cleanupError));
    }

    throw new Error(`Drive permission update failed: ${normalizeDriveError(permissionError)}`);
  }

  const fileResponse = await drive.files.get({
    fileId,
    supportsAllDrives: true,
    fields: 'id, name, webViewLink, webContentLink',
  });

  const publicUrl =
    fileResponse.data.webViewLink ||
    fileResponse.data.webContentLink ||
    `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;

  return {
    fileId,
    fileName: fileResponse.data.name || fileName,
    publicUrl,
  };
}
