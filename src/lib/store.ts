import { create } from 'zustand';
import { supabase } from './supabase';

export interface AppStore {
  userId: string | null;
  currentSection: string;
  percentageComplete: number;
  setUserId: (id: string) => void;
  setProgress: (section: string, percentage: number) => void;
  loadProgress: () => Promise<void>;
  saveProgress: (section: string, percentage: number) => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  userId: null,
  currentSection: 'intro',
  percentageComplete: 0,
  
  setUserId: (id) => set({ userId: id }),
  
  setProgress: (section, percentage) => set({ currentSection: section, percentageComplete: percentage }),
  
  loadProgress: async () => {
    const { userId } = get();
    if (!userId) return;
    
    const { data } = await supabase
      .from('participant_progress')
      .select('current_section, percentage_complete')
      .eq('user_id', userId)
      .single();
      
    if (data) {
      set({ currentSection: data.current_section, percentageComplete: data.percentage_complete });
    } else {
      // Initialize if not exists
      await supabase.from('participant_progress').insert({
        user_id: userId,
        current_section: 'intro',
        percentage_complete: 0
      });
    }
  },
  
  saveProgress: async (section, percentage) => {
    const { userId } = get();
    if (!userId) return;
    
    set({ currentSection: section, percentageComplete: percentage });
    
    await supabase
      .from('participant_progress')
      .update({
        current_section: section,
        percentage_complete: percentage,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }
}));
