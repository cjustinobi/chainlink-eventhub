
import { createContext, Dispatch, SetStateAction } from 'react'

interface ModalContextData {
  showModal: boolean
  eventCreated: boolean,
  setEventCreated: Dispatch<SetStateAction<boolean>>,
  toggleModal: () => void;
}

export const ModalContext = createContext<ModalContextData>({
  showModal: false,
  eventCreated: false,
  setEventCreated: () => {},
  toggleModal: () => {}
})