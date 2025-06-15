import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

// Type definitions
interface NeuralNetworkProps {
  numClusters?: number;
  nodesPerCluster?: number;
  nodeSize?: {
    min: number;
    max: number;
  };
  opacity?: {
    min: number;
    max: number;
  };
  connectionDistance?: {
    intraCluster: number;
    interCluster: number;
  };
  interClusterConnectionChance?: number;
}

// Neural Network Background
export const NeuralNetworkBackground = ({
  numClusters = 16,
  nodesPerCluster = 8,
  nodeSize = { min: 0.5, max: 2.5 },
  opacity = { min: 0.15, max: 0.15 },
  connectionDistance = { intraCluster: 5, interCluster: 60 },
  interClusterConnectionChance = 0.3,
}: NeuralNetworkProps) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize the node generation to ensure consistency after hydration
  const clusters = useMemo(() => {
    if (!isClient) return [];

    return Array.from({ length: numClusters }, (_, clusterIndex) => {
      // Calculate grid dimensions based on number of clusters
      const gridCols = Math.ceil(Math.sqrt(numClusters));
      const gridRows = Math.ceil(numClusters / gridCols);

      // Calculate cluster position in grid
      const col = clusterIndex % gridCols;
      const row = Math.floor(clusterIndex / gridCols);

      // Distribute clusters evenly across the screen
      const centerX = 15 + col * (70 / (gridCols - 1 || 1));
      const centerY = 15 + row * (70 / (gridRows - 1 || 1));

      return Array.from({ length: nodesPerCluster }, (_, i) => ({
        id: `${clusterIndex}-${i}`,
        // Create nodes within a smaller radius around the cluster center
        x: centerX + (Math.random() - 0.5) * 20,
        y: centerY + (Math.random() - 0.5) * 20,
        size: Math.random() * (nodeSize.max - nodeSize.min) + nodeSize.min,
        delay: Math.random() * 2,
        cluster: clusterIndex,
        // Pre-calculate animation delays to avoid hydration issues
        lineDelay: Math.random() * 3,
        interLineDelay: Math.random() * 4,
        // Pre-calculate inter-cluster connection decision
        shouldConnect: Math.random() > 1 - interClusterConnectionChance,
      }));
    });
  }, [
    isClient,
    numClusters,
    nodesPerCluster,
    nodeSize,
    interClusterConnectionChance,
  ]);

  const nodes = clusters.flat();

  // Don't render anything on the server
  if (!isClient) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full">
        {/* Connections between nodes within the same cluster */}
        {clusters.map((cluster, clusterIndex) =>
          cluster.map((node, i) =>
            cluster.slice(i + 1).map((otherNode, j) => {
              const distance = Math.sqrt(
                Math.pow(node.x - otherNode.x, 2) +
                  Math.pow(node.y - otherNode.y, 2)
              );
              if (distance < connectionDistance.intraCluster) {
                return (
                  <motion.line
                    key={`line-${clusterIndex}-${i}-${j}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${otherNode.x}%`}
                    y2={`${otherNode.y}%`}
                    stroke="#F8FF99"
                    strokeWidth="0.3"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, opacity.min, 0],
                      strokeWidth: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: node.lineDelay,
                    }}
                  />
                );
              }
              return null;
            })
          )
        )}

        {/* Occasional connections between clusters */}
        {clusters.map((cluster, clusterIndex) =>
          cluster.slice(0, 2).map((node, nodeIndex) =>
            clusters
              .slice(clusterIndex + 1)
              .map((otherCluster, otherClusterIndex) =>
                otherCluster.slice(0, 2).map((otherNode, otherNodeIndex) => {
                  const distance = Math.sqrt(
                    Math.pow(node.x - otherNode.x, 2) +
                      Math.pow(node.y - otherNode.y, 2)
                  );
                  if (
                    distance < connectionDistance.interCluster &&
                    node.shouldConnect
                  ) {
                    return (
                      <motion.line
                        key={`inter-cluster-${clusterIndex}-${nodeIndex}-${otherClusterIndex}-${otherNodeIndex}`}
                        x1={`${node.x}%`}
                        y1={`${node.y}%`}
                        x2={`${otherNode.x}%`}
                        y2={`${otherNode.y}%`}
                        stroke="#F8FF99"
                        strokeWidth="0.2"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, opacity.min * 0.75, 0],
                          strokeWidth: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: node.interLineDelay,
                        }}
                      />
                    );
                  }
                  return null;
                })
              )
          )
        )}

        {/* Animated nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="#F8FF99"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [opacity.min, opacity.max, opacity.min],
              scale: [0.8, 1.1, 0.8],
              r: [node.size, node.size + 1, node.size],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: node.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Geometric Grid Background
export const GeometricGridBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const gridSize = 8;
  const cells = useMemo(() => {
    if (!isClient) return [];

    return Array.from({ length: gridSize * gridSize }, (_, i) => ({
      id: i,
      x: (i % gridSize) * (100 / gridSize),
      y: Math.floor(i / gridSize) * (100 / gridSize),
      delay: Math.random() * 4,
    }));
  }, [isClient, gridSize]);

  if (!isClient) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <svg className="w-full h-full">
        {cells.map((cell) => (
          <motion.rect
            key={cell.id}
            x={`${cell.x}%`}
            y={`${cell.y}%`}
            width={`${100 / gridSize}%`}
            height={`${100 / gridSize}%`}
            fill="none"
            stroke="#F8FF99"
            strokeWidth="0.5"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              strokeWidth: [0.5, 2, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: cell.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
};

// Flowing Data Streams
export const DataStreamBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const streams = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: (i * 15) % 100,
    delay: i * 0.5,
  }));

  const binaryElements = useMemo(() => {
    if (!isClient) return [];

    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 95,
      top: Math.random() * 95,
      delay: Math.random() * 4,
      text: Math.random() > 0.5 ? "01" : "10",
    }));
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary to-transparent"
          style={{
            left: `${stream.x}%`,
            height: "200px",
          }}
          initial={{ y: "-200px", opacity: 0 }}
          animate={{
            y: ["calc(100vh + 200px)"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: stream.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Binary code overlay */}
      <div className="absolute inset-0 text-primary/20 text-xs leading-4 whitespace-pre overflow-hidden">
        {binaryElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute"
            style={{
              left: `${element.left}%`,
              top: `${element.top}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -20, -40],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: element.delay,
            }}
          >
            {element.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Particles Background Component
export const ParticlesBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const particleData = useMemo(() => {
    if (!isClient) return [];

    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      xMovement: Math.random() * 20 - 10,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2,
    }));
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none" />
    );
  }

  // Original particles for comparison
  const particles = particleData.map((particle) => (
    <motion.div
      key={particle.id}
      className="particle"
      style={{
        width: particle.width,
        height: particle.height,
        left: `${particle.left}%`,
        top: `${particle.top}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, particle.xMovement, 0],
        opacity: [0.3, 0.8, 0.3],
      }}
      transition={{
        duration: particle.duration,
        repeat: Infinity,
        delay: particle.delay,
      }}
    />
  ));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles}
    </div>
  );
};

// Dynamic background selector
export const DynamicBackground = ({
  type = "neural",
  neuralProps,
}: {
  type?: "neural" | "grid" | "stream" | "particles";
  neuralProps?: NeuralNetworkProps;
}) => {
  switch (type) {
    case "neural":
      return <NeuralNetworkBackground {...neuralProps} />;
    case "grid":
      return <GeometricGridBackground />;
    case "stream":
      return <DataStreamBackground />;
    case "particles":
    default:
      return <ParticlesBackground />;
  }
};
