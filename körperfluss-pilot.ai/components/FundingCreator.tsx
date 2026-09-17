import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { XMarkIcon } from './Icons';

interface FundingCreatorProps {
  onClose: () => void;
}

const FundingCreator: React.FC<FundingCreatorProps> = ({ onClose }) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'nodes'), {
        label,
        type: 'project',
        status: 'pending',
        group: 'FFG',
        details: { description },
        authorUid: 'admin' // Placeholder
      });
      onClose();
    } catch (error) {
      console.error('Error creating node:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0a0502] border border-white/10 p-6 rounded-sm w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-white font-serif italic text-lg">Add Project</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
        </div>
        <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 text-white font-mono text-sm" placeholder="Project Name" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 text-white font-mono text-sm h-32" placeholder="Description" />
        <button onClick={handleSave} disabled={isSaving} className="w-full bg-brand-primary text-white py-2 font-mono uppercase tracking-widest text-xs hover:bg-brand-primary/80">
          {isSaving ? 'Saving...' : 'Add Project'}
        </button>
      </div>
    </div>
  );
};

export default FundingCreator;
