
import React, { useState, useRef } from 'react';
import { generateClinicalContent } from '../services/aiService';
import { MicrophoneIcon, SendIcon, CheckCircleIcon } from './IconComponents';

export const AudioTranscriber: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscription(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleTranscription = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const response = await generateClinicalContent(
        [
          { inlineData: { data: base64, mimeType: 'audio/webm' } },
          { text: "Transkribiere dieses medizinische Diktat präzise. Korrigiere Fachbegriffe der Physiotherapie (z.B. Pronation, lumbal, propriozeptiv). Strukturiere den Text in Stichpunkten." }
        ],
        'gemini-2.5-flash'
      );

      setTranscription(prev => prev + (prev ? '\n' : '') + (response.text || ''));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-brand-surface rounded-2xl border border-brand-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-brand-secondary flex items-center gap-2">
          <MicrophoneIcon className="w-4 h-4 text-brand-primary" /> Audio-Befundung
        </h4>
        {isProcessing && <div className="text-[10px] text-brand-primary animate-pulse font-bold uppercase">Verarbeite Audio...</div>}
      </div>

      <div className="flex gap-4">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isRecording ? 'bg-red-500 scale-95 animate-pulse' : 'bg-brand-primary hover:bg-brand-primary-dark'}`}
        >
          <MicrophoneIcon className={`w-7 h-7 ${isRecording ? 'text-white' : 'text-brand-secondary'}`} />
        </button>
        
        <div className="flex-grow">
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            placeholder="Halten Sie das Mikrofon gedrückt, um zu diktieren..."
            className="w-full h-24 p-3 text-xs bg-brand-background border border-brand-border rounded-xl resize-none focus:ring-1 focus:ring-brand-primary outline-none"
          />
        </div>
      </div>
      <p className="text-[10px] text-brand-text-on-light-secondary mt-2 italic text-center">Tipp: Halten Sie die Taste gedrückt, während Sie sprechen.</p>
    </div>
  );
};
