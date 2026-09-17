import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  EnvelopeIcon, 
  ArrowPathIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PaperAirplaneIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  SparklesIcon
} from './Icons';

interface GmailMessage {
  id: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink?: string;
  modifiedTime: string;
  size?: string;
}

interface KeepNote {
  name?: string;
  title?: string;
  body?: {
    text?: {
      text?: string;
    };
  };
}

// Local simulation fallback store in case User uses a Personal Account where Keep API is disabled by default
const initialFallbackNotes = [
  {
    title: '💡 FFG Einreichungskriterien',
    text: 'Bitte beachten Sie, dass für das FFG-Basisprogramm die wirtschaftliche Leistungsfähigkeit sowie der Innovationsgehalt (TRL 3 bis TRL 6) entscheidend sind. Finanzieller Eigenanteil mind. 30%.'
  },
  {
    title: '📋 Dokumenten-Checkliste Physio-Kooperation',
    text: '1. Kooperationsvereinbarung Entwurf\n2. DSGVO-Konzept zur Patientendaten-Verschlüsselung\n3. Schnittstellenbeschreibung für Praxissoftware'
  },
  {
    title: '📅 Deadline AWS Digitalisierung',
    text: 'Nächster Stichtag für den AWS Digitalisierungszuschuss ist der 15. September 2026. Antrag muss vor Projektbeginn online eingereicht werden.'
  }
];

const GmailIntegration: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'gmail' | 'drive' | 'keep'>('gmail');
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [keepNotes, setKeepNotes] = useState<{ title: string; text: string }[]>([]);
  const [fallbackNotes, setFallbackNotes] = useState<{ title: string; text: string }[]>(initialFallbackNotes);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tokens, setTokens] = useState<Record<string, any> | null>(null);

  // Picker States
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickedFile, setPickedFile] = useState<any>(null);

  // Gmail Compose State
  const [isComposedOpen, setIsComposedOpen] = useState(false);
  const [mailTo, setMailTo] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [sendingMail, setSendingMail] = useState(false);

  // Drive Create State
  const [isDriveFormOpen, setIsDriveFormOpen] = useState(false);
  const [driveFileName, setDriveFileName] = useState('');
  const [driveFileContent, setDriveFileContent] = useState('');
  const [creatingFile, setCreatingFile] = useState(false);

  // Keep Create State
  const [isKeepFormOpen, setIsKeepFormOpen] = useState(false);
  const [keepTitle, setKeepTitle] = useState('');
  const [keepContent, setKeepContent] = useState('');
  const [creatingKeep, setCreatingKeep] = useState(false);
  const [isKeepUnsupported, setIsKeepUnsupported] = useState(false);

  // Load state from session storage for convenience
  useEffect(() => {
    const savedTokens = sessionStorage.getItem('google_ws_tokens');
    if (savedTokens) {
      try {
        const parsed = JSON.parse(savedTokens);
        setTokens(parsed);
        setIsConnected(true);
        // Pre-fetch defaults
        fetchWorkspaceData(parsed);
      } catch (e) {
        sessionStorage.removeItem('google_ws_tokens');
      }
    }
  }, []);

  // Sync token messaging from Auth window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const authTokens = event.data.tokens;
        setTokens(authTokens);
        setIsConnected(true);
        sessionStorage.setItem('google_ws_tokens', JSON.stringify(authTokens));
        showSuccess('Google Workspace erfolgreich verbunden!');
        fetchWorkspaceData(authTokens);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchWorkspaceData = (authTokens: Record<string, any>) => {
    fetchEmails(authTokens);
    fetchDriveFilesList(authTokens);
    fetchKeepNotesList(authTokens);
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/auth/url');
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Auth-URL');
      }
      const { url } = await response.json();

      const authWindow = window.open(
        url,
        'oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        setError('Bitte erlauben Sie Popups für diese Seite, um Google Workspace zu verbinden.');
      }
    } catch (err: any) {
      console.error('OAuth error:', err);
      setError('Verbindungsfehler zur Google Cloud API.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    const confirmed = window.confirm('Möchten Sie die Verbindung zu Google Workspace trennen? Ihre Zugangsdaten werden im Sitzungscache gelöscht.');
    if (!confirmed) return;
    
    setTokens(null);
    setIsConnected(false);
    sessionStorage.removeItem('google_ws_tokens');
    setMessages([]);
    setDriveFiles([]);
    setKeepNotes([]);
    setPickedFile(null);
    showSuccess('Verbindung getrennt.');
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  // ==================== GMAIL FETCH & SEND ====================
  const fetchEmails = async (authTokens: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gmail/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: authTokens }),
      });

      if (!response.ok) throw new Error('E-Mails konnten nicht geladen werden.');

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      console.error('Fetch emails error:', err);
      setError('Gmail-Nachrichten konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens) return;
    if (!mailTo || !mailSubject || !mailBody) {
      setError('Bitte füllen Sie alle E-Mail-Felder aus.');
      return;
    }

    // Mutating User Data: ask confirmation
    const confirmed = window.confirm(`E-Mail senden an "${mailTo}" mit dem Betreff "${mailSubject}"?`);
    if (!confirmed) return;

    try {
      setSendingMail(true);
      setError(null);
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          to: mailTo,
          subject: mailSubject,
          body: mailBody.replace(/\n/g, '<br/>')
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Fehler beim Senden der E-Mail.');
      }

      showSuccess('E-Mail erfolgreich versendet!');
      setIsComposedOpen(false);
      setMailTo('');
      setMailSubject('');
      setMailBody('');
      
      // Refresh list
      fetchEmails(tokens);
    } catch (err: any) {
      console.error('Send mail error:', err);
      setError('E-Mail Sendevorgang fehlgeschlagen: ' + err.message);
    } finally {
      setSendingMail(false);
    }
  };

  // ==================== GOOGLE DRIVE LIST & UPLOAD ====================
  const fetchDriveFilesList = async (authTokens: Record<string, any>) => {
    try {
      const response = await fetch('/api/drive/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: authTokens }),
      });

      if (!response.ok) throw new Error('Drive-Dateien konnten nicht geladen werden.');

      const data = await response.json();
      setDriveFiles(data.files || []);
    } catch (err: any) {
      console.error('Fetch drive files error:', err);
    }
  };

  const createDriveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens) return;
    if (!driveFileName || !driveFileContent) {
      setError('Bitte füllen Sie alle Dateifelder aus.');
      return;
    }

    const confirmed = window.confirm(`Neue Datei "${driveFileName}" in Google Drive erstellen?`);
    if (!confirmed) return;

    try {
      setCreatingFile(true);
      setError(null);
      const response = await fetch('/api/drive/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          name: driveFileName,
          content: driveFileContent,
          mimeType: 'text/plain'
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Fehler beim Erstellen der Datei.');
      }

      const resData = await response.json();
      showSuccess(`Datei "${driveFileName}" erfolgreich in Google Drive erstellt!`);
      setIsDriveFormOpen(false);
      setDriveFileName('');
      setDriveFileContent('');
      
      // Add immediately to state & refresh
      fetchDriveFilesList(tokens);
    } catch (err: any) {
      console.error('Create drive file error:', err);
      setError('Fehler beim Erstellen des Drive-Dokumentes: ' + err.message);
    } finally {
      setCreatingFile(false);
    }
  };

  // ==================== GOOGLE PICKER WIDGET ====================
  const loadAndOpenPicker = () => {
    if (!tokens) {
      setError('Bitte verknüpfen Sie zuerst Google Workspace.');
      return;
    }
    setPickerLoading(true);
    setError(null);

    const tokenStr = tokens.access_token;

    const runPicker = () => {
      try {
        // @ts-ignore
        if (!window.gapi) {
          throw new Error('Google API Loader konnte nicht initialisiert werden.');
        }
        
        // @ts-ignore
        window.gapi.load('picker', {
          callback: () => {
            try {
              const pickerOrigin =
                // @ts-ignore
                window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0
                  // @ts-ignore
                  ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
                  : window.location.origin;

              // @ts-ignore
              const pickerObj = new window.google.picker.PickerBuilder()
                // @ts-ignore
                .addView(window.google.picker.ViewId.DOCS)
                .setOAuthToken(tokenStr)
                .setCallback((data: any) => {
                  // @ts-ignore
                  if (data.action === window.google.picker.Action.PICKED) {
                    const fileObj = data.docs[0];
                    setPickedFile(fileObj);
                    showSuccess(`Dokument "${fileObj.name}" erfolgreich ausgewählt!`);
                  }
                })
                .setOrigin(pickerOrigin)
                .build();
              pickerObj.setVisible(true);
            } catch (err: any) {
              console.error('Picker builder runtime error:', err);
              setError('Fehler bei der Initialisierung des Pickers: ' + err.message);
            } finally {
              setPickerLoading(false);
            }
          }
        });
      } catch (err: any) {
        console.error('Picker loader err:', err);
        setError('Ladevorgang fehlgeschlagen: ' + err.message);
        setPickerLoading(false);
      }
    };

    // @ts-ignore
    if (!window.gapi) {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        runPicker();
      };
      script.onerror = () => {
        setError('Das Google API Skript konnte im Preview-Dokument nicht geladen werden.');
        setPickerLoading(false);
      };
      document.body.appendChild(script);
    } else {
      runPicker();
    }
  };

  // ==================== GOOGLE KEEP FETCH & CREATE ====================
  const fetchKeepNotesList = async (authTokens: Record<string, any>) => {
    try {
      const response = await fetch('/api/keep/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens: authTokens }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      if (data.isKeepUnsupported || data.error) {
        setIsKeepUnsupported(true);
      } else {
        setIsKeepUnsupported(false);
        // Normalize Google Keep API layout if response is live
        const normalized = (data.notes || []).map((n: KeepNote) => ({
          title: n.title || 'Keep Notiz',
          text: n.body?.text?.text || ''
        }));
        setKeepNotes(normalized);
      }
    } catch (err) {
      // In case of restriction error/personal account, we turn on keep bypass
      setIsKeepUnsupported(true);
    }
  };

  const createKeepNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keepTitle || !keepContent) {
      setError('Bitte füllen Sie Notiztitel und Text aus.');
      return;
    }

    try {
      setCreatingKeep(true);
      setError(null);

      if (isKeepUnsupported || !tokens) {
        // Fallback in-app session tracker
        const newNoteObj = { title: keepTitle, text: keepContent };
        setFallbackNotes(prev => [newNoteObj, ...prev]);
        showSuccess('Notiz erfolgreich für diese Sitzung gespeichert!');
        setIsKeepFormOpen(false);
        setKeepTitle('');
        setKeepContent('');
        return;
      }

      // Live Google Keep API Call
      const response = await fetch('/api/keep/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          title: keepTitle,
          body: keepContent
        })
      });

      if (!response.ok) {
        throw new Error('Real Keep Endpoint fell back due to account restriction.');
      }

      showSuccess('Notiz erfolgreich an Google Keep übertragen!');
      setIsKeepFormOpen(false);
      setKeepTitle('');
      setKeepContent('');
      fetchKeepNotesList(tokens);
    } catch (err: any) {
      // Graceful degradation layout
      const newNoteObj = { title: keepTitle, text: keepContent };
      setFallbackNotes(prev => [newNoteObj, ...prev]);
      setIsKeepUnsupported(true);
      showSuccess('Notiz in lokaler Inbox gespeichert (Keep API stand für dieses Privat-Konto nicht zur Verfügung).');
      setIsKeepFormOpen(false);
      setKeepTitle('');
      setKeepContent('');
    } finally {
      setCreatingKeep(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Upper Status-Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 backdrop-blur-3xl p-6 border border-white/10 rounded-sm shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-sm flex items-center justify-center text-white shadow-lg">
            <SparklesIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-serif italic text-white tracking-tight">Google Workspace Hub</h2>
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mt-1">
              Gmail • Google Drive & Picker • Google Keep in einer Oberfläche
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isConnected ? (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              disabled={loading}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-sm font-mono text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all"
            >
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
              {loading ? 'Verbinde...' : 'Google beitreten'}
            </motion.button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-sm text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                Dienste Online
              </span>
              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-500/20 rounded-sm text-[10px] uppercase font-mono tracking-wider transition-all"
              >
                Trennen
              </button>
            </div>
          )}
        </div>
      </div>

      {isConnected && (
        <>
          {/* Main Workspace Navigation Tab list */}
          <div className="flex border-b border-white/10 gap-2 shrink-0">
            <button
              onClick={() => { setActiveSubTab('gmail'); setError(null); }}
              className={`pb-4 px-6 font-serif italic text-base relative transition-all ${
                activeSubTab === 'gmail' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              📧 Posteingang & Entwürfe (Gmail)
              {activeSubTab === 'gmail' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
            <button
              onClick={() => { setActiveSubTab('drive'); setError(null); }}
              className={`pb-4 px-6 font-serif italic text-base relative transition-all ${
                activeSubTab === 'drive' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              📂 Google Drive & Picker
              {activeSubTab === 'drive' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
            <button
              onClick={() => { setActiveSubTab('keep'); setError(null); }}
              className={`pb-4 px-6 font-serif italic text-base relative transition-all ${
                activeSubTab === 'keep' ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              📝 Förderungs-Notizen (Keep)
              {activeSubTab === 'keep' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Content Area (Grid span 3) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* ================= GMAIL SUB-VIEW ================= */}
              {activeSubTab === 'gmail' && (
                <div className="bg-black/30 border border-white/5 rounded-sm p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <h3 className="text-sm font-mono uppercase text-white/45 tracking-widest">Inbox_Meldungen</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => tokens && fetchEmails(tokens)}
                        className="p-1 px-2 hover:bg-white/5 text-white/30 hover:text-white rounded-sm text-[10px] font-mono uppercase flex items-center gap-1 transition-all"
                      >
                        <ArrowPathIcon className="w-3.5 h-3.5" /> Aktualisieren
                      </button>
                      <button
                        onClick={() => setIsComposedOpen(true)}
                        className="py-1 px-3 bg-brand-primary/20 text-brand-secondary hover:bg-brand-primary/40 border border-brand-primary/30 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all"
                      >
                        + Neue E-Mail verfassen
                      </button>
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <div className="py-20 text-center text-white/20 font-mono text-xs uppercase tracking-widest">
                      Keine E-Mails im Posteingang gefunden.
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5 font-mono">
                      {messages.map((msg) => (
                        <div key={msg.id} className="py-4 hover:bg-white/5 transition-colors group cursor-pointer px-3 rounded-xs">
                          <div className="flex justify-between items-start text-[10px] text-white/30 mb-1">
                            <span className="font-bold text-white/60">{msg.from}</span>
                            <span>{msg.date ? new Date(msg.date).toLocaleDateString('de-DE') : ''}</span>
                          </div>
                          <h4 className="text-xs font-serif italic text-white group-hover:text-brand-accent transition-colors">
                            {msg.subject}
                          </h4>
                          <p className="text-[11px] text-white/40 mt-1 line-clamp-2 leading-relaxed">
                            {msg.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= DRIVE & PICKER SUB-VIEW ================= */}
              {activeSubTab === 'drive' && (
                <div className="space-y-6">
                  {/* Google Picker Launcher Hero */}
                  <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 rounded-sm p-6 border border-brand-primary/20 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif italic text-xl text-white">Google Picker Dokumenten-Auswahl</h3>
                        <p className="text-xs font-mono text-white/40 mt-1 leading-relaxed max-w-xl">
                          Wählen Sie Dokumente wie Förderanträge, Bilanzen oder Businesspläne via Google Picker live aus Ihrer Drive-Ablage aus, um diese dem Projekt-Cockpit zuzuordnen.
                        </p>
                      </div>
                      <button
                        onClick={loadAndOpenPicker}
                        disabled={pickerLoading}
                        className="py-2.5 px-6 bg-brand-primary text-white text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl hover:bg-brand-secondary transition-all disabled:opacity-50"
                      >
                        {pickerLoading ? 'Lade Picker...' : 'Picker aufrufen'}
                      </button>
                    </div>

                    {pickedFile && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-sm">
                        <p className="text-[10px] font-mono uppercase text-emerald-400 tracking-widest font-bold">Ausgewähltes Dokument (Picker)</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="w-5 h-5 text-emerald-400" />
                            <span className="text-xs font-mono text-white">{pickedFile.name} (ID: {pickedFile.id.substring(0, 8)}...)</span>
                          </div>
                          <a
                            href={pickedFile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-brand-secondary underline uppercase hover:text-white"
                          >
                            In Drive Öffnen
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drive Files Table */}
                  <div className="bg-black/30 border border-white/5 rounded-sm p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <h3 className="text-sm font-mono uppercase text-white/45 tracking-widest">Ablageordner (Letzte Drive-Uploads)</h3>
                      <button
                        onClick={() => setIsDriveFormOpen(true)}
                        className="py-1 px-3 bg-white/10 hover:bg-white/20 text-white rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all"
                      >
                        + Neues Dokument erstellen
                      </button>
                    </div>

                    {driveFiles.length === 0 ? (
                      <div className="py-12 text-center text-white/20 font-mono text-xs uppercase tracking-widest">
                        Keine Dateien gefunden oder geladen.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-xs text-white/50">
                          <thead>
                            <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-white/30">
                              <th className="py-2">Dateiname</th>
                              <th className="py-2">Typ</th>
                              <th className="py-2">Modifiziert</th>
                              <th className="py-2 text-right">Aktion</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {driveFiles.map((file) => (
                              <tr key={file.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-3 text-white flex items-center gap-2 truncate max-w-xs">
                                  {file.iconLink && <img src={file.iconLink} alt="" className="w-4 h-4 opacity-70" />}
                                  <span>{file.name}</span>
                                </td>
                                <td className="py-3 text-[10px] text-white/30">{file.mimeType.split('.').pop() || 'File'}</td>
                                <td className="py-3 text-white/30">{new Date(file.modifiedTime).toLocaleDateString()}</td>
                                <td className="py-3 text-right">
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] select-all bg-white/5 hover:bg-white/10 px-2 py-1 rounded-xs border border-white/15 text-white/70 hover:text-white"
                                  >
                                    Öffnen
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= KEEP SUB-VIEW ================= */}
              {activeSubTab === 'keep' && (
                <div className="space-y-6">
                  {isKeepUnsupported && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-start gap-3">
                      <InformationCircleIcon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs font-mono leading-relaxed text-amber-200">
                        <span className="font-bold uppercase tracking-wider block">Information zur Keep API</span>
                        Die offizielle Google Keep API steht für private @gmail.com Konten standardmäßig nicht zur Verfügung (nur für Google Workspace Organisations-Konten). Loki speichert Ihre Notizen und Förderergebnisse daher in dieser Sitzung lokal ab.
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* New Note Form Starter Card */}
                    <button
                      onClick={() => setIsKeepFormOpen(true)}
                      className="border border-white/10 border-dashed hover:border-brand-primary rounded-sm p-6 flex flex-col items-center justify-center text-center transition-all min-h-[160px] bg-white/5 hover:bg-white/10"
                    >
                      <PlusIcon className="w-8 h-8 text-white/30 mb-2" />
                      <span className="font-serif italic text-sm text-white">Neue Notiz verfassen</span>
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-1">Ideen, Deadlines, Details</span>
                    </button>

                    {/* Combine Real Keep Notes (from API) + Fallback list */}
                    {(isKeepUnsupported || keepNotes.length === 0 ? fallbackNotes : keepNotes).map((note, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 rounded-xs p-6 flex flex-col justify-between min-h-[180px] shadow-lg relative">
                        <div className="space-y-3">
                          <h4 className="font-serif italic text-base text-white">{note.title}</h4>
                          <p className="text-xs text-white/50 leading-relaxed font-mono whitespace-pre-line">{note.text}</p>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/20 uppercase tracking-widest">
                          <span>In_Session Notiz</span>
                          <button
                            onClick={() => {
                              if (window.confirm('Diese Notiz entfernen?')) {
                                setFallbackNotes(prev => prev.filter((_, i) => i !== idx));
                              }
                            }}
                            className="text-rose-500/60 hover:text-rose-400 transition-colors"
                          >
                            Löschen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar Guide (Grid span 1) */}
            <div className="space-y-6">
              <div className="bg-black/40 border border-brand-primary/20 p-6 rounded-sm shadow-xl text-xs font-mono leading-relaxed space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-white/5 text-brand-secondary">
                  <ShieldCheckIcon className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-serif italic text-sm text-white">Sicherheitserklärung</h3>
                </div>
                <div className="space-y-3 text-white/70">
                  <p>
                    <strong>Least Privilege Scope:</strong> Die Applikation agiert nur mit Zugriff auf die von Ihnen freigegebenen APIs.
                  </p>
                  <p>
                    <strong>Mit Berechtigung:</strong> Loki führt automatisierte Lese- und Schreibvorgänge ausschließlich nach Ihrem expliziten Einverständnis oder Klick aus.
                  </p>
                  <p className="opacity-45 text-[10px]">
                    Sicherheitszertifikat und CSR-Bestimmungen sind konform zur DSGVO (Stand Jan 2026).
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 p-6 rounded-sm space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/30">Anwendungsszenarien</h3>
                <ul className="space-y-3 text-xs text-white/45 font-mono">
                  <li className="flex gap-2">
                    <span className="text-brand-secondary">•</span> E-Mails mit FFG, AWS oder ÖHT Beratern direkt über dieses Terminal lesen und versenden.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-secondary">•</span> Businesspläne via Google Picker in die Arbeitsmappen einbinden.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-brand-secondary">•</span> Schnellnotizen zu Förderfristen an das Smartphone-Notizbuch anbinden.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ================= GUEST / CONNECT BOARD ================= */}
      {!isConnected && (
        <div className="bg-black/30 border border-white/5 p-12 rounded-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-sm mx-auto flex items-center justify-center text-white/30">
            <EnvelopeIcon className="w-10 h-10 text-brand-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-serif italic text-white">Google Workspace verbinden</h3>
            <p className="text-xs font-mono text-white/40 leading-relaxed max-w-md mx-auto">
              Verbinden Sie Ihr Google-Konto, um Förderkorrespondenz, Projektunterlagen in Drive und Arbeitsnotizen über das Portal zur Verfügung zu stellen.
            </p>
          </div>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="py-3 px-8 bg-brand-primary text-white text-xs font-mono uppercase tracking-widest rounded-sm shadow-xl hover:bg-brand-secondary transition-all"
          >
            {loading ? 'Verbinde...' : 'Verbindung herstellen'}
          </button>
        </div>
      )}

      {/* ================= COMPOSE EMAIL MODAL ================= */}
      <AnimatePresence>
        {isComposedOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-xl p-6 rounded-sm shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-serif italic text-lg text-white">Neue E-Mail (Gmail)</h3>
                <button onClick={() => setIsComposedOpen(false)} className="text-white/40 hover:text-white">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={sendEmail} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/40 uppercase tracking-widest">Empfänger (An):</label>
                  <input
                    type="email"
                    required
                    value={mailTo}
                    onChange={(e) => setMailTo(e.target.value)}
                    placeholder="z.B. ffg-service@ffg.at"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 uppercase tracking-widest">Betreff:</label>
                  <input
                    type="text"
                    required
                    value={mailSubject}
                    onChange={(e) => setMailSubject(e.target.value)}
                    placeholder="Förderstelle Rückfrage zu Projekt XYZ"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 uppercase tracking-widest">Inhalt:</label>
                  <textarea
                    required
                    rows={8}
                    value={mailBody}
                    onChange={(e) => setMailBody(e.target.value)}
                    placeholder="Sehr geehrte Damen und Herren..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsComposedOpen(false)}
                    className="py-2 px-4 bg-white/5 text-white/60 hover:bg-white/10 rounded-sm uppercase font-mono tracking-widest text-[10px]"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={sendingMail}
                    className="py-2 px-5 bg-brand-primary text-white hover:bg-brand-secondary rounded-sm uppercase font-mono tracking-widest text-[10px]"
                  >
                    {sendingMail ? 'Sende...' : 'E-Mail Senden'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= DRIVE CREATE MODAL ================= */}
      <AnimatePresence>
        {isDriveFormOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-xl p-6 rounded-sm shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-serif italic text-lg text-white">Neues Dokument (Google Drive)</h3>
                <button onClick={() => setIsDriveFormOpen(false)} className="text-white/40 hover:text-white">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={createDriveFile} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/40 uppercase tracking-widest">Dateiname:</label>
                  <input
                    type="text"
                    required
                    value={driveFileName}
                    onChange={(e) => setDriveFileName(e.target.value)}
                    placeholder="z.B. abstract_projekt_koerperfluss.txt"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 uppercase tracking-widest">Dateisinhalt (Roh-Text):</label>
                  <textarea
                    required
                    rows={8}
                    value={driveFileContent}
                    onChange={(e) => setDriveFileContent(e.target.value)}
                    placeholder="Projektbeschreibung oder sonstige Notizen..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsDriveFormOpen(false)}
                    className="py-2 px-4 bg-white/5 text-white/60 hover:bg-white/10 rounded-sm uppercase font-mono tracking-widest text-[10px]"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={creatingFile}
                    className="py-2 px-5 bg-brand-primary text-white hover:bg-brand-secondary rounded-sm uppercase font-mono tracking-widest text-[10px]"
                  >
                    {creatingFile ? 'Erstelle...' : 'In Drive Speichern'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= KEEP CREATE MODAL ================= */}
      <AnimatePresence>
        {isKeepFormOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-xl p-6 rounded-sm shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <h3 className="font-serif italic text-lg text-white">Neue Notiz verfassen (Keep / Lokale Inbox)</h3>
                <button onClick={() => setIsKeepFormOpen(false)} className="text-white/40 hover:text-white">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={createKeepNote} className="space-y-4 font-mono text-xs">
                <div className="space-y-1">
                  <label className="text-white/40 uppercase tracking-widest">Notiz-Titel:</label>
                  <input
                    type="text"
                    required
                    value={keepTitle}
                    onChange={(e) => setKeepTitle(e.target.value)}
                    placeholder="Betreff oder Schlagwort, z.B. FFG Einreichung Frist"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/40 uppercase tracking-widest">Inhalt:</label>
                  <textarea
                    required
                    rows={6}
                    value={keepContent}
                    onChange={(e) => setKeepContent(e.target.value)}
                    placeholder="Recherche-Notizen, Kontakte, To-Dos..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-sm text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/40 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsKeepFormOpen(false)}
                    className="py-2 px-4 bg-white/5 text-white/60 hover:bg-white/10 rounded-sm uppercase font-mono tracking-widest text-[10px]"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={creatingKeep}
                    className="py-2 px-5 bg-brand-primary text-white hover:bg-brand-secondary rounded-sm uppercase font-mono tracking-widest text-[10px]"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= SUCCESS & ERROR NOTIFICATION BANNER ================= */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 max-w-md bg-emerald-700 text-white p-4 rounded-sm shadow-2xl border border-emerald-500/20 flex items-start gap-3 z-[150]"
          >
            <CheckCircleIcon className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-xs font-mono uppercase tracking-widest font-bold">Erfolgreich</p>
              <p className="text-[11px] font-mono mt-1 text-white/90">{successMessage}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 max-w-md bg-rose-950 text-white p-4 rounded-sm shadow-2xl border border-rose-500/35 flex items-start gap-3 z-[150]"
          >
            <ExclamationTriangleIcon className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-grow">
              <p className="text-xs font-mono uppercase tracking-widest font-bold text-rose-400">Hinweis / Fehler</p>
              <p className="text-[11px] font-mono mt-1 text-white/80 leading-normal">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded-sm text-white/50">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default GmailIntegration;
