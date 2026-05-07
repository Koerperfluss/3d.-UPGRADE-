
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from './Button';
import { BackArrowIcon, SendIcon, CloseIcon, WarningIcon, SkipIcon, BrainCircuitIcon } from './IconComponents'; 
import { Card } from './Card';
import { User } from '../types';
import { Logo } from './Logo';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isWarning?: boolean;
}

export interface CollectedVariables {
  mode?: 'Ganzheitliche Beratung & Analyse' | 'Calisthenics & Workout Coaching' | 'Professionelle KI-Werkzeuge öffnen';
  finalDecision?: 'Termin vereinbaren' | 'Nur fertige Analyse & Plan erhalten' | 'Danke, das war alles';
  ageGroup?: string;
  activityLevel?: string;
  gender?: string;
  height?: string;
  weight?: string;
  dominantSide?: string;
  focusArea?: string;
  painType?: string;
  painIntensityNow?: string;
  painIntensityMin?: string;
  painIntensityMax?: string;
  duration?: string;
  provocation?: string;
  calmingTime?: string;
  progression?: string;
  dailyPattern?: string;
  wakesUpAtNight?: 'Ja' | 'Nein';
  trauma?: 'Ja' | 'Nein';
  cancerHistory?: 'Ja' | 'Nein';
  weightLoss?: 'Ja' | 'Nein';
  fever?: 'Ja' | 'Nein';
  saddleAnesthesia?: 'Ja' | 'Nein';
  previousInjuries?: string;
  knownDiseases?: string;
  medication?: string;
  fearOfMovement?: 'Ja, deutlich' | 'Etwas' | 'Nein, gar nicht';
  mood?: 'Oft niedergeschlagen/ängstlich' | 'Manchmal' | 'Selten bis nie';
  confidence?: 'Sehr zuversichtlich' | 'Eher zuversichtlich' | 'Eher unsicher' | 'Sehr unsicher';
  difficultActivities?: string;
  mainGoal?: string;
  doctorRestrictions?: 'Ja' | 'Nein';
  chestPainDizziness?: 'Ja' | 'Nein';
  age?: number;
  height_cm?: number;
  weight_kg?: number;
  goal_priority?: string[];
  goal_motivation?: string;
  max_pushups?: number;
  max_pullups?: number;
  max_dips?: number;
  skills_owned?: string[];
  current_pain?: string;
  medical_clearance?: boolean;
  equipment_list?: string[];
  training_location?: string[];
  questionComments?: { [key: string]: string };
}


interface HistoryState {
  questionIndex: number;
  activeFlow: Question[];
  collectedVariables: CollectedVariables;
  messages: Message[];
}

interface Question {
  id: number;
  variableKey: keyof CollectedVariables | 'none';
  getQuestionText: (vars?: CollectedVariables) => string;
  options?: string[];
  inputType: 'text' | 'buttons' | 'textarea' | 'number' | 'boolean' | 'list';
  placeholder?: string;
  isTerminal?: boolean; 
  isWarning?: boolean;
}

const getTrainingSafetyWarning = (isDu: boolean) => isDu
    ? "Danke für die Info. Bitte kläre das unbedingt ärztlich ab, bevor du mit einem neuen Training startest. Deine Sicherheit geht vor!"
    : "Vielen Dank für die Information. Bitte klären Sie dies unbedingt ärztlich ab, bevor Sie mit einem neuen Training beginnen. Ihre Sicherheit geht vor.";


const welcomeStep: Question = {
  id: -1,
  variableKey: 'none',
  getQuestionText: () => `Herzlich willkommen bei Körperfluss! Ich bin Ihr persönlicher Wegbegleiter.

Ich kann Ihnen helfen, das richtige Angebot zu finden, eine erste Einschätzung Ihrer gesundheitlichen Situation zu erhalten oder Sie zu unseren professionellen KI-Werkzeugen zu führen.

Lassen Sie uns gemeinsam herausfinden, wie wir Sie am besten unterstützen können.`,
  inputType: 'buttons',
  options: ['Los geht\'s!'],
};

const getModeSelectionQuestion = (user: User | null | undefined): Question => {
  const options = ['Ganzheitliche Beratung & Analyse', 'Calisthenics & Workout Coaching'];
  if (user) {
      options.push('Professionelle KI-Werkzeuge öffnen');
  }

  return { 
    id: 0, 
    variableKey: 'mode', 
    getQuestionText: () => `Perfekt! Worum geht es Ihnen heute?`, 
    inputType: 'buttons', 
    options: options, 
  };
};

const HOLISTIC_CONSULTING_QUESTIONS: Question[] = [
  { id: 1, variableKey: 'ageGroup', getQuestionText: () => "Vielen Dank für Ihr Vertrauen. Um Ihre Situation gut zu verstehen, gehen wir einige Punkte gemeinsam durch. Das hilft uns, die bestmögliche Empfehlung für Sie zu finden.\n\nStarten wir mit ein paar allgemeinen Informationen. In welche Altersgruppe fallen Sie?", inputType: 'buttons', options: ['Unter 20', '20-35', '36-50', '51-65', 'Über 65'], },
  { id: 2, variableKey: 'activityLevel', getQuestionText: () => "Super, danke! Und wie aktiv ist Ihr Alltag typischerweise?", inputType: 'buttons', options: ['Überwiegend sitzend (Bürojob)', 'Mischung aus Sitzen & Stehen', 'Überwiegend stehend/gehend', 'Körperlich anstrengend'], },
  { id: 50, variableKey: 'trauma', getQuestionText: () => "Verstanden. Ihre Sicherheit steht für uns an erster Stelle. Deshalb klären wir vorab ein paar wichtige Punkte. Das ist reine Routine, aber sehr wichtig.\n\nHatten Sie in den letzten 6 Wochen einen nennenswerten Sturz oder ein anderes Trauma?", inputType: 'buttons', options: ['Ja', 'Nein'], },
  { id: 51, variableKey: 'cancerHistory', getQuestionText: () => "Danke für die Info. Gab es in Ihrer medizinischen Vorgeschichte eine Krebserkrankung?", inputType: 'buttons', options: ['Ja', 'Nein'], },
  { id: 52, variableKey: 'weightLoss', getQuestionText: () => "Haben Sie in den letzten Monaten einen unerklärlichen Gewichtsverlust bemerkt?", inputType: 'buttons', options: ['Ja', 'Nein'], },
  { id: 53, variableKey: 'fever', getQuestionText: () => "Okay. Wie sieht es mit Fieber oder Nachtschweiß in der letzten Zeit aus?", inputType: 'buttons', options: ['Ja', 'Nein'], },
  { id: 54, variableKey: 'saddleAnesthesia', getQuestionText: () => "Letzte Sicherheitsfrage, das ist besonders wichtig: Haben Sie ein neu aufgetretenes Taubheitsgefühl im 'Sattelbereich' (zwischen den Beinen) oder plötzliche, unerklärliche Probleme bei der Blasen- oder Darmkontrolle bemerkt?", inputType: 'buttons', options: ['Ja', 'Nein'], },
  { id: 100, variableKey: 'gender', getQuestionText: () => "Vielen Dank für Ihre Offenheit bei diesen wichtigen Punkten. Lassen Sie uns nun mit ein paar allgemeinen Angaben weitermachen. Welches Geschlecht beschreibt Sie am besten?", inputType: 'buttons', options: ['Männlich', 'Weiblich', 'Divers', 'Möchte ich nicht sagen'], },
  { id: 101, variableKey: 'height', getQuestionText: () => "Wie groß sind Sie (in cm)?", inputType: 'number', placeholder: 'z.B. 175' },
  { id: 102, variableKey: 'weight', getQuestionText: () => "Und Ihr aktuelles Körpergewicht (in kg)?", inputType: 'number', placeholder: 'z.B. 70' },
  { id: 103, variableKey: 'dominantSide', getQuestionText: () => "Welche ist Ihre dominante Hand?", inputType: 'buttons', options: ['Rechtshänder', 'Linkshänder', 'Beidhändig'], },
  { id: 300, variableKey: 'focusArea', getQuestionText: () => "Perfekt. Nun zum Kern Ihres Anliegens. Wo genau spüren Sie die Beschwerden hauptsächlich?", inputType: 'buttons', options: ['Nacken/Schultern', 'Rücken (oberer/mittlerer)', 'Unterer Rücken/ISG', 'Hüfte/Gesäß', 'Knie', 'Etwas anderes'], },
  { id: 301, variableKey: 'painType', getQuestionText: () => "Versuchen Sie, den Charakter des Schmerzes zu beschreiben. Was trifft es am ehesten?", inputType: 'buttons', options: ['Stechend/Scharf', 'Dumpf/Drückend', 'Brennend/Kribbelnd', 'Ziehend/Spannungsgefühl'], },
  { id: 302, variableKey: 'painIntensityNow', getQuestionText: () => "Lassen Sie uns die Intensität einschätzen. Auf einer Skala von 0 (kein Schmerz) bis 10 (unerträglich), wie stark ist der Schmerz JETZT gerade?", inputType: 'buttons', options: ['0','1','2','3','4','5','6','7','8','9','10'], },
  { id: 303, variableKey: 'painIntensityMin', getQuestionText: () => "Und auf dieser Skala, wie stark ist er, wenn er am GERINGSTEN ist?", inputType: 'buttons', options: ['0','1','2','3','4','5','6','7','8','9','10'], },
  { id: 304, variableKey: 'painIntensityMax', getQuestionText: () => "Und wenn er am STÄRKSTEN ist?", inputType: 'buttons', options: ['0','1','2','3','4','5','6','7','8','9','10'], },
  { id: 400, variableKey: 'duration', getQuestionText: () => "Danke. Das gibt uns ein gutes Bild. Seit wann haben Sie diese Beschwerden ungefähr?", inputType: 'buttons', options: ['Einige Tage', '1-3 Wochen', '1-3 Monate', 'Länger als 3 Monate'], },
  { id: 401, variableKey: 'provocation', getQuestionText: () => "Gibt es bestimmte Bewegungen, Positionen oder Aktivitäten, die Ihre Beschwerden verstärken?", inputType: 'textarea', placeholder: 'z.B. Langes Sitzen, Bücken, Treppensteigen...' },
  { id: 402, variableKey: 'calmingTime', getQuestionText: () => "Und wenn die Beschwerden provoziert wurden, wie lange brauchen sie, um sich wieder zu beruhigen?", inputType: 'buttons', options: ['Sofort', 'Einige Minuten', '30-60 Minuten', 'Mehrere Stunden'], },
  { id: 403, variableKey: 'progression', getQuestionText: () => "Betrachten wir den Trend: Wird es insgesamt eher besser, bleibt es gleich oder verschlechtert es sich?", inputType: 'buttons', options: ['Wird langsam besser', 'Bleibt unverändert', 'Wird langsam schlechter'], },
  { id: 500, variableKey: 'dailyPattern', getQuestionText: () => "Gibt es ein Muster über den Tag verteilt? Wie fühlen sich die Beschwerden morgens, tagsüber und abends an?", inputType: 'textarea', placeholder: 'z.B. Morgens steif, bessert sich mit Bewegung, abends schlimmer...' },
  { id: 501, variableKey: 'wakesUpAtNight', getQuestionText: () => "Beeinträchtigt das auch Ihren Schlaf? Wecken Sie die Schmerzen nachts auf?", inputType: 'buttons', options: ['Ja', 'Nein'], },
  { id: 600, variableKey: 'previousInjuries', getQuestionText: () => "Okay, fast geschafft. Gibt es frühere Verletzungen, Operationen oder Unfälle, die mit Ihrem aktuellen Anliegen zu tun haben könnten?", inputType: 'textarea', placeholder: 'z.B. Bandscheibenvorfall 2018, Knie-OP links...' },
  { id: 601, variableKey: 'knownDiseases', getQuestionText: () => "Sind bei Ihnen chronische Erkrankungen wie Diabetes, Rheuma oder Herzerkrankungen bekannt?", inputType: 'textarea', placeholder: 'z.B. Diabetes, Rheuma, Herzerkrankungen...' },
  { id: 602, variableKey: 'medication', getQuestionText: () => "Nehmen Sie regelmäßig Medikamente ein, die wir kennen sollten? Gerne mit Name und Dosis.", inputType: 'textarea', placeholder: 'z.B. Ibuprofen 400mg bei Bedarf...' },
  { id: 700, variableKey: 'fearOfMovement', getQuestionText: () => "Der mentale Aspekt ist ebenso wichtig. Wie sehr beeinflusst Sie die Sorge oder Angst, sich 'falsch' zu bewegen oder das Problem zu verschlimmern?", inputType: 'buttons', options: ['Ja, deutlich', 'Etwas', 'Nein, gar nicht'], },
  { id: 701, variableKey: 'mood', getQuestionText: () => "Wie ist Ihre allgemeine Stimmung in letzter Zeit? Fühlen Sie sich tendenziell eher niedergeschlagen/ängstlich oder sind Sie meistens gut drauf?", inputType: 'buttons', options: ['Oft niedergeschlagen/ängstlich', 'Manchmal', 'Selten bis nie'], },
  { id: 702, variableKey: 'confidence', getQuestionText: () => "Und wie zuversichtlich sind Sie, trotz der Beschwerden Ihre Alltagsaufgaben meistern zu können?", inputType: 'buttons', options: ['Sehr zuversichtlich', 'Eher zuversichtlich', 'Eher unsicher', 'Sehr unsicher'], },
  { id: 900, variableKey: 'difficultActivities', getQuestionText: () => "Lassen Sie uns konkret werden. Welche Alltagsaktivitäten, Hobbys oder Sportarten sind im Moment schwierig oder unmöglich für Sie?", inputType: 'textarea', placeholder: 'z.B. Socken anziehen, Laufen, Kind hochheben...' },
  { id: 901, variableKey: 'mainGoal', getQuestionText: () => "Und zum Abschluss, das Wichtigste: Was ist Ihr persönliches Hauptziel? Was möchten Sie unbedingt wieder schmerzfrei und ohne Sorgen tun können?", inputType: 'textarea', placeholder: 'z.B. Wieder schmerzfrei joggen, im Garten arbeiten...' },
];

const CALISTHENICS_QUESTIONS: Question[] = [
    { id: 2001, variableKey: 'age', getQuestionText: () => "Stark! Freut mich, dass du hier bist. Lass uns dein Coaching optimal vorbereiten. Starten wir mit ein paar Basics.\n\nWie alt bist du?", inputType: 'number', placeholder: 'z.B. 25' },
    { id: 2002, variableKey: 'gender', getQuestionText: () => "Alles klar. Welches Geschlecht bzw. Pronomen passt für dich?", inputType: 'buttons', options: ["männlich", "weiblich", "divers", "keine Angabe"] },
    { id: 2003, variableKey: 'height_cm', getQuestionText: () => "Wie groß bist du (in cm)?", inputType: 'number', placeholder: 'z.B. 180' },
    { id: 2004, variableKey: 'weight_kg', getQuestionText: () => "Und dein aktuelles Gewicht (in kg)?", inputType: 'number', placeholder: 'z.B. 75' },
    { id: 2005, variableKey: 'dominantSide', getQuestionText: () => "Bist du Rechts- oder Linkshänder?", inputType: 'buttons', options: ["rechts", "links", "beidseitig"] },
    { id: 2010, variableKey: 'mainGoal', getQuestionText: () => "Sehr gut. Kommen wir zu deinen Zielen. Was ist dein absolutes Hauptziel im Calisthenics? Worauf brennst du am meisten?", inputType: 'buttons', options: ["Skill-Erwerb (Planche, Muscle-Up...)", "Maximalkraft", "Hypertrophie (Muskelaufbau)", "Body-Recomposition"] },
    { id: 2011, variableKey: 'goal_priority', getQuestionText: () => "Cooles Ziel! Gibt es noch 1-2 weitere Dinge, die du erreichen willst? Liste deine Top-Prioritäten.", inputType: 'list', placeholder: "z.B. Muscle-Up, Handstand, Mehr Klimmzüge" },
    { id: 2012, variableKey: 'goal_motivation', getQuestionText: () => "Und was ist deine tiefere Motivation dahinter? Was treibt dich an, dieses Ziel zu erreichen?", inputType: 'textarea', placeholder: "Deine Motivation..." },
    { id: 2020, variableKey: 'max_pushups', getQuestionText: () => "Danke dir! Lass uns jetzt dein aktuelles Level checken, damit dein Plan perfekt passt.\n\nWie viele WIRKLICH saubere Liegestütze schaffst du in einem Satz?", inputType: 'number', placeholder: "Anzahl" },
    { id: 2021, variableKey: 'max_pullups', getQuestionText: () => "Und wie sieht es bei Klimmzügen aus? (Ganz wichtig: saubere Form!)", inputType: 'number', placeholder: "Anzahl" },
    { id: 2022, variableKey: 'max_dips', getQuestionText: () => "Wie viele saubere Dips sind drin?", inputType: 'number', placeholder: "Anzahl" },
    { id: 2023, variableKey: 'skills_owned', getQuestionText: () => "Gibt es schon Skills, die du sicher beherrschst?", inputType: 'list', placeholder: "z.B. Muscle-Up, Back-Lever..." },
    { id: 2030, variableKey: 'current_pain', getQuestionText: () => "Okay, dein Level ist klar. Jetzt zur Gesundheit - das A und O.\n\nGibt es aktuell irgendwelche Schmerzen oder Verletzungen, die dich einschränken?", inputType: 'textarea', placeholder: "z.B. Handgelenksschmerzen rechts, Schulter zwickt..." },
    { id: 2031, variableKey: 'medical_clearance', getQuestionText: () => "Hast du von ärztlicher Seite grünes Licht für intensives Krafttraining?", inputType: 'boolean' },
    { id: 2040, variableKey: 'equipment_list', getQuestionText: () => "Top! Womit können wir arbeiten? Welches Equipment hast du am Start?", inputType: 'buttons', options: ["Klimmzugstange", "Ringe", "Widerstandsbänder", "Parallettes", "Gewichtsweste", "Nichts davon"] },
    { id: 2041, variableKey: 'training_location', getQuestionText: () => "Wo findet dein Training statt?", inputType: 'buttons', options: ["Indoor (Zuhause/Studio)", "Outdoor (Park)", "Beides"] },
];

const SHARED_SAFETY_QUESTIONS: Question[] = [
  { id: 1100, variableKey: 'doctorRestrictions', getQuestionText: (vars) => {
      const du = vars?.mode === 'Calisthenics & Workout Coaching';
      return du 
        ? "Fast geschafft! Zum Schluss noch zwei schnelle, aber wichtige Safety-Checks.\n\nHat dir ein Arzt aus gesundheitlichen Gründen geraten, auf bestimmte körperliche Aktivitäten zu verzichten?"
        : "Wir sind fast durch, vielen Dank für Ihre Geduld! Zum Abschluss noch zwei kurze, aber wichtige Sicherheitsfragen.\n\nHat Ihnen ein Arzt aus gesundheitlichen Gründen geraten, auf bestimmte körperliche Aktivitäten zu verzichten?";
    }, inputType: 'buttons', options: ['Ja', 'Nein'], },
  { id: 1101, variableKey: 'chestPainDizziness', getQuestionText: (vars) => {
      const du = vars?.mode === 'Calisthenics & Workout Coaching';
      return du
          ? "Hattest du in der letzten Woche bei Anstrengung Schmerzen in der Brust, starken Schwindel oder eine Ohnmacht?"
          : "Hatten Sie in der letzten Woche bei Anstrengung Schmerzen in der Brust, starken Schwindel oder eine Ohnmacht?";
    }, inputType: 'buttons', options: ['Ja', 'Nein'], },
];

const FINAL_CHOICE_QUESTION: Question = { id: 9998, variableKey: 'finalDecision', getQuestionText: (vars) => {
    const du = vars?.mode === 'Calisthenics & Workout Coaching';
    return du
        ? "Klasse, das war's schon! Du hast alle wichtigen Infos geliefert. Das hilft uns enorm.\n\nWas ist dein gewünschter nächster Schritt?"
        : "Perfekt, wir haben alles Wichtige besprochen. Vielen Dank für Ihre Zeit und die detaillierten Informationen. Das bildet eine hervorragende Grundlage.\n\nWas ist Ihr gewünschter nächster Schritt?";
}, inputType: 'buttons', options: ['Termin vereinbaren', 'Nur fertige Analyse & Plan erhalten', 'Danke, das war alles'], };

const TERMINAL_STATES = {
    SAFETY_WARNING: { id: 1199, variableKey: 'none', getQuestionText: (vars) => getTrainingSafetyWarning(vars?.mode === 'Calisthenics & Workout Coaching'), inputType: 'text', isTerminal: true, isWarning: true } as Question,
};

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (variables: CollectedVariables) => void;
  onSkip?: () => void;
  isMandatoryPhase?: boolean;
  user?: User | null;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, onComplete, onSkip, isMandatoryPhase = false, user }) => {
  const modeSelectionQuestion = useMemo(() => getModeSelectionQuestion(user), [user]);
  const preFlow = useMemo(() => [welcomeStep, modeSelectionQuestion], [modeSelectionQuestion]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(preFlow[0]);
  const [activeFlow, setActiveFlow] = useState<Question[]>(preFlow);
  const [collectedVariables, setCollectedVariables] = useState<CollectedVariables>({});
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isFinalStage, setIsFinalStage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textInputValue, setTextInputValue] = useState('');

  const addMessage = (text: string, sender: 'user' | 'bot', isWarning: boolean = false) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), text, sender, timestamp: new Date(), isWarning }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isBotTyping]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setMessages([]);
      setIsBotTyping(true);
      timeoutId = setTimeout(() => {
        addMessage(preFlow[0].getQuestionText(), 'bot');
        setIsBotTyping(false);
      }, 700);
      setCurrentQuestion(preFlow[0]);
      setActiveFlow(preFlow);
      setCollectedVariables({});
      setTextInputValue('');
      setSelectedOption(null);
      setIsFinalStage(false);
      setHistory([]);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isOpen, preFlow]);

  const proceedToQuestion = (question: Question, updatedVars: CollectedVariables) => {
    setCurrentQuestion(question);
    setIsBotTyping(true);
    setTimeout(() => {
        addMessage(question.getQuestionText(updatedVars), 'bot', question.isWarning);
        setIsBotTyping(false);
        if (question.isTerminal) {
            setIsFinalStage(true);
            setTimeout(() => {
                if(question.id === FINAL_CHOICE_QUESTION.id) {
                    sessionStorage.setItem('chatbotData', JSON.stringify(updatedVars));
                    onComplete(updatedVars);
                }
                else onClose(); 
            }, question.id === FINAL_CHOICE_QUESTION.id ? 1500 : 8000);
        }
    }, 1000);
};


  const handleBack = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    setMessages(lastState.messages);
    const lastQuestion = lastState.activeFlow.find(q => q.id === lastState.questionIndex) ?? preFlow[0];
    setCurrentQuestion(lastQuestion);
    setActiveFlow(lastState.activeFlow);
    setCollectedVariables(lastState.collectedVariables);

    setSelectedOption(null);
    setTextInputValue('');
    setIsFinalStage(false);
  };
  
  const handleNext = () => {
    if (!currentQuestion) return;

    const answerFromButtons = selectedOption;
    const answerFromText = textInputValue.trim();
    const isOptional = currentQuestion.inputType === 'textarea' || currentQuestion.inputType === 'list';
    
    let finalAnswer: string | boolean | null = answerFromButtons || answerFromText;
     if (currentQuestion.inputType === 'boolean') {
        finalAnswer = selectedOption === 'Ja';
    } else if (!finalAnswer && isOptional) {
      finalAnswer = '(Keine Angabe)';
    }

    if (finalAnswer === null || finalAnswer === '') return;

    setHistory(prev => [...prev, { questionIndex: currentQuestion.id, collectedVariables, messages, activeFlow }]);

    let userMessageText = '';
    const newCollectedVariables = { ...collectedVariables };
    
    const comment = answerFromButtons && answerFromText ? answerFromText : null;
    userMessageText = typeof finalAnswer === 'boolean' ? (finalAnswer ? 'Ja' : 'Nein') : finalAnswer as string;
    if (comment) {
      userMessageText = `Ihre Auswahl: ${userMessageText}\nIhre Anmerkung: ${comment}`;
    }

    const key = currentQuestion.variableKey;
    if (key !== 'none') {
        if (typeof newCollectedVariables[key] === 'boolean') {
            (newCollectedVariables as any)[key] = finalAnswer === 'Ja';
        } else {
            (newCollectedVariables as any)[key] = finalAnswer;
        }
    
        if (comment) {
            if (!newCollectedVariables.questionComments) newCollectedVariables.questionComments = {};
            newCollectedVariables.questionComments[key] = comment;
        }
    }
    
    setCollectedVariables(newCollectedVariables);
    addMessage(userMessageText, 'user');

    setSelectedOption(null);
    setTextInputValue('');

    const currentId = currentQuestion.id;

    if(activeFlow === HOLISTIC_CONSULTING_QUESTIONS && currentQuestion.id >= 50 && currentQuestion.id <= 54 && finalAnswer === 'Ja') {
      const warningText = "Danke für Ihre Ehrlichkeit. Bitte beachten Sie, dass die von Ihnen genannten Symptome ärztlich abgeklärt werden sollten. Diese Analyse ersetzt keine medizinische Diagnose. Wir setzen die Befragung fort, um Ihnen eine allgemeine, unverbindliche Einschätzung zu geben.";
      addMessage(warningText, 'bot', true);
    } else if(currentQuestion.id === 1101 && finalAnswer === 'Ja') {
        proceedToQuestion(TERMINAL_STATES.SAFETY_WARNING, newCollectedVariables);
        return;
    } else if(currentQuestion.id === 2031 && finalAnswer === false) {
        setIsBotTyping(true);
        setTimeout(() => {
            const warningText = getTrainingSafetyWarning(newCollectedVariables.mode === 'Calisthenics & Workout Coaching');
            addMessage(warningText, 'bot', true);

            const currentIndexInFlow = activeFlow.findIndex(q => q.id === currentId);
            const nextQuestion = activeFlow[currentIndexInFlow + 1];

            if (nextQuestion) {
                setTimeout(() => {
                    setCurrentQuestion(nextQuestion);
                    addMessage(nextQuestion.getQuestionText(newCollectedVariables), 'bot', nextQuestion.isWarning);
                    setIsBotTyping(false);
                }, 1500);
            } else {
                setIsBotTyping(false);
                sessionStorage.setItem('chatbotData', JSON.stringify(newCollectedVariables));
                onComplete(newCollectedVariables);
                setIsFinalStage(true);
            }
        }, 1000);
        return;
    }

    let nextQuestion: Question | null = null;
    
    if (currentId === -1 || currentId === 0) { // Handle welcome and mode selection
        if (currentId === -1) {
            nextQuestion = activeFlow[1];
        } else if (currentId === 0) {
            if (finalAnswer === 'Professionelle KI-Werkzeuge öffnen') {
                const vars: CollectedVariables = { mode: 'Professionelle KI-Werkzeuge öffnen' };
                sessionStorage.setItem('chatbotData', JSON.stringify(vars));
                onComplete(vars);
                return;
            }
            const newFlow = finalAnswer === 'Ganzheitliche Beratung & Analyse' ? HOLISTIC_CONSULTING_QUESTIONS : CALISTHENICS_QUESTIONS;
            setActiveFlow(newFlow);
            nextQuestion = newFlow[0];
        }
    } else if (currentId === FINAL_CHOICE_QUESTION.id) {
        sessionStorage.setItem('chatbotData', JSON.stringify(newCollectedVariables));
        onComplete(newCollectedVariables);
        setIsFinalStage(true);
        return;
    }
    else {
        const currentIndexInFlow = activeFlow.findIndex(q => q.id === currentId);
        if(currentIndexInFlow + 1 < activeFlow.length) {
            nextQuestion = activeFlow[currentIndexInFlow + 1];
        } else { 
            if(activeFlow === CALISTHENICS_QUESTIONS || activeFlow === HOLISTIC_CONSULTING_QUESTIONS) {
                nextQuestion = SHARED_SAFETY_QUESTIONS[0];
                setActiveFlow(SHARED_SAFETY_QUESTIONS);
            } else {
                nextQuestion = FINAL_CHOICE_QUESTION;
                setActiveFlow([FINAL_CHOICE_QUESTION]);
            }
        }
    }
    

    if (nextQuestion) {
        proceedToQuestion(nextQuestion, newCollectedVariables);
    } else {
        sessionStorage.setItem('chatbotData', JSON.stringify(newCollectedVariables));
        onComplete(newCollectedVariables);
        setIsFinalStage(true);
    }
  };
  
  if (!isOpen) return null;
  const containerClasses = isMandatoryPhase ? "fixed inset-0 bg-brand-secondary/80 backdrop-blur-sm flex items-center justify-center z-[1000] sm:p-6 md:p-8" : "fixed bottom-4 right-4 left-4 sm:left-auto sm:w-full max-w-md z-[1000]";
  const cardClasses = isMandatoryPhase ? "flex flex-col w-full sm:max-w-xl md:max-w-2xl h-full sm:h-auto sm:max-h-[85vh] shadow-2xl bg-brand-background !p-0 sm:rounded-xl overflow-hidden sm:border-2 border-brand-primary/30" : "flex flex-col h-[75vh] max-h-[550px] shadow-2xl bg-brand-background !p-0 rounded-xl border border-brand-border";

  const renderInputArea = () => {
    if (isFinalStage || !currentQuestion) return null;

    if (currentQuestion.inputType === 'buttons' || currentQuestion.inputType === 'boolean') {
      const options = currentQuestion.inputType === 'boolean' ? ['Ja', 'Nein'] : currentQuestion.options ?? [];
      const singleButton = options.length === 1;
      return (
        <div className="p-3 sm:p-4 flex flex-col gap-3">
          <div className={`grid grid-cols-1 ${!singleButton && 'sm:grid-cols-2'} gap-2.5`}>
            {options.map((option) => (
              <button key={option} onClick={() => setSelectedOption(option)} className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out border-2 ${ selectedOption === option ? 'bg-brand-primary border-brand-primary-dark text-brand-secondary shadow-sm' : 'bg-brand-surface border-brand-border text-brand-text-on-light hover:bg-brand-primary/20 hover:border-brand-primary' }`}>
                {option}
              </button>
            ))}
          </div>
          {currentQuestion.id !== -1 && (
            <textarea value={textInputValue} onChange={(e) => setTextInputValue(e.target.value)} placeholder="Alternative Antwort oder Anmerkung... (optional)" className="w-full p-3 bg-brand-surface border border-brand-border text-brand-text-on-light rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm leading-relaxed resize-none placeholder-gray-400" rows={2} aria-label="Alternative Antwort oder zusätzliche Anmerkung" />
          )}
        </div>
      );
    }

    if (currentQuestion.inputType === 'text' || currentQuestion.inputType === 'textarea' || currentQuestion.inputType === 'number' || currentQuestion.inputType === 'list') {
      const InputComponent = currentQuestion.inputType === 'textarea' || currentQuestion.inputType === 'list' ? 'textarea' : 'input';
      const isOptional = currentQuestion.inputType === 'textarea' || currentQuestion.inputType === 'list';
      return (
        <div className="p-3 sm:p-4">
          <InputComponent type={currentQuestion.inputType === 'number' ? 'number' : 'text'} value={textInputValue} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTextInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleNext()} placeholder={`${currentQuestion.placeholder || "Ihre Antwort..."}${isOptional ? ' (Optional, mit Komma trennen)' : ''}`} className="w-full p-2.5 sm:p-3 bg-brand-surface border border-brand-border text-brand-text-on-light rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm leading-relaxed resize-none placeholder-gray-400" rows={currentQuestion.inputType === 'textarea' || currentQuestion.inputType === 'list' ? 4 : 1} aria-label="Ihre Antwort eingeben" />
        </div>
      );
    }
    return null;
  };

  const isNextDisabled = !selectedOption && !textInputValue.trim() && !(currentQuestion.inputType === 'textarea' || currentQuestion.inputType === 'list');

  return (
    <div className={containerClasses} role="dialog" aria-modal="true" aria-labelledby="chatbot-heading">
      <Card className={`${cardClasses} animate-fadeInUp`}>
        <header className="bg-brand-surface p-4 flex justify-between items-center sm:rounded-t-xl flex-shrink-0 border-b border-brand-border">
          <h2 id="chatbot-heading" className="text-lg sm:text-xl font-semibold text-brand-secondary font-serif">Ihr persönlicher Wegbegleiter</h2>
          {onSkip && (
            <button
              onClick={onSkip}
              aria-label="Überspringen"
              title="Überspringen"
              className="text-brand-primary hover:text-brand-primary-dark transition-colors p-1 rounded-md hover:bg-black/5 flex items-center gap-1 text-sm"
            >
              Überspringen <SkipIcon className="w-5 h-5" />
            </button>
          )}
        </header>

        <div className="flex-grow p-4 overflow-y-auto space-y-6 bg-brand-background">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                    <div className="flex-shrink-0 self-start mt-1">
                        {msg.isWarning ? (
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200">
                                <WarningIcon className="w-6 h-6 text-red-600" />
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center shadow-sm">
                                <BrainCircuitIcon className="w-6 h-6 text-brand-primary" />
                            </div>
                        )}
                    </div>
                )}
                <div className={`max-w-[85%] ${msg.sender === 'user' ? 'animate-slideInRight' : 'animate-slideInLeft'}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-lg ${
                        msg.sender === 'user' 
                            ? 'bg-brand-primary text-brand-secondary rounded-br-lg' 
                            : msg.isWarning 
                                ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-lg' 
                                : 'bg-white text-brand-text-on-light border border-brand-border/50 rounded-bl-lg'
                    }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-xs mt-2.5 ${
                            msg.sender === 'user' 
                                ? 'text-brand-secondary/80 text-right' 
                                : msg.isWarning 
                                    ? 'text-red-600/80 text-left' 
                                    : 'text-brand-text-on-light-secondary/80 text-left'
                        }`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
          ))}
          {isBotTyping && ( 
              <div className="flex items-end gap-3 justify-start animate-slideInLeft">
                <div className="flex-shrink-0 self-start mt-1">
                    <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center shadow-sm">
                        <BrainCircuitIcon className="w-6 h-6 text-brand-primary" />
                    </div>
                </div>
                <div className="max-w-[85%]">
                  <div className="px-4 py-3 rounded-2xl shadow-lg bg-white text-brand-text-on-light border border-brand-border/50 rounded-bl-lg flex items-center min-h-[44px]">
                      <div className="flex items-center space-x-1.5">
                          <div className="h-2 w-2 bg-brand-text-on-light-secondary rounded-full animate-pulse [animation-duration:1.4s]"></div>
                          <div className="h-2 w-2 bg-brand-text-on-light-secondary rounded-full animate-pulse [animation-duration:1.4s] [animation-delay:0.2s]"></div>
                          <div className="h-2 w-2 bg-brand-text-on-light-secondary rounded-full animate-pulse [animation-duration:1.4s] [animation-delay:0.4s]"></div>
                      </div>
                  </div>
                </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {!isFinalStage && (
          <div className="flex-shrink-0 bg-brand-background border-t border-brand-border">
            {renderInputArea()}
            <div className="p-3 sm:p-4 bg-brand-surface flex justify-between items-center sm:rounded-b-xl">
              <Button onClick={handleBack} disabled={history.length === 0} variant="outline" size="sm" className="flex items-center gap-2 !bg-transparent hover:!bg-brand-primary/20 !shadow-none !text-brand-secondary hover:!text-brand-secondary"> <BackArrowIcon className="w-4 h-4" /> Zurück </Button>
              <Button onClick={handleNext} disabled={isNextDisabled} variant="primary" size="sm" className="flex items-center gap-2"> Weiter <SendIcon className="w-4 h-4" /> </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
