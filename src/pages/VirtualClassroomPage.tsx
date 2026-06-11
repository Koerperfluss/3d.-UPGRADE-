import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  UserGroupIcon, MessageCircleIcon, 
  SparklesIcon, ArrowLeftIcon, 
  EyeIcon, GraduationCapIcon
} from '../components/IconComponents';
import { Link } from 'react-router-dom';

export const VirtualClassroomPage: React.FC = () => {
  const [messages] = useState([
    { user: 'Digital Mentor', text: 'Willkommen in der Live-Session zur HWS-Analyse. Alle Studenten sind verbunden.', type: 'ai' },
    { user: 'Student A', text: 'Ich sehe eine deutliche Valgus-Tendenz am Knie, aber wie korreliert das mit dem Kiefer?', type: 'user' },
    { user: 'Digital Mentor', text: 'Guter Punkt. Schaut euch die myofasziale Kette "Deep Front Line" an. Ich markiere die Verbindung auf dem Modell.', type: 'ai' },
  ]);

  return (
    <div className="min-h-screen bg-brand-background text-white p-8 overflow-hidden flex flex-col">
      {/* Classroom Header */}
      <div className="flex justify-between items-center mb-8 bg-brand-secondary/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
            <UserGroupIcon className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif italic">Virtueller Lernraum PT3</h2>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-black tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Live Session: Clinical Reasoning
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-brand-secondary flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-brand-primary text-brand-secondary border-2 border-brand-secondary flex items-center justify-center text-[10px] font-bold">
                +24
              </div>
           </div>
           <Button variant="outline" size="sm" className="bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20">
             Session beenden
           </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main 3D View Mockup */}
        <div className="lg:col-span-3 relative bg-black/40 rounded-[40px] border border-white/5 overflow-hidden shadow-inner group">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Simulation of a 3D overlay */}
            <div className="relative w-full h-full flex items-center justify-center">
               <div className="absolute top-10 left-10 p-6 bg-brand-secondary/60 backdrop-blur-xl rounded-3xl border border-brand-primary/20 max-w-xs">
                 <h4 className="text-xs font-black uppercase text-brand-primary mb-2 tracking-tighter">Live Analyse</h4>
                 <p className="text-2xl font-serif italic mb-4">"Kausalkette CMD & HWS"</p>
                 <div className="flex flex-col gap-2">
                   <div className="flex justify-between text-[10px] border-b border-white/10 pb-1">
                     <span>Fasziale Spannung</span>
                     <span className="text-brand-primary">HOCH</span>
                   </div>
                   <div className="flex justify-between text-[10px] border-b border-white/10 pb-1">
                     <span>Propriozeption</span>
                     <span className="text-brand-primary">KOMPROMITTIERT</span>
                   </div>
                 </div>
               </div>

               {/* Center Callout */}
               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ repeat: Infinity, duration: 3 }}
                 className="w-4 h-4 bg-brand-primary rounded-full shadow-[0_0_50px_rgba(212,175,55,1)] relative z-20"
               />
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
             <Button variant="outline" size="sm" className="backdrop-blur-xl">Rotate</Button>
             <Button variant="outline" size="sm" className="backdrop-blur-xl">Slice</Button>
             <Button variant="primary" size="sm" className="bg-brand-primary/80">Reset View</Button>
          </div>
        </div>

        {/* Group Chat & AI Mentor Sidebar */}
        <div className="flex flex-col gap-6">
          
          {/* AI Mentor Insights */}
          <Card className="border-brand-primary/30 bg-brand-primary/5">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="w-4 h-4 text-brand-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Mentor Insights</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed italic">
                "Basierend auf dem Feedback der 28 Teilnehmer: 85% haben die Verbindung zum M. Sternocleidomastoideus erkannt. Ich schlage einen Bug-Sprint zur Innervation vor."
              </p>
            </div>
          </Card>

          {/* Live Chat */}
          <div className="flex-1 bg-brand-secondary/40 rounded-3xl border border-white/5 flex flex-col p-6 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Group Chat</h3>
            <div className="flex-1 space-y-4 overflow-y-auto mb-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.type === 'ai' ? 'items-start' : 'items-end'}`}>
                  <span className={`text-[8px] uppercase font-black mb-1 ${m.type === 'ai' ? 'text-brand-primary' : 'text-zinc-500'}`}>
                    {m.user}
                  </span>
                  <div className={`text-xs p-3 rounded-2xl max-w-[85%] ${m.type === 'ai' ? 'bg-brand-primary/10 text-white border border-brand-primary/20' : 'bg-zinc-800 text-zinc-300 border border-white/5'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-auto">
              <input 
                type="text" 
                placeholder="Frage an Mentor stellen..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-brand-primary/50"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-primary">
                <MessageCircleIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Student Pulse (Lecturer View Simulation) */}
          <div className="bg-brand-secondary/60 p-4 rounded-3xl border border-white/5">
             <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Student Pulse</span>
               <EyeIcon className="w-3 h-3 text-zinc-500" />
             </div>
             <div className="grid grid-cols-4 gap-2">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="aspect-square rounded-lg bg-zinc-800 flex items-center justify-center relative group cursor-help">
                    <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                       Verständnis: {i % 3 === 0 ? '60%' : '95%'}
                    </div>
                  </div>
                ))}
             </div>
          </div>

        </div>

      </div>

      {/* Pitch Dashboard Return Link */}
      <Link to="/pitch-deck" className="fixed bottom-6 left-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/40 hover:text-white px-4 py-2 rounded-full text-[10px] font-black uppercase transition-all backdrop-blur-md border border-white/10">
        <ArrowLeftIcon className="w-3 h-3" /> Zurück zum Pitch Deck
      </Link>
    </div>
  );
};
