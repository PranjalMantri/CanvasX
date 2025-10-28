"use client";

import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-zinc-700 transition-colors duration-150"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </DialogTrigger>

      <DialogContent
        className="bg-zinc-900 border border-zinc-700 text-white max-w-md max-h-[80vh] overflow-y-auto"
        style={{
          backgroundColor: "#18181b",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-[#FFA500] text-xl">
            How to Use CanvasX
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Everything you need to know to get started
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* Overview */}
          <section>
            <h3 className="text-[#FFA500] font-semibold mb-2">About CanvasX</h3>
            <p className="text-neutral-300">
              CanvasX is a collaborative drawing and sketching tool. Create and
              edit beautiful drawings, shapes, and diagrams. Share your canvas
              with others in real-time to collaborate together!
            </p>
          </section>

          {/* Drawing Tools */}
          <section>
            <h3 className="text-[#FFA500] font-semibold mb-2">Drawing Tools</h3>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <span className="font-medium">Selection Tool</span> - Select,
                move, and resize elements
              </li>
              <li>
                <span className="font-medium">Pencil</span> - Draw freehand
                sketches
              </li>
              <li>
                <span className="font-medium">Line</span> - Draw straight lines
              </li>
              <li>
                <span className="font-medium">Rectangle</span> - Draw square and
                rectangular shapes
              </li>
              <li>
                <span className="font-medium">Circle</span> - Draw circles and
                ovals
              </li>
              <li>
                <span className="font-medium">Diamond</span> - Draw diamond
                shapes
              </li>
              <li>
                <span className="font-medium">Text</span> - Add text labels to
                your canvas
              </li>
              <li>
                <span className="font-medium">Eraser</span> - Remove elements
                from your canvas
              </li>
            </ul>
          </section>

          {/* Mouse Controls */}
          <section>
            <h3 className="text-[#FFA500] font-semibold mb-2">
              Mouse Controls
            </h3>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <span className="font-medium">Middle Mouse Button</span> - Pan
                around the canvas
              </li>
              <li>
                <span className="font-medium">Scroll Wheel</span> - Pan
                vertically and horizontally
              </li>
              <li>
                <span className="font-medium">Click + Drag</span> - Draw shapes
                or move elements
              </li>
            </ul>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <h3 className="text-[#FFA500] font-semibold mb-2">
              Keyboard Shortcuts
            </h3>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <span className="font-medium">Spacebar</span> - Hold to enable
                panning mode
              </li>
              <li>
                <span className="font-medium">Ctrl + Z</span> - Undo last action
              </li>
              <li>
                <span className="font-medium">Ctrl + Y</span> - Redo last action
              </li>
            </ul>
          </section>

          {/* Customization */}
          <section>
            <h3 className="text-[#FFA500] font-semibold mb-2">Customization</h3>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <span className="font-medium">Colors</span> - Choose from preset
                colors or use the color picker
              </li>
              <li>
                <span className="font-medium">Stroke Width</span> - Adjust line
                thickness for all drawing tools
              </li>
              <li>
                <span className="font-medium">Zoom</span> - Use + and - buttons
                to zoom in and out
              </li>
            </ul>
          </section>

          {/* Sharing & Collaboration */}
          <section>
            <h3 className="text-[#FFA500] font-semibold mb-2">
              Sharing & Collaboration
            </h3>
            <p className="text-neutral-300 mb-2">
              Click the <span className="font-medium">Share</span> button in the
              navbar to copy the canvas link. Send it to others to collaborate
              in real-time!
            </p>
            <p className="text-neutral-300">
              All changes are synchronized instantly across all connected users.
            </p>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-[#FFA500] font-semibold mb-2">Pro Tips</h3>
            <ul className="space-y-2 text-neutral-300">
              <li> Use the Selection tool to fine-tune your elements</li>
              <li>
                Save your canvas as a PNG image using the Save tool button
              </li>
              <li> Mix and match colors and stroke widths for variety</li>
              <li>Invite collaborators to work together on the same canvas</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default HelpDialog;
