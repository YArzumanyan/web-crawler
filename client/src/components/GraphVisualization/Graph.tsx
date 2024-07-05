import React, { useContext, useEffect, useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { Node, Website } from "../../types";
import "./Graph.module.scss";
import { GraphContext } from "../../context/GraphContext";
import { Core } from "cytoscape";
import NodeDetailModal from "./NodeDetailModal";

interface GraphVisualizationProps {
  website: Website;
}

type CytoscapeNode = {
  data: {
    id: string;
    label: string;
  };
};

type CytoscapeEdge = {
  data: {
    source: string;
    target: string;
  };
};

const GraphVisualization: React.FC<GraphVisualizationProps> = ({ website }) => {
  const { nodes, fetchWebsiteNodes } = useContext(GraphContext);
  const [elements, setElements] = useState<{
    nodes: CytoscapeNode[];
    edges: CytoscapeEdge[];
  }>({ nodes: [], edges: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const cyRef = useRef<Core | null>(null);

  useEffect(() => {
    fetchWebsiteNodes(website.id);
  }, [fetchWebsiteNodes, website.id]);

  useEffect(() => {
    if (nodes.length === 0) return;

    const nodesMap = new Map<string, Node>();
    nodes.forEach((node) => nodesMap.set(node.id, node));

    const nodeElements = nodes.map((node: Node) => ({
      data: { id: node.id, label: node.id || node.url },
    }));

    const edgeElements = nodes
      .map((node: Node) =>
        node.matchLinksRecordIds.map((id) => ({
          data: { source: node.id, target: nodesMap.get(id)?.id ?? "" },
        }))
      )
      .flat();

    setElements({ nodes: nodeElements, edges: edgeElements });
  }, [nodes]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current
        .layout({
          name: "breadthfirst",
          directed: true,
          animate: true,
          spacingFactor: 1.5,
          avoidOverlap: true,
          nodeDimensionsIncludeLabels: true,
          maximalAdjustments: 0,
          fit: true,
        })
        .run();

      cyRef.current.on("tap", "node", function (evt) {
        const nodeId = evt.target.id();
        const node = nodes.find((n) => n.id === nodeId);
        if (node) {
          setSelectedNode(node);
          setIsModalOpen(true);
        }
      });

      return () => {
        cyRef.current?.removeListener("tap");
      };
    }
  }, [elements, nodes]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNode(null);
  };

  return (
    <>
      <CytoscapeComponent
        cy={(cy) => {
          cyRef.current = cy;
        }}
        elements={CytoscapeComponent.normalizeElements(elements)}
        style={{ width: "100%", height: "600px" }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "#0074D9",
              color: "#fff",
              "font-size": "10px",
              "text-wrap": "wrap",
              "text-max-width": "80px",
            },
          },
          {
            selector: "edge",
            style: {
              width: 2,
              "line-color": "#ccc",
              "target-arrow-color": "#ccc",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
            },
          },
        ]}
      />
      <NodeDetailModal
        node={selectedNode}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default GraphVisualization;
