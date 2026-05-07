import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Card } from './Card';
import { Button } from './Button';
import { CameraIcon, SimulationIcon, ArrowRightIcon, BrainCircuitIcon, BackArrowIcon, SkipIcon, SaveIcon } from './IconComponents';

type LabMode = 'image' | 'video' | 'edit';

export const CreativeLab: React.FC = () => {
  const [mode, setMode] = useState<LabMode | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);

  const handleImageGen = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    setResultImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: [{ text: prompt }],
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: imageSize
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setResultImage(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (e) {
      console.error(e);
      setError("Bildgenerierung fehlgeschlagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoGen = async () => {
    if (!prompt.trim() && !sourceFile) return;
    setIsGenerating(true);
    setError('');
    setResultVideo(null);

    try {
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      let imagePart: any = null;

      if (sourceFile) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(sourceFile);
        });
        imagePart = { imageBytes: base64, mimeType: sourceFile.type };
      }

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || 'Professional medical animation.',
        image: imagePart || undefined,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: (aspectRatio === '16:9' || aspectRatio === '9:16') ? aspectRatio : '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      setResultVideo(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`);
    } catch (e) {
      console.error(e);
      setError("Video-Engine Error.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsset = () => {
      const link = document.createElement('a');
      if (resultImage) {
          link.href = resultImage;
          link.download = `Generated_Image_${Date.now()}.png`;
      } else if (resultVideo) {
          link.href = resultVideo;
          link.download = `Generated_Video_${Date.now()}.mp4`;
      }
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const reset = () => {
    setMode(null); setPrompt(''); setResultImage(null); setResultVideo(null);
    setSourceFile(null); setSourcePreview(null); setError('');
  };

  if (!mode) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { id: 'image', label: 'Illustration', icon: <CameraIcon />, desc: 'Medizinische Bilder (1K-4K).' },
          { id: 'edit', label: 'Editor', icon: <SkipIcon />, desc: 'Bilder per Befehl ändern.' },
          { id: 'video', label: 'Animation', icon: <SimulationIcon />, desc: 'Veo Lehrvideos erstellen.' }
        ].map(m => (
          <Card key={m.id} onClick={() => setMode(m.id as LabMode)} hoverEffect className="cursor-pointer bg-brand-surface border-2 border-brand-primary/20 rounded-[2rem] p-8 text-center group">
            <div className="p-4 bg-brand-primary/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform inline-block">
              {React.cloneElement(m.icon as React.ReactElement<any>, { className: 'w-12 h-12 text-brand-primary' })}
            </div>
            <h3 className="text-xl font-bold text-brand-secondary font-serif">{m.label}</h3>
            <p className="text-xs text-brand-text-on-light-secondary mt-2">{m.desc}</p>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-brand-surface border-2 border-brand-primary/20 rounded-[2.5rem] shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <button onClick={reset} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-text-on-light-secondary hover:text-brand-primary transition-colors">
          <BackArrowIcon className="w-4 h-4" /> Back to Lab
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {(mode === 'edit' || mode === 'video') && (
            <div className="p-6 bg-brand-background rounded-3xl border-2 border-dashed border-brand-border cursor-pointer text-center" onClick={() => document.getElementById('lab-file')?.click()}>
              {sourcePreview ? <img src={sourcePreview} className="h-40 mx-auto rounded-xl shadow-lg" /> : <p className="text-xs font-bold uppercase opacity-40">Drop Source Image</p>}
              <input id="lab-file" type="file" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if(f) { setSourceFile(f); setSourcePreview(URL.createObjectURL(f)); }
              }} />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-brand-text-on-light-secondary mb-2">KI-Befehl (Prompt)</label>
            <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Beschreibe das anatomische Wunder..."
                className="w-full p-4 bg-brand-background border-2 border-brand-border rounded-2xl focus:ring-4 focus:ring-brand-primary/10 outline-none text-sm min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-brand-text-on-light-secondary">Format</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-3 bg-white border border-brand-border rounded-xl text-xs font-bold outline-none">
                    {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
             </div>
             {mode === 'image' && (
                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-brand-text-on-light-secondary">Qualität</label>
                    <div className="flex gap-2">
                        {['1K', '2K', '4K'].map(s => (
                            <button key={s} onClick={() => setImageSize(s as any)} className={`flex-1 py-3 rounded-xl border text-[10px] font-black transition-all ${imageSize === s ? 'bg-brand-primary border-brand-primary text-brand-secondary' : 'bg-white border-brand-border'}`}>{s}</button>
                        ))}
                    </div>
                </div>
             )}
          </div>

          <Button onClick={mode === 'image' ? handleImageGen : handleVideoGen} disabled={isGenerating} variant="primary" className="w-full py-5 shadow-glow">
             <span className="font-serif uppercase tracking-widest flex items-center justify-center gap-3">
                {isGenerating ? <div className="animate-spin h-5 w-5 border-2 border-brand-secondary border-t-transparent rounded-full" /> : <BrainCircuitIcon className="w-5 h-5" />}
                {isGenerating ? 'Engine läuft...' : 'Medium generieren'}
             </span>
          </Button>
        </div>

        <div className="bg-brand-background rounded-[2rem] border-2 border-brand-border flex items-center justify-center relative overflow-hidden min-h-[400px] shadow-inner">
            {resultImage ? (
                <div className="relative w-full h-full group">
                    <img src={resultImage} className="w-full h-full object-contain animate-fadeInUp" />
                    <button onClick={downloadAsset} className="absolute bottom-4 right-4 bg-brand-secondary text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110">
                        <SaveIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : resultVideo ? (
                <div className="relative w-full h-full group">
                    <video src={resultVideo} controls className="w-full h-full object-contain animate-fadeInUp" />
                    <button onClick={downloadAsset} className="absolute bottom-16 right-4 bg-brand-secondary text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110 z-10">
                        <SaveIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="text-center opacity-20 group">
                    <SimulationIcon className="w-24 h-24 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ready for Generation</p>
                </div>
            )}
        </div>
      </div>
    </Card>
  );
};