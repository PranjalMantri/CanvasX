// import { useEffect, useRef, useState } from "react";
// import { Action } from "../types/action";
// import { ElementType } from "../types/elements";
// import { io, Socket } from "socket.io-client";

// const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// interface UseSocketSyncProps {
//   roomId: string;
//   elements: ElementType[];
//   setElements: (elements: ElementType[]) => void;
//   action: Action;
// }

// export default function useSocketSync({
//   roomId,
//   elements,
//   setElements,
//   action,
// }: UseSocketSyncProps) {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const actionRef = useRef(action);
//   const isMountedRef = useRef(false);
//   const suppressEmitRef = useRef(false);

//   // setting action value
//   useEffect(() => {
//     actionRef.current = action;
//   }, [action]);

//   // creating connection and joining room
//   useEffect(() => {
//     const s = io(SOCKET_URL);
//     setSocket(s);

//     s.on("connect", () => {
//       console.log("User connect");
//       s.emit("join-room", roomId);
//     });

//     return () => {
//       s.disconnect();
//       setSocket(null);
//     };
//   }, [roomId]);

//   useEffect(() => {
//     if (!socket) return;

//     const handleHistory = (receivedElements: ElementType[]) => {
//       // prevent re-emitting the history back to the server
//       suppressEmitRef.current = true;
//       try {
//         console.log(
//           "[socket] received history len=",
//           receivedElements?.length ?? 0
//         );
//         setElements(receivedElements || []);
//       } finally {
//         // allow emits on next tick (small delay so state settles)
//         setTimeout(() => {
//           suppressEmitRef.current = false;
//         }, 20);
//       }
//     };

//     const handleDraw = (receivedElements: ElementType[]) => {
//       // when other clients draw, apply it unless we're currently drawing locally
//       if (actionRef.current !== "drawing") {
//         // avoid emitting this update back (we only emit local changes)
//         suppressEmitRef.current = true;
//         try {
//           setElements(receivedElements || []);
//         } finally {
//           setTimeout(() => {
//             suppressEmitRef.current = false;
//           }, 20);
//         }
//       }
//     };

//     socket.on("history", handleHistory);
//     socket.on("draw", handleDraw);

//     return () => {
//       socket.off("history", handleHistory);
//       socket.off("draw", handleDraw);
//     };
//   }, [socket, setElements]);

//   // Emit local elements to server when elements change and not suppressed
//   useEffect(() => {
//     if (!socket) return;
//     if (suppressEmitRef.current) {
//       // suppressed (we're applying remote data); do not emit
//       return;
//     }

//     // only emit when not actively drawing (so live-drawing events can be separated later)
//     if (action !== "drawing") {
//       // send a deep copy (to avoid sending references)
//       const snapshot = JSON.parse(JSON.stringify(elements || []));
//       socket.emit("draw", roomId, snapshot);
//       // optional: local debug
//       // console.log("[socket] emitted draw len=", snapshot.length);
//     }
//     // we intentionally depend on elements/action/roomId/socket
//   }, [elements, action, roomId, socket]);
// }

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
