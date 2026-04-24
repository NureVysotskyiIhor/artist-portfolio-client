import {create} from 'zustand'
interface UIState {
    isSideBarOpen: boolean
    toggleSideBar: () => void
    setSideBarOpen: (isOpen: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
    isSideBarOpen: false,
    toggleSideBar: () => set((state) => ({ isSideBarOpen: !state.isSideBarOpen })),
    setSideBarOpen: (isOpen: boolean) => set({ isSideBarOpen: isOpen }),
}))