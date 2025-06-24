# Redux Selected Nodes Implementation

## Overview
This implementation creates a Redux slice to collect and store all information regarding selected nodes in the ReactFlow board, making this data available for API routes and other components.

## Files Created/Modified

### 1. Redux Slice: `src/redux/slices/selectedNodesSlice.ts`
**Purpose**: Central state management for ReactFlow nodes

**Key Features**:
- Stores all nodes from the ReactFlow board
- Tracks currently selected node(s)
- Provides actions for updating node data
- Includes selectors for easy data access
- Designed to avoid Immer WritableDraft issues by using return patterns

**Main Actions**:
- `setAllNodes(nodes)` - Update all nodes from ReactFlow
- `setSelectedNode(node)` - Set the currently selected node
- `setSelectedNodes(nodes)` - Set multiple selected nodes
- `updateNode({nodeId, data})` - Update specific node data
- `syncNodes({allNodes, selectedNodes})` - Full sync operation
- `clearSelection()` - Clear all selections

**Key Selectors**:
- `selectAllNodes` - Get all nodes
- `selectSelectedNode` - Get currently selected node
- `selectSelectedNodes` - Get all selected nodes
- `selectNodesForAPI` - Get formatted data for API calls

### 2. Custom Hook: `src/hooks/useNodesSync.ts`
**Purpose**: Bridge between ReactFlow and Redux state

**Two Main Hooks**:

#### `useNodesSync()`
Lower-level hook with direct Redux operations

#### `useAgentBuilderSync()`
Higher-level hook specifically for AgentBuilder with convenience methods:
- `handleNodesChange(nodes)` - Handle ReactFlow onNodesChange
- `handleSelectionChange({nodes})` - Handle ReactFlow onSelectionChange  
- `handleNodeUpdate(nodeId, data)` - Handle node data updates
- `prepareForAPISubmission()` - Format data for API calls

### 3. Integration: `src/components/AgentBuilder.tsx`
**Changes Made**:
- Added `useAgentBuilderSync` hook import and integration
- Modified `onUpdateNode` to sync with Redux
- Added automatic syncing of nodes and selection changes
- Added `getAPIData()` method to the component ref interface
- Exposed API data preparation through the ref

### 4. Demo Component: `src/components/NodesDataViewer.tsx`
**Purpose**: Example component showing how to access and use the node data

**Features**:
- Displays current nodes count and selection status
- Shows selected node information
- Provides button to "send" data to API (currently logs to console)
- Expandable raw data viewer

### 5. Redux Store: `src/redux/store.ts`
**Changes**: Added `selectedNodesReducer` to the store configuration

## Usage Examples

### 1. In a Component (using selectors)
```typescript
import { useSelector } from 'react-redux';
import { selectNodesForAPI, selectSelectedNode } from '@/redux/slices/selectedNodesSlice';

const MyComponent = () => {
  const apiData = useSelector(selectNodesForAPI);
  const selectedNode = useSelector(selectSelectedNode);
  
  const sendToAPI = async () => {
    const response = await fetch('/api/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apiData),
    });
  };
};
```

### 2. Through AgentBuilder Ref
```typescript
const agentBuilderRef = useRef<AgentBuilderRef>(null);

const handleGetAPIData = () => {
  if (agentBuilderRef.current) {
    const apiData = agentBuilderRef.current.getAPIData();
    console.log('API Data:', apiData);
  }
};
```

### 3. Direct Redux Actions
```typescript
import { useDispatch } from 'react-redux';
import { setSelectedNode, updateNode } from '@/redux/slices/selectedNodesSlice';

const dispatch = useDispatch();

// Select a node
dispatch(setSelectedNode(someNode));

// Update node data
dispatch(updateNode({ nodeId: 'node-1', data: { newProperty: 'value' } }));
```

## API Data Structure

The `selectNodesForAPI` selector and `prepareForAPISubmission()` function return:

```typescript
{
  allNodes: Node[],           // All nodes in the flow
  selectedNodes: Node[],      // Currently selected nodes
  selectedNode: Node | null,  // Primary selected node
  totalNodes: number,         // Count of all nodes
  selectedCount: number,      // Count of selected nodes
  lastUpdated: string,        // ISO timestamp
  workflow: {
    nodes: Array<{
      id: string,
      type?: string,
      position: { x: number, y: number },
      data: Record<string, unknown>
    }>,
    selectedNodeId: string | null,
    metadata: {
      totalNodes: number,
      lastUpdated: string
    }
  }
}
```

## Key Benefits

1. **Centralized State**: All node data is available across the app via Redux
2. **Real-time Sync**: Changes in ReactFlow automatically update Redux state
3. **API Ready**: Data is pre-formatted for API consumption
4. **Type Safety**: Full TypeScript support with proper typing
5. **Debugging**: Easy to inspect node state in Redux DevTools
6. **Performance**: Optimized with useCallback and proper dependencies

## Next Steps

To use this implementation:

1. **Add to existing pages**: Import and use `NodesDataViewer` or create similar components
2. **Create API endpoints**: Use the formatted data structure for backend integration
3. **Extend functionality**: Add more node-specific actions as needed
4. **Add persistence**: Consider saving node state to localStorage or backend

The system is now ready to collect all ReactFlow node information and make it available for API routes or any other component that needs access to the current node state.
