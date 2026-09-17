import express from 'express';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // OAuth Setup
  const getOAuthClient = (req: express.Request) => {
    // Determine redirect URI based on host
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const redirectUri = `${protocol}://${host}/auth/callback`;
    
    return new google.auth.OAuth2(
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      redirectUri
    );
  };

  app.get('/api/auth/url', (req, res) => {
    const oauth2Client = getOAuthClient(req);
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/keep',
      'https://www.googleapis.com/auth/keep.readonly',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/drive.metadata.readonly'
    ];
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
    res.json({ url });
  });

  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.status(400).send('Missing code');
    }
    
    try {
      const oauth2Client = getOAuthClient(req);
      const { tokens } = await oauth2Client.getToken(code);
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  tokens: ${JSON.stringify(tokens)} 
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('OAuth Error:', error);
      res.status(500).send('Authentication failed');
    }
  });

  // Gmail API Route
  app.post('/api/gmail/messages', async (req, res) => {
    const { tokens } = req.body;
    if (!tokens) {
      return res.status(401).json({ error: 'No tokens provided' });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET
      );
      oauth2Client.setCredentials(tokens);

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 10,
      });

      const messages = response.data.messages || [];
      const detailedMessages = await Promise.all(
        messages.map(async (msg) => {
          const msgDetails = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id!,
            format: 'metadata',
            metadataHeaders: ['Subject', 'From', 'Date'],
          });
          
          const headers = msgDetails.data.payload?.headers || [];
          const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
          const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
          const date = headers.find(h => h.name === 'Date')?.value || '';

          return {
            id: msg.id,
            snippet: msgDetails.data.snippet,
            subject,
            from,
            date
          };
        })
      );

      res.json({ messages: detailedMessages });
    } catch (error) {
      console.error('Gmail API Error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  // Gmail Send Email
  app.post('/api/gmail/send', async (req, res) => {
    const { tokens, to, subject, body } = req.body;
    if (!tokens) {
      return res.status(401).json({ error: 'No tokens provided' });
    }
    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'Missing to, subject, or body' });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET
      );
      oauth2Client.setCredentials(tokens);

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
      
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        body,
      ];
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const sent = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      res.json({ message: 'Email sent successfully', data: sent.data });
    } catch (error: any) {
      console.error('Gmail Send Error:', error);
      res.status(500).json({ error: error.message || 'Failed to send email' });
    }
  });

  // Drive Files List
  app.post('/api/drive/files', async (req, res) => {
    const { tokens } = req.body;
    if (!tokens) {
      return res.status(401).json({ error: 'No tokens provided' });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET
      );
      oauth2Client.setCredentials(tokens);

      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      const response = await drive.files.list({
        pageSize: 15,
        fields: 'files(id, name, mimeType, webViewLink, iconLink, modifiedTime, size)',
        orderBy: 'modifiedTime desc'
      });

      res.json({ files: response.data.files || [] });
    } catch (error: any) {
      console.error('Drive API List Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch files from Drive' });
    }
  });

  // Drive Create File
  app.post('/api/drive/create', async (req, res) => {
    const { tokens, name, content, mimeType } = req.body;
    if (!tokens) {
      return res.status(401).json({ error: 'No tokens provided' });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET
      );
      oauth2Client.setCredentials(tokens);

      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      
      const fileMetadata = {
        name: name || 'Summary_Doc',
        mimeType: mimeType || 'text/plain'
      };

      const media = {
        mimeType: mimeType || 'text/plain',
        body: content || ''
      };

      const fileCreated = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink'
      });

      res.json({ file: fileCreated.data });
    } catch (error: any) {
      console.error('Drive API Create Error:', error);
      res.status(500).json({ error: error.message || 'Failed to create file' });
    }
  });

  // Keep Notes List
  app.post('/api/keep/notes', async (req, res) => {
    const { tokens } = req.body;
    if (!tokens) {
      return res.status(401).json({ error: 'No tokens provided' });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET
      );
      oauth2Client.setCredentials(tokens);

      const keep = google.keep({ version: 'v1', auth: oauth2Client });
      // Keep API usually requires organization credentials / workspace
      const response = await keep.notes.list({
        pageSize: 20
      });

      res.json({ notes: response.data.notes || [] });
    } catch (error: any) {
      console.warn('Keep API List Warn (Normal for personal accounts):', error);
      res.json({ 
        notes: [], 
        error: error.message || 'Keep API is restricted or not enabled. Usually Keep API requires a G Suite / Google Workspace administrative account.',
        isKeepUnsupported: true 
      });
    }
  });

  // Keep Notes Create
  app.post('/api/keep/create', async (req, res) => {
    const { tokens, title, body } = req.body;
    if (!tokens) {
      return res.status(401).json({ error: 'No tokens provided' });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.OAUTH_CLIENT_ID,
        process.env.OAUTH_CLIENT_SECRET
      );
      oauth2Client.setCredentials(tokens);

      const keep = google.keep({ version: 'v1', auth: oauth2Client });
      
      const newNote = await keep.notes.create({
        requestBody: {
          title: title || 'Workspace Memory',
          body: {
            text: {
              text: body || ''
            }
          }
        }
      });

      res.json({ note: newNote.data });
    } catch (error: any) {
      console.warn('Keep API Create Warn (Normal for personal accounts):', error);
      res.status(500).json({ 
        error: error.message || 'Keep API is restricted or not enabled. Note kept in local app session instead.',
        isKeepUnsupported: true 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
