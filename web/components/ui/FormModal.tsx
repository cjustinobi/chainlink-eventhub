import { useContext, useEffect, useState } from "react"
import Image from 'next/image'
import { ModalContext } from "@/contexts/ModalContext"
import { createEvent, toTimestamp } from "@/utils"
import { useMagicContext } from "@/components/magic/MagicProvider"
import CloseIcon from '@/public/close.svg'
import LoadingIcon from '@/public/loading.svg'

const FormModal = () => {
const { showModal, toggleModal, setEventCreated } = useContext(ModalContext)
const { provider } = useMagicContext()

const [loading, setLoading] = useState<boolean>(false)
const [account, setAccount] = useState<string | null>(null)
const [title, setTitle] = useState<string>('SWeet title')
// const [description, setDescription] = useState<string>('Desc')
const [deposit, setDeposit] = useState<string>('')
const [phone, setPhone] = useState<string>('')
const [capacity, setCapacity] = useState<number>(2)
const [startTime, setStartTime] = useState<number | undefined>(0)
const [imagePath, setImagePath] = useState<string>('https://cockpit-project.org/images/site/cockpit-logo.svg')


const saveHandler = async () => {

    if (account) {
      try {
    
        const tx = await createEvent(
          provider?.getSigner(), 
          title, 
          startTime, 
          deposit, 
          capacity, 
          imagePath,
          phone
        )
        toggleModal()
        if (tx) {
          setEventCreated(true)
          resetForm()
        }
      } catch (error) {
        
      }
    }
}

  const reset = () => {
    resetForm()
    toggleModal()
  }

  const resetForm = () => {
    setTitle('');
    setDeposit('');
    setPhone('');
    setCapacity(0);
    setStartTime(undefined);
    setImagePath('https://cockpit-project.org/images/site/cockpit-logo.svg');
  };

  useEffect(() => {
    const user = localStorage.getItem('user')
    setAccount(user)
  }, [])

  return (
  
  <div className={`fixed ${showModal ? '' : 'hidden'} inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal`}>

    <form className="relative max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <Image onClick={reset} className="absolute right-2 top-2 cursor-pointer" src={CloseIcon} alt="magic-logo" />
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Event {typeof deposit}</h2>
      <div className=" mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          type="text"
          id="title"
          onChange={e => setTitle(e.target.value)}
          placeholder="Event Title"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deposit">
          Ticket Price
        </label>
        <input
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          type="number"
          id="deposit"
          onChange={e => setDeposit(e.target.value)}
          placeholder="Ticket Price"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
          Event Capacity
        </label>
        <input
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          type="number"
          id="capacity"
          onChange={e => setCapacity(parseInt(e.target.value))}
          placeholder="Enter maximum attendance"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start">
          Start Time
        </label>
        <input
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          type="datetime-local"
          id="start"
          onChange={e => setStartTime(toTimestamp(e.target.value))}
          placeholder="Start Time"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagePath">
          Image Path
        </label>
        <input
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          type="text"
          id="imagePath"
          onChange={e => setImagePath(e.target.value)}
          placeholder="Image URI"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone
        </label>
        <input
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          type="text"
          id="phone"
          onChange={e => setPhone(e.target.value)}
          placeholder="Enter phone number for feedback"
          required
        />
      </div>

      {/* <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          id="description"
          onChange={e => setDescription(e.target.value)}
          placeholder="Event Description"
          rows="4"
          required
        ></textarea>
      </div> */}

      <div className="mb-6">
        <button
          type="button"
          id="ok-btn"
          onClick={saveHandler}
          className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          {!loading ? <div className="loading-container"><Image className="loading" src={LoadingIcon} alt="magic-logo" /></div> : 'Save'}
        </button>
      
      </div>
    </form>

  </div>
  )
}

export default FormModal