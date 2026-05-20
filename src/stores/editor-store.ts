import { create } from 'zustand'

const PANEL_STORAGE_KEY = 'gdw-panel-layout'

interface PanelLayout {
  sizes: number[]
  previewCollapsed: boolean
  sidebarCollapsed: boolean
}

function loadPanelLayout(): PanelLayout {
  if (typeof window === 'undefined') {
    return { sizes: [45, 35, 20], previewCollapsed: false, sidebarCollapsed: false }
  }
  try {
    const raw = localStorage.getItem(PANEL_STORAGE_KEY)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // ignore
  }
  return { sizes: [45, 35, 20], previewCollapsed: false, sidebarCollapsed: false }
}

function countWords(text: string): number {
  // Count Chinese characters + English words
  const chineseChars = (text.match(/[一-龥]/g) || []).length
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
  return chineseChars + englishWords
}

interface EditorState {
  // Content
  content: string
  setContent: (content: string) => void
  initContent: (content: string) => void

  // Save state
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: Date | null
  setIsDirty: (dirty: boolean) => void
  setIsSaving: (saving: boolean) => void
  markSaved: () => void

  // Word count
  wordCount: number

  // UI state
  showPreview: boolean
  showSidebar: boolean
  togglePreview: () => void
  toggleSidebar: () => void
  setPreviewCollapsed: (collapsed: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Focus mode
  focusMode: boolean
  toggleFocusMode: () => void

  // Panel layout
  panelSizes: number[]
  setPanelSizes: (sizes: number[]) => void
}

const initialLayout = loadPanelLayout()

export const useEditorStore = create<EditorState>((set, get) => ({
  // Content
  content: '',
  setContent: (content) => set({ content, isDirty: true, wordCount: countWords(content) }),
  initContent: (content) => set({ content, isDirty: false, wordCount: countWords(content) }),

  // Save state
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  setIsDirty: (isDirty) => set({ isDirty }),
  setIsSaving: (isSaving) => set({ isSaving }),
  markSaved: () => set({ isDirty: false, isSaving: false, lastSavedAt: new Date() }),

  // Word count
  wordCount: 0,

  // UI state
  showPreview: !initialLayout.previewCollapsed,
  showSidebar: !initialLayout.sidebarCollapsed,
  togglePreview: () => {
    const newVal = !get().showPreview
    set({ showPreview: newVal })
  },
  toggleSidebar: () => {
    const newVal = !get().showSidebar
    set({ showSidebar: newVal })
  },
  setPreviewCollapsed: (collapsed: boolean) => set({ showPreview: !collapsed }),
  setSidebarCollapsed: (collapsed: boolean) => set({ showSidebar: !collapsed }),

  // Focus mode
  focusMode: false,
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),

  // Panel layout
  panelSizes: initialLayout.sizes,
  setPanelSizes: (sizes) => {
    set({ panelSizes: sizes })
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        PANEL_STORAGE_KEY,
        JSON.stringify({
          sizes,
          previewCollapsed: !get().showPreview,
          sidebarCollapsed: !get().showSidebar,
        })
      )
    }
  },
}))
