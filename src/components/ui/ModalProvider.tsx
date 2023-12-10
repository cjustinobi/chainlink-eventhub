'use client'

import { useState, createContext, Dispatch, SetStateAction, useContext } from 'react'

export interface IThemeProviderProps {
  children: React.ReactNode;
}

interface ModalContextData {
  showModal: boolean
  eventCreated: boolean
  setEventCreated: Dispatch<SetStateAction<boolean>>
  toggleModal: () => void
}

const ModalContext = createContext<ModalContextData>({
  showModal: false,
  eventCreated: false,
  setEventCreated: () => {},
  toggleModal: () => {}
})

export const useModalContext = () => useContext(ModalContext)

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