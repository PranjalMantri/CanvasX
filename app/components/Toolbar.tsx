import { ToolType } from "../types/canvas";

interface ToolBarProps {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  onUndo: () => void;
  onRedo: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ tool, setTool, onUndo, onRedo }) => (
  <div
    style={{
      position: "fixed",
      top: 10,
      left: 10,
      zIndex: 2,
      background: "white",
      padding: "8px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}
  >
    <button
      onClick={onUndo}
      style={{ marginRight: "8px", padding: "4px 8px" }}
      title="Undo (Ctrl+Z)"
    >
      ↶ Undo
    </button>
    <button
      onClick={onRedo}
      style={{ marginRight: "12px", padding: "4px 8px" }}
      title="Redo (Ctrl+Y)"
    >
      ↷ Redo
    </button>
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
    <label htmlFor="tool-rectangle" style={{ marginLeft: "4px" }}>
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
    <label htmlFor="tool-circle" style={{ marginLeft: "4px" }}>
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
    <label htmlFor="tool-diamond" style={{ marginLeft: "4px" }}>
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
    <label htmlFor="tool-selection" style={{ marginLeft: "4px" }}>
      Selection
    </label>
    <input
      type="radio"
      id="tool-pencil"
      name="toolType"
      value="pencil"
      checked={tool === "pencil"}
      onChange={() => setTool("pencil")}
    />
    <label htmlFor="tool-pencil" style={{ marginLeft: "4px" }}>
      Pencil
    </label>

    <input
      type="radio"
      id="tool-text"
      name="toolType"
      value="text"
      checked={tool === "text"}
      onChange={() => setTool("text")}
    />
    <label htmlFor="tool-text" style={{ marginLeft: "4px" }}>
      Text
    </label>
  </div>
);

export default ToolBar;
