"use client";

import { useEffect, useState } from "react";
import { Paintbrush } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import HelpDialog from "./HelpDialog";

function Navbar() {
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareLink(window.location.href);
    }
  }, []);

  return (
    <nav className="z-100 w-full h-14 bg-zinc-900 text-white shadow-lg border-b border-b-[#374151]">
      <div className="flex items-center justify-between mx-10">
        {/* Logo */}
        <div className="flex items-center h-12 space-x-2">
          <Paintbrush className="h-6 w-6 text-[#FFA500]" aria-hidden="true" />
          <span className="text-[#FFA500] text-xl font-semibold">CanvasX</span>
        </div>

        {/* Share button + modal */}
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#FFA500] hover:bg-[#ffb733] text-white font-semibold px-4 py-1.5 rounded-lg transition-all">
                Share
              </Button>
            </DialogTrigger>

            {/* Custom dark modal with transparent overlay */}
            <DialogContent
              className="bg-zinc-900 border border-zinc-700 text-white z-200"
              style={{
                backgroundColor: "#18181b",
              }}
              // Prevents the input from being auto-focused and selected
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="text-[#FFA500] text-lg">
                  Share this Canvas
                </DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Copy the link below to share this canvas with others.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex items-center gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="bg-zinc-800 text-white border-zinc-700 focus-visible:ring-[#FFA500]"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    setIsCopied(true);
                    setTimeout(() => {
                      setIsCopied(false);
                    }, 2000);
                  }}
                  disabled={isCopied}
                  className="bg-[#FFA500] hover:bg-[#ffb733] text-white font-medium"
                >
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <HelpDialog />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
