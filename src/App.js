import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
} from "reactflow";
import "reactflow/dist/base.css";

import Sidebar from "./components/SideBar";
import TextNode from "./components/TextNode";
import NavBar from "./components/NavBar";

// local storage key name
const flowKey = "flow-key";

// Initial node setup
const initialNodes = [
  {
    id: "1",
    type: "textnode",
    data: { label: "Text Node" },
    position: { x: 250, y: 5 },
  },
];

let id = 0;

// unique IDs for nodes
const getId = () => `node_${id++}`;

const App = () => {
  // custom node types
  const nodeTypes = useMemo(
    () => ({
      textnode: TextNode,
    }),
    []
  );

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [saveErrorOrSuccess, setSaveErrorORSuccess] = useState({});
  const [nodeName, setNodeName] = useState("");

  // Update nodes data based on nodeName or selectedElements change
  useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
            };
          }
          return node;
        })
      );
    } else {
      setNodeName(""); // Clear nodeName when no node is selected
    }
  }, [nodeName, selectedElements, setNodes]);

  //get previous flow, now using as this is not mentioned
  // useEffect(() => {
  //   const getSavedFlow = async () => {
  //     const flow = JSON.parse(localStorage.getItem(flowKey));

  //     if (flow) {
  //       const { x = 0, y = 0, zoom = 1 } = flow.viewport;
  //       setNodes(flow.nodes || []);
  //       setEdges(flow.edges || []);
  //     }
  //   };
  //   getSavedFlow()
  // }, []);
  // Handle node click
  const onNodeClick = useCallback((event, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.label);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  // Checking for empty target handles
  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  // Check for unconnected nodes
  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  // Save to local storage
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        setSaveErrorORSuccess({
          type: "error",
          message: "Cannot Save Flow",
        });
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(flowKey, JSON.stringify(flow));
        setSaveErrorORSuccess({
          type: "success",
          message: "Save Successfull",
        });
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  //connecting edges
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nodes) => nodes.concat(newNode));
    },
    [reactFlowInstance]
  );

  const rfStyle = {
    backgroundColor: "#ffffff",
  };

  return (
    <div className="flex flex-col min-h-screen lg:flex-col">
      <NavBar onClick={onSave} actionResult={saveErrorOrSuccess}>
        <button className="m-2 bg-white  hover:bg-blue-700 text-blue-700 hover:text-white font-bold py-2 px-6 rounded border-2 border-blue-600 ">
          Save Changes
        </button>
      </NavBar>
      <div className="flex flex-row min-h-screen lg:flex-row mt-0">
        <div className="flex-grow h-screen" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            nodeTypes={nodeTypes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={rfStyle}
            onNodeClick={onNodeClick}
            onPaneClick={() => {
              setSelectedElements([]);
              setNodes((nodes) =>
                nodes.map((n) => ({
                  ...n,
                  selected: false,
                }))
              );
            }}
            fitView
          >
            <Controls />
            <MiniMap zoomable pannable />
          </ReactFlow>
        </div>

        <Sidebar
          nodeName={nodeName}
          setNodeName={setNodeName}
          selectedNode={selectedElements[0]}
          setSelectedElements={setSelectedElements}
        />
      </div>
    </div>
  );
};

export default App;
