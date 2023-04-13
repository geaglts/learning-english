import { createPortal } from "react-dom";

type PortalProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

export function Modal({ children, isOpen = false }: PortalProps) {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed left-0 top-0 flex justify-center items-center h-screen w-full bg-slate-900/80 backdrop-blur">
      {children}
    </div>,
    document.getElementById("portal") as Element
  );
}
