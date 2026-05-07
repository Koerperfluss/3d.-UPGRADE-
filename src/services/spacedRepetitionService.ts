import { QuizQuestion, SpacedRepetitionItem } from '../types';

const STORAGE_KEY = 'koerperfluss_spaced_repetition';

// Simple Spaced Repetition Algorithm (inspired by SM-2)
export const spacedRepetitionService = {
  
  getItems(): SpacedRepetitionItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveItems(items: SpacedRepetitionItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },

  // Add new questions to the pool if they don't exist yet
  addQuestionsToPool(questions: QuizQuestion[]) {
    const currentItems = this.getItems();
    const newItems: SpacedRepetitionItem[] = [];

    questions.forEach(q => {
      // Check if question essentially already exists (simple check by question text)
      const exists = currentItems.some(item => item.question.question === q.question);
      if (!exists) {
        newItems.push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          question: q,
          interval: 0,
          easeFactor: 2.5,
          nextReviewDate: new Date().toISOString(), // Due immediately
          repetitionCount: 0
        });
      }
    });

    if (newItems.length > 0) {
      this.saveItems([...currentItems, ...newItems]);
    }
  },

  getDueItems(): SpacedRepetitionItem[] {
    const items = this.getItems();
    const now = new Date();
    return items.filter(item => new Date(item.nextReviewDate) <= now);
  },

  // Process answer (quality: 0=wrong, 3=correct hard, 5=correct easy)
  processReview(itemId: string, quality: number) {
    const items = this.getItems();
    const index = items.findIndex(i => i.id === itemId);
    
    if (index === -1) return;

    const item = items[index];
    
    // Algorithm Logic
    if (quality < 3) {
      // If answered incorrectly, reset interval
      item.repetitionCount = 0;
      item.interval = 1;
    } else {
      // If correct
      if (item.repetitionCount === 0) {
        item.interval = 1;
      } else if (item.repetitionCount === 1) {
        item.interval = 6;
      } else {
        item.interval = Math.round(item.interval * item.easeFactor);
      }
      item.repetitionCount += 1;
    }

    // Update ease factor (standard SM-2 formula)
    item.easeFactor = item.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (item.easeFactor < 1.3) item.easeFactor = 1.3;

    // Set next date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + item.interval);
    item.nextReviewDate = nextDate.toISOString();

    items[index] = item;
    this.saveItems(items);
  },

  getStats() {
    const items = this.getItems();
    const due = this.getDueItems().length;
    const total = items.length;
    return { total, due };
  }
};