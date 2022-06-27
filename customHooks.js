import { useEffect, useRef } from "react";

export const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
}; // it runs only when dependencies change state and not on initial render --> https://stackoverflow.com/a/55075818/14718856
