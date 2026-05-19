import { create } from 'zustand'

interface EditorState {
  // Content
  content: string
  setContent: (content: string) => void

  // Save state
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: Date | null
  setIsDirty: (dirty: boolean) => void
  setIsSaving: (saving: boolean) => void
  markSaved: () => void

  // UI state
  showPreview: boolean
  showSidebar: boolean
  togglePreview: () => void
  toggleSidebar: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  // Content
  content: '',
  setContent: (content) => set({ content, isDirty: true }),

  // Save state
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  setIsDirty: (isDirty) => set({ isDirty }),
  setIsSaving: (isSaving) => set({ isSaving }),
  markSaved: () => set({ isDirty: false, isSaving: false, lastSavedAt: new Date() }),

  // UI state
  showPreview: true,
  showSidebar: true,
  togglePreview: () => set((s) => ({ showPreview: !s.showPreview })),
  toggleSidebar: () => set((s) => ({ showSidebar: !s.showSidebar })),
}))
