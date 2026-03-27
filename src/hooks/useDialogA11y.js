import { useEffect, useRef } from "react";

export default function useDialogA11y(open, onClose) {
  const dialogRef = useRef(null);
  const initialFocusRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      initialFocusRef.current?.focus();
      dialogRef.current?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return {
    dialogRef,
    initialFocusRef,
  };
}
