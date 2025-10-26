import { useState } from "react";

type SetStateAction<T> = T | ((prevState: T) => T);

interface UseHistoryReturn<T> {
  state: T;
  setState: (action: SetStateAction<T>, overwrite?: boolean) => void;
  undo: () => void;
  redo: () => void;
}

function useHistory<T>(
  initialState: T
): [
  T,
  (action: SetStateAction<T>, overwrite?: boolean) => void,
  () => void,
  () => void
] {
  const [index, setIndex] = useState<number>(0);
  const [history, setHistory] = useState<T[]>([initialState]);

  const setState = (action: SetStateAction<T>, overwrite: boolean = false) => {
    const newState =
      typeof action === "function"
        ? (action as (prevState: T) => T)(history[index])
        : action;

    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = history.slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prev) => prev + 1);
    }
  };

  const undo = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const redo = () => {
    if (index < history.length - 1) setIndex((prev) => prev + 1);
  };

  return [history[index], setState, undo, redo];
}

export default useHistory;
