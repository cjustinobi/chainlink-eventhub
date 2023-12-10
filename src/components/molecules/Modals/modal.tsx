import { ReactNode } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="fixed w-full h-full inset-0 z-[70] flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 z-[80] bg-black bg-opacity-50 flex items-center justify-center text-white"
      ></div>
      <div className="w-[95%] lg:w-auto lg:h-auto bg-white p-1 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] rounded-lg">
        {children}
      </div>
    </div>,
    document.getElementById("modal")!
  );
};

export default Modal;
