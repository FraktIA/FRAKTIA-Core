import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  showNodesPanel: boolean;
  showPropertiesPanel: boolean;
  activeMenu: string;
  showSidebar: boolean;
  isLoading: boolean;
  activeNav: string | null;
  nodesPanelCategory: string | null; // Separate state for Nodes panel content
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
  // Agent Builder Flow
  agentBuilderFlow: {
    currentStep: number;
    totalSteps: number;
    completedSteps: string[];
    steps: string[];
  };
}

const initialState: UIState = {
  showNodesPanel: true,
  activeMenu: "Arena",
  showPropertiesPanel: false,
  showSidebar: true,
  isLoading: false,
  selectedNodeId: null,
  activeModal: null,
  activeNav: "Framework",
  nodesPanelCategory: "Framework", // Initialize with Framework
  showWalletDropdown: false,
  notifications: [],
  theme: "dark",
  panelSizes: {
    nodesPanel: 300,
    propertiesPanel: 250,
    sidebar: 280,
  },
  // Agent Builder Flow
  agentBuilderFlow: {
    currentStep: 1,
    totalSteps: 5,
    completedSteps: [],
    steps: ["Framework", "AI Model", "Voice", "Character", "Plugins"],
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

    // Nodes Panel Category (separate from activeNav)
    setNodesPanelCategory: (state, action: PayloadAction<string | null>) => {
      state.nodesPanelCategory = action.payload;
    },

    // Active Menu
    setActiveMenu: (state, action: PayloadAction<string>) => {
      state.activeMenu = action.payload;
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

    // Agent Builder Flow
    nextStep: (state) => {
      if (
        state.agentBuilderFlow.currentStep < state.agentBuilderFlow.totalSteps
      ) {
        const currentStepName =
          state.agentBuilderFlow.steps[state.agentBuilderFlow.currentStep - 1];
        if (!state.agentBuilderFlow.completedSteps.includes(currentStepName)) {
          state.agentBuilderFlow.completedSteps.push(currentStepName);
        }
        state.agentBuilderFlow.currentStep += 1;
        const nextStepName =
          state.agentBuilderFlow.steps[state.agentBuilderFlow.currentStep - 1];
        state.activeNav = nextStepName;
        state.nodesPanelCategory = nextStepName; // Also update nodes panel category
      }
    },
    previousStep: (state) => {
      if (state.agentBuilderFlow.currentStep > 1) {
        state.agentBuilderFlow.currentStep -= 1;
        const prevStepName =
          state.agentBuilderFlow.steps[state.agentBuilderFlow.currentStep - 1];
        state.activeNav = prevStepName;
        state.nodesPanelCategory = prevStepName; // Also update nodes panel category
        // On going back, pop the last completed step to un-highlight it
        state.agentBuilderFlow.completedSteps.pop();
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      const stepNumber = action.payload;
      if (stepNumber >= 1 && stepNumber <= state.agentBuilderFlow.totalSteps) {
        state.agentBuilderFlow.currentStep = stepNumber;
        const stepName = state.agentBuilderFlow.steps[stepNumber - 1];
        state.activeNav = stepName;
        state.nodesPanelCategory = stepName; // Also update nodes panel category

        // Mark all previous steps as completed when jumping to a step
        state.agentBuilderFlow.completedSteps = [];
        for (let i = 0; i < stepNumber - 1; i++) {
          const stepName = state.agentBuilderFlow.steps[i];
          if (
            stepName &&
            !state.agentBuilderFlow.completedSteps.includes(stepName)
          ) {
            state.agentBuilderFlow.completedSteps.push(stepName);
          }
        }
      }
    },
    completeStep: (state, action: PayloadAction<string>) => {
      const stepName = action.payload;
      if (!state.agentBuilderFlow.completedSteps.includes(stepName)) {
        state.agentBuilderFlow.completedSteps.push(stepName);
      }
    },
    resetAgentBuilderFlow: (state) => {
      state.agentBuilderFlow = initialState.agentBuilderFlow;
      state.activeNav = state.agentBuilderFlow.steps[0];
      state.nodesPanelCategory = state.agentBuilderFlow.steps[0]; // Also reset nodes panel category
    },
    setAgentBuilderSteps: (state, action: PayloadAction<string[]>) => {
      state.agentBuilderFlow.steps = action.payload;
      state.agentBuilderFlow.totalSteps = action.payload.length;
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
  setNodesPanelCategory,
  setActiveMenu,
  nextStep,
  previousStep,
  goToStep,
  completeStep,
  resetAgentBuilderFlow,
  setAgentBuilderSteps,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectActiveMenu = (state: { ui: UIState }) => state.ui.activeMenu;
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
export const selectNodesPanelCategory = (state: { ui: UIState }) =>
  state.ui.nodesPanelCategory;
export const selectAgentBuilderFlow = (state: { ui: UIState }) =>
  state.ui.agentBuilderFlow;
