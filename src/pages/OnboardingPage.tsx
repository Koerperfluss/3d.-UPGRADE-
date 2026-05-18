import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { User, MembershipTier } from '../types';
import { CheckCircleIcon, TrainingIcon, BrainCircuitIcon, CommunityIcon, BackArrowIcon, ArrowRightIcon } from '../components/IconComponents';

interface OnboardingPageProps {
  user: User;
}

const onboardingSteps = [
  {
    icon: <CheckCircleIcon className="w-12 h-12 text-brand-primary" />,
    title: (name: string, plan: string) => `Willkommen, ${name}!`,
    description: (plan: string) => `Ihr ${plan}-Plan ist jetzt aktiv. Wir zeigen Ihnen in ein paar kurzen Schritten die wichtigsten Funktionen.`
  },
  {
    icon: <BrainCircuitIcon className="w-12 h-12 text-brand-primary" />,
    title: () => 'Ihr persönliches Cockpit',
    description: () => 'Das Dashboard ist Ihre Zentrale. Hier finden Sie Ihren persönlichen Fortschritt, Ihre Pläne und Ihre KI-gestützte Gesundheitsanalyse.'
  },
  {
    icon: <TrainingIcon className="w-12 h-12 text-brand-primary" />,
    title: () => 'Kurse & Lerninhalte',
    description: () => 'Unter "Angebote" finden Sie alle Videokurse und Übungen, die in Ihrem Plan enthalten sind. Starten Sie jederzeit und lernen Sie in Ihrem Tempo.'
  },
  {
    icon: <CommunityIcon className="w-12 h-12 text-brand-primary" />,
    title: () => 'Alles startklar!',
    description: () => 'Sie sind bereit. Erkunden Sie die Plattform, starten Sie Ihren ersten Kurs oder sehen Sie sich Ihre Analyse im Dashboard an.'
  }
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [plan, setPlan] = useState<MembershipTier | null>(null);

  useEffect(() => {
    const planData = sessionStorage.getItem('koerperflussPlan');
    if (planData) {
      try {
        setPlan(JSON.parse(planData));
      } catch (e) {
        console.error("Failed to parse plan data", e);
      }
    }
  }, []);

  const finishOnboarding = () => {
    sessionStorage.removeItem('koerperflussOnboardingNeeded');
    sessionStorage.removeItem('koerperflussPlan');
    navigate('/dashboard');
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const step = onboardingSteps[currentStep];
  const planName = plan?.name || 'Mitgliedschafts';

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] opacity-40"></div>
      <div className="absolute bottom-0 right-1/4 w-[900px] h-[900px] bg-brand-primary/10 rounded-full blur-[250px] opacity-30"></div>

      <div className="w-full max-w-2xl animate-fadeInUp relative z-10">
        <Card className="glass-dark !p-16 md:!p-24 rounded-[60px] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] text-center overflow-hidden">
          <div className="mb-12 flex justify-center scale-125">{step.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-8 tracking-tight leading-tight">{step.title(user.name, planName)}</h1>
          <p className="text-xl text-zinc-500 font-light leading-relaxed tracking-wide mb-16 min-h-[100px]">
            {step.description(planName)}
          </p>

          <div className="flex justify-center items-center gap-4 mb-16">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-700 ${
                  index === currentStep ? 'bg-brand-primary w-8 shadow-glow' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <Button onClick={handlePrev} variant="outline" disabled={currentStep === 0} className="w-full sm:w-auto flex items-center justify-center py-6 px-10 text-[10px] uppercase tracking-[0.3em] font-black border-white/10 text-zinc-500 hover:text-white hover:border-white/20">
                <BackArrowIcon className="w-5 h-5 mr-3" /> Zurück
            </Button>
             <button onClick={finishOnboarding} className="text-[10px] font-black text-zinc-600 hover:text-brand-primary uppercase tracking-[0.3em] transition-colors">Überspringen</button>
            <Button onClick={handleNext} variant="primary" className="w-full sm:w-auto flex items-center justify-center py-6 px-12 text-[10px] uppercase tracking-[0.5em] font-black shadow-glow">
              {currentStep === onboardingSteps.length - 1 ? 'Zum Dashboard' : 'Weiter'}
              <ArrowRightIcon className="w-5 h-5 ml-3" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};