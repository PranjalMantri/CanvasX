import { ToolType } from "../types/canvas";

interface ToolBarProps {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  undo: () => void; // 👈 Add undo function prop
  redo: () => void; // 👈 Add redo function prop
}

const ToolBar: React.FC<ToolBarProps> = ({ tool, setTool, undo, redo }) => (
  <div
    style={{
      position: "fixed",
      top: 10,
      left: 10,
      zIndex: 1,
      background: "white",
      padding: "8px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      display: "flex", // Added for better button alignment
      alignItems: "center", // Added for better button alignment
    }}
  >
    {/* --- Existing Tool Inputs --- */}
    <input
      type="radio"
      id="tool-line"
      name="toolType"
      value="line"
      checked={tool === "line"}
      onChange={() => setTool("line")}
    />
    <label
      htmlFor="tool-line"
      style={{ marginLeft: "4px", marginRight: "12px" }}
    >
      Line
    </label>
    <input
      type="radio"
      id="tool-rectangle"
      name="toolType"
      value="rectangle"
      checked={tool === "rectangle"}
      onChange={() => setTool("rectangle")}
    />
    <label
      htmlFor="tool-rectangle"
      style={{ marginLeft: "4px", marginRight: "12px" }}
    >
      Rectangle
    </label>
    <input
      type="radio"
      id="tool-circle"
      name="toolType"
      value="circle"
      checked={tool === "circle"}
      onChange={() => setTool("circle")}
    />
    <label
      htmlFor="tool-circle"
      style={{ marginLeft: "4px", marginRight: "12px" }}
    >
      Circle
    </label>
    <input
      type="radio"
      id="tool-diamond"
      name="toolType"
      value="diamond"
      checked={tool === "diamond"}
      onChange={() => setTool("diamond")}
    />
    <label
      htmlFor="tool-diamond"
      style={{ marginLeft: "4px", marginRight: "12px" }}
    >
      Diamond
    </label>
    <input
      type="radio"
      id="tool-selection"
      name="toolType"
      value="selection"
      checked={tool === "selection"}
      onChange={() => setTool("selection")}
    />
    <label
      htmlFor="tool-selection"
      style={{ marginLeft: "4px", marginRight: "12px" }}
    >
      Selection
    </label>

    {/* --- Added Undo/Redo Buttons --- */}
    <button
      onClick={undo}
      style={{ marginLeft: "8px", cursor: "pointer", padding: "4px 8px" }}
    >
      Undo
    </button>
    <button
      onClick={redo}
      style={{ marginLeft: "4px", cursor: "pointer", padding: "4px 8px" }}
    >
      Redo
    </button>
  </div>
);

export default ToolBar;
