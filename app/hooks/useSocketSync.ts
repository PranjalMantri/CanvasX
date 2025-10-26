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

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("connect", () => {
      console.log("User connect");
      s.emit("join-room", roomId);
    });

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    const handleHistory = (receivedElements: ElementType[]) => {
      console.log(
        "[socket] received history len=",
        receivedElements?.length ?? 0
      );
      setElements(receivedElements || []);
    };

    const handleDraw = (receivedElements: ElementType[]) => {
      if (actionRef.current !== "drawing") {
        setElements(receivedElements || []);
      }
    };

    socket.on("history", handleHistory);
    socket.on("draw", handleDraw);

    return () => {
      socket.off("history", handleHistory);
      socket.off("draw", handleDraw);
    };
  }, [socket, setElements]);

  useEffect(() => {
    if (!socket || action === "drawing") {
      return;
    }

    const snapshot = JSON.parse(JSON.stringify(elements || []));
    socket.emit("draw", roomId, snapshot);
  }, [elements, action, roomId, socket]);
}
