import { useEffect, useRef, useState } from "react";
import { Action } from "../types/action";
import { ElementType } from "../types/elements";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface UseSocketSyncProps {
  roomId: string;
  elements: ElementType[];
  setElements: (elements: ElementType[]) => void;
  action: Action;
}

export default function useSocketSync({
  roomId,
  elements,
  setElements,
  action,
}: UseSocketSyncProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const actionRef = useRef(action);
  const shouldEmitRef = useRef(true);
  const previousElementsRef = useRef<ElementType[]>([]);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    const s = io(SOCKET_URL);

    s.on("connect", () => {
      s.emit("join-room", roomId);
      setSocket(s);
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleHistory = (data: {
      elements: ElementType[];
      index: number;
    }) => {
      shouldEmitRef.current = false;
      setElements(data.elements || []);
    };

    const handleDraw = (data: { elements: ElementType[]; index: number }) => {
      if (actionRef.current !== "drawing") {
        shouldEmitRef.current = false;
        previousElementsRef.current = data.elements;
        setElements(data.elements || []);
      }
    };

    const handleUndo = (data: { elements: ElementType[]; index: number }) => {
      shouldEmitRef.current = false;
      previousElementsRef.current = data.elements;
      setElements(data.elements || []);
    };

    const handleRedo = (data: { elements: ElementType[]; index: number }) => {
      shouldEmitRef.current = false;
      previousElementsRef.current = data.elements;
      setElements(data.elements || []);
    };

    socket.on("history", handleHistory);
    socket.on("draw", handleDraw);
    socket.on("undo", handleUndo);
    socket.on("redo", handleRedo);

    return () => {
      socket.off("history", handleHistory);
      socket.off("draw", handleDraw);
      socket.off("undo", handleUndo);
      socket.off("redo", handleRedo);
    };
  }, [socket, setElements]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    if (action === "drawing" || action === "moving" || action === "resizing") {
      return;
    }

    if (!shouldEmitRef.current) {
      shouldEmitRef.current = true;
      return;
    }

    // Check if elements actually changed
    const elementsChanged =
      JSON.stringify(previousElementsRef.current) !== JSON.stringify(elements);

    if (elementsChanged) {
      previousElementsRef.current = elements;
      const snapshot = JSON.parse(JSON.stringify(elements || []));
      socket.emit("draw", roomId, snapshot);
    }
  }, [elements, action, roomId, socket]);

  const undo = () => {
    if (socket) {
      socket.emit("undo", roomId);
    }
  };

  const redo = () => {
    if (socket) {
      socket.emit("redo", roomId);
    }
  };

  return { undo, redo };
}
