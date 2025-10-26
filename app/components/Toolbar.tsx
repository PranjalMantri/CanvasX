import { ToolType } from "../types/canvas";

interface ToolBarProps {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ tool, setTool }) => (
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
    }}
  >
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
  </div>
);

export default ToolBar;
