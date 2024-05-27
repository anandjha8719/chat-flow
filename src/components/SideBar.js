import React from "react";
import BackArrowSvg from "../assets/BackArrowSVG.component";

const Sidebar = ({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
}) => {
  const handleInputChange = (event) => {
    setNodeName(event.target.value);
  };
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="border-2 border-grey-200 py-4 text-sm w-64 h-screen text-black">
      {selectedNode ? (
        <div className="flex flex-col align-center justify-center">
          <h3 className="text-xl mb-2 pb-2 text-blue-900 text-center border-b border-black">
            Message
          </h3>

          <div className="flex justify-between pr-28 items-center">
            <div
              onClick={() => setSelectedElements([])}
              className="cursor-pointer"
            >
              <BackArrowSvg />
            </div>
            <label className="block mb-2 text-sm font-medium text-blue-900">
              Text
            </label>
          </div>

          <input
            type="text"
            className="block w-full pt-2 px-3 pb-3 text-gray-700 border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            value={nodeName}
            onChange={handleInputChange}
          />

          {/* <button
            className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            onClick={() => setSelectedElements([])}
          >
            Go Back
          </button> */}
        </div>
      ) : (
        // Create Node Piece
        <>
          {/* <h3 className="text-xl mb-4 text-blue-900">Nodes Panel</h3> */}
          <div
            className="bg-white p-3 border-2 border-blue-500 rounded cursor-move flex flex-col justify-center items-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-200"
            onDragStart={(event) => onDragStart(event, "textnode")}
            draggable
          >
            <p>💬</p>
            <p>Message</p>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
