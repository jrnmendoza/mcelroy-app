import { create } from 'zustand';


export interface SessionState {
  id: string;
  join_code: string;
  status: 'lobby' | 'active' | 'completed';
  current_stage: number;
  active_question: string | null;
  reveal_results: boolean;
  discussion_mode: boolean;
  host_id: string;
}

interface AppStore {
  session: SessionState | null;
  participantId: string | null;
  isHost: boolean;
  setSession: (session: SessionState) => void;
  setParticipantId: (id: string) => void;
  setIsHost: (isHost: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  session: null,
  participantId: null,
  isHost: false,
  setSession: (session) => set({ session }),
  setParticipantId: (id) => set({ participantId: id }),
  setIsHost: (isHost) => set({ isHost }),
}));
