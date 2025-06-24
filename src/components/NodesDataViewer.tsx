import React from "react";
import { useSelector } from "react-redux";
import { selectNodesForAPI } from "@/redux/slices/selectedNodesSlice";

/**
 * Example component that demonstrates how to access and use the selected nodes data
 * This could be used to send data to an API endpoint
 */
const NodesDataViewer: React.FC = () => {
  const nodesData = useSelector(selectNodesForAPI);

  const handleSendToAPI = async () => {
    try {
      console.log("Sending nodes data to API:", nodesData);

      // Example API call
      // const response = await fetch('/api/nodes', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(nodesData),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to send data to API');
      // }

      // const result = await response.json();
      // console.log('API response:', result);

      alert("Data logged to console (check developer tools)");
    } catch (error) {
      console.error("Error sending data to API:", error);
      alert("Error sending data to API");
    }
  };

  return (
    <div className="p-4 bg-dark rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Nodes Data for API</h3>

      <div className="mb-4 space-y-2">
        <div>
          <span className="font-medium">Total Nodes:</span>{" "}
          {nodesData.totalNodes}
        </div>
        <div>
          <span className="font-medium">Selected Nodes:</span>{" "}
          {nodesData.selectedCount}
        </div>
        <div>
          <span className="font-medium">Last Updated:</span>{" "}
          {nodesData.lastUpdated || "Never"}
        </div>
        {nodesData.selectedNode && (
          <div>
            <span className="font-medium">Selected Node:</span>{" "}
            {String(nodesData.selectedNode.data?.label) || "Unknown"}
          </div>
        )}
      </div>

      <button
        onClick={handleSendToAPI}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={nodesData.totalNodes === 0}
      >
        Send Data to API
      </button>

      {/* Show detailed data in a collapsible section */}
      <details className="mt-4">
        <summary className="cursor-pointer font-medium">View Raw Data</summary>
        <pre className="mt-2 p-2 bg-bg rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(nodesData, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default NodesDataViewer;
