import { useLayoutEffect, useRef } from "react";

function useCallbackRef<T>(callback: T) :  React.MutableRefObject<T> {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef;
}

export { useCallbackRef };
export default useCallbackRef;
