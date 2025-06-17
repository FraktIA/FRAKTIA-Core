import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  showNodesPanel: boolean;
  showPropertiesPanel: boolean;
  showSidebar: boolean;
  isLoading: boolean;
  activeNav: string | null;
  selectedNodeId: string | null;
  activeModal: string | null;
  showWalletDropdown: boolean;
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
    timestamp: number;
  }>;
  theme: "light" | "dark";
  panelSizes: {
    nodesPanel: number;
    propertiesPanel: number;
    sidebar: number;
  };
}

const initialState: UIState = {
  showNodesPanel: true,
  showPropertiesPanel: false,
  showSidebar: true,
  isLoading: false,
  selectedNodeId: null,
  activeModal: null,
  activeNav: "Framework",
  showWalletDropdown: false,
  notifications: [],
  theme: "dark",
  panelSizes: {
    nodesPanel: 300,
    propertiesPanel: 250,
    sidebar: 280,
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Active Navigation
    setActiveNav: (state, action: PayloadAction<string | null>) => {
      state.activeNav = action.payload;
    },

    // Nodes Panel
    toggleNodesPanel: (state) => {
      state.showNodesPanel = !state.showNodesPanel;
    },
    setShowNodesPanel: (state, action: PayloadAction<boolean>) => {
      state.showNodesPanel = action.payload;
    },

    // Properties Panel
    togglePropertiesPanel: (state) => {
      state.showPropertiesPanel = !state.showPropertiesPanel;
    },
    setShowPropertiesPanel: (state, action: PayloadAction<boolean>) => {
      state.showPropertiesPanel = action.payload;
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.showSidebar = !state.showSidebar;
    },
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Node selection
    setSelectedNodeId: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },

    // Modal management
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },

    // Wallet dropdown
    toggleWalletDropdown: (state) => {
      state.showWalletDropdown = !state.showWalletDropdown;
    },
    setShowWalletDropdown: (state, action: PayloadAction<boolean>) => {
      state.showWalletDropdown = action.payload;
    },

    // Notifications
    addNotification: (
      state,
      action: PayloadAction<{
        type: "success" | "error" | "warning" | "info";
        message: string;
      }>
    ) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Theme
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },

    // Panel sizes
    setPanelSize: (
      state,
      action: PayloadAction<{
        panel: "nodesPanel" | "propertiesPanel" | "sidebar";
        size: number;
      }>
    ) => {
      state.panelSizes[action.payload.panel] = action.payload.size;
    },

    // Reset all panels
    resetPanels: (state) => {
      state.showNodesPanel = true;
      state.showPropertiesPanel = false;
      state.showSidebar = true;
      state.panelSizes = initialState.panelSizes;
    },
  },
});

export const {
  toggleNodesPanel,
  setShowNodesPanel,
  togglePropertiesPanel,
  setShowPropertiesPanel,
  toggleSidebar,
  setShowSidebar,
  setLoading,
  setSelectedNodeId,
  openModal,
  closeModal,
  toggleWalletDropdown,
  setShowWalletDropdown,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleTheme,
  setTheme,
  setPanelSize,
  resetPanels,
  setActiveNav,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectShowNodesPanel = (state: { ui: UIState }) =>
  state.ui.showNodesPanel;
export const selectShowPropertiesPanel = (state: { ui: UIState }) =>
  state.ui.showPropertiesPanel;
export const selectShowSidebar = (state: { ui: UIState }) =>
  state.ui.showSidebar;
export const selectIsLoading = (state: { ui: UIState }) => state.ui.isLoading;
export const selectSelectedNodeId = (state: { ui: UIState }) =>
  state.ui.selectedNodeId;
export const selectActiveModal = (state: { ui: UIState }) =>
  state.ui.activeModal;
export const selectShowWalletDropdown = (state: { ui: UIState }) =>
  state.ui.showWalletDropdown;
export const selectNotifications = (state: { ui: UIState }) =>
  state.ui.notifications;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectPanelSizes = (state: { ui: UIState }) => state.ui.panelSizes;
export const selectActiveNav = (state: { ui: UIState }) => state.ui.activeNav;
