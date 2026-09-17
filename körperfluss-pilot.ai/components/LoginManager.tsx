import React, { useState } from 'react';
import { ClipboardIcon, EyeIcon, EyeSlashIcon, CheckBadgeIcon } from './Icons';

interface LoginInfo {
  id: string;
  service: string;
  website: string;
  username: string;
  password?: string;
}

const loginsData: LoginInfo[] = [
  {
    id: 'ffg',
    service: 'FFG eCall',
    website: 'https://ecall.ffg.at',
    username: 'SaschaKoerperfluss',
    password: 'weprer-pohjem-1faMke',
  },
  {
    id: 'aws',
    service: 'AWS Fördermanager',
    website: 'https://foerdermanager.aws.at',
    username: 'koerperfluss@gmail.com',
    password: 'bizsas-hemgit-fuJzi7',
  },
  {
    id: 'waw',
    service: 'Wirtschaftsagentur Wien',
    website: 'https://wirtschaftsagentur.at',
    username: 'koerperfluss@gmail.com',
    password: 'vuxcys-qodnAw-9jacmy',
  },
];

const LoginManager: React.FC = () => {
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setPasswordVisibility(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(fieldId);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="p-6 flex flex-col h-full space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Login-Verwaltung</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Zugangsdaten für Förderportale</p>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2">
        {loginsData.map((login) => (
          <div key={login.id} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">{login.service}</h4>
                <a href={login.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-secondary dark:text-brand-accent hover:underline break-all">{login.website}</a>
              </div>
              <a 
                href={login.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-md hover:bg-brand-secondary transition-colors flex items-center gap-1"
                title={`${login.service} öffnen`}
              >
                Zum Portal
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
            <div className="mt-4 space-y-3">
              {/* Username */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Nutzername</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="text" readOnly value={login.username} className="w-full px-2 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm truncate" />
                  <button onClick={() => copyToClipboard(login.username, `${login.id}-user`)} title="Nutzername kopieren" className="p-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex-shrink-0">
                    <span className="sr-only">Kopieren</span>
                    <div className="w-4 h-4 text-gray-600 dark:text-gray-300">
                      {copied === `${login.id}-user` ? <CheckBadgeIcon /> : <ClipboardIcon />}
                    </div>
                  </button>
                </div>
              </div>
              {/* Password */}
              {login.password && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Passwort</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type={passwordVisibility[login.id] ? 'text' : 'password'} readOnly value={login.password} className="w-full px-2 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono" />
                    <button onClick={() => togglePasswordVisibility(login.id)} title={passwordVisibility[login.id] ? 'Passwort verbergen' : 'Passwort anzeigen'} className="p-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex-shrink-0">
                      <span className="sr-only">{passwordVisibility[login.id] ? 'Passwort verbergen' : 'Passwort anzeigen'}</span>
                       <div className="w-4 h-4 text-gray-600 dark:text-gray-300">
                        {passwordVisibility[login.id] ? <EyeSlashIcon /> : <EyeIcon />}
                       </div>
                    </button>
                    <button onClick={() => copyToClipboard(login.password!, `${login.id}-pass`)} title="Passwort kopieren" className="p-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex-shrink-0">
                      <span className="sr-only">Kopieren</span>
                      <div className="w-4 h-4 text-gray-600 dark:text-gray-300">
                        {copied === `${login.id}-pass` ? <CheckBadgeIcon /> : <ClipboardIcon />}
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginManager;
