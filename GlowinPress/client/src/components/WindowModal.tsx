import * as React from "react";
import { Minimize2, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  isMaximized?: boolean;
}

export function WindowModal({
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  title,
  children,
  className,
  isMaximized = false,
}: WindowModalProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const modalRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current || isMaximized) return;

    const rect = modalRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;

      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="window-backdrop" onClick={onClose} />

      {/* Window */}
      <div
        ref={modalRef}
        className={cn(
          "window-modal",
          isMaximized &&
            "!w-full !h-full !top-0 !left-0 !transform-none !max-w-none !max-h-none !rounded-none",
          className,
        )}
        style={
          !isMaximized
            ? {
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
                cursor: isDragging ? "grabbing" : "default",
              }
            : undefined
        }
      >
        {/* Title Bar */}
        <div className="window-header" onMouseDown={handleMouseDown}>
          <h2 className="text-lg font-semibold">{title}</h2>

          <div className="window-controls">
            {onMinimize && (
              <div
                className="window-control minimize"
                onClick={onMinimize}
                title="Minimize"
              />
            )}

            {onMaximize && (
              <div
                className="window-control maximize rounded-tl-[1px] rounded-tr-[1px] rounded-br-[1px] rounded-bl-[1px]"
                onClick={onMaximize}
                title={isMaximized ? "Restore" : "Maximize"}
              />
            )}

            <div
              className="window-control close rounded-tl-[4px] rounded-tr-[4px] rounded-br-[4px] rounded-bl-[4px]"
              onClick={onClose}
              title="Close"
            />
          </div>
        </div>

        {/* Content */}
        <div className="window-content">{children}</div>
      </div>
    </>
  );
}
