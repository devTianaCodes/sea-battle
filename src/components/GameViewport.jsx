import { memo, useEffect, useRef } from "react";
import clsx from "clsx";

function GameViewport({ children, className }) {
  const viewportRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const updateSize = (width, height) => {
      viewport.style.setProperty("--viewport-width", `${width}px`);
      viewport.style.setProperty("--viewport-height", `${height}px`);
    };

    let frameId = null;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        updateSize(entry.contentRect.width, entry.contentRect.height);
      });
    });

    observer.observe(viewport);
    updateSize(viewport.clientWidth, viewport.clientHeight);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="h-[100svh] overflow-hidden p-[15px]">
      <div ref={viewportRef} className={clsx("viewport-container", className)}>
        {children}
      </div>
    </div>
  );
}

export default memo(GameViewport);
