import { ModalContext } from "@/contexts/ModalContext";
import { useState } from "react";

export interface IThemeProviderProps {
  children: React.ReactNode;
}


export const ModalProvider: React.FC<IThemeProviderProps> = ({ children } ) => {
  const [showModal, setShowModal] = useState(false)
  const [eventCreated, setEventCreated] = useState(false)

  const toggleModal = () => {
    setShowModal((prevState) => (prevState === true ? false : true));
  };

  return (
    <ModalContext.Provider value={{ showModal, toggleModal, eventCreated, setEventCreated }} >
      <div>
        {children}
      </div>
    </ModalContext.Provider>
    
  );
};