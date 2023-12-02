import Link from 'next/link'
import { useRouter } from 'next/router'
// import { Disclosure } from '@headlessui/react'
// import { ConnectButton } from '@rainbow-me/rainbowkit'
import ConnectButton from '../ui/ConnectButton'
import { useCallback, useContext, useEffect, useState } from 'react'
import { ModalContext } from '@/contexts/ModalContext'
import { useMagicContext } from '@/components/magic/MagicProvider'

const Header = () => {
  const [account, setAccount] = useState<string | null>(null)
  const [disabled, setDisabled] = useState(false)

  const router = useRouter()
	const { toggleModal } = useContext(ModalContext)
  const { magic } = useMagicContext()

  const connect = useCallback(async () => {
    if (!magic) return;
    try {
      setDisabled(true);
      const accounts = await magic?.wallet.connectWithUI();
      setDisabled(false);
      console.log('Logged in user:', accounts[0]);
      localStorage.setItem('user', accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      setDisabled(false);
      console.error(error);
    }
  }, [magic, setAccount]);

	const logout = async () => {
    await magic?.wallet.disconnect()
    localStorage.removeItem('user')
    setAccount('')
  }

useEffect(() => {
    const user = localStorage.getItem('user');
    setAccount(user);
  }, []);

	return (
		<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  {/* <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black"> */}
                    <span className="sr-only">Open main menu</span>
                    {true ? (
                      'hello'
                      // <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      'world'
                      // <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  {/* </Disclosure.Button> */}
                </div>
                <div className="flex flex-1 justify-between">
                  <div className="flex flex-shrink-0 items-center text-gray-100">
                    <Link href="/" className="font-semibold">EventHub</Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/events"
                      className={`inline-flex items-center ${router.pathname === '/events' ? 'border-b-2 border-black' : ''} px-1 pt-1 text-sm font-bold text-white-200`}
                    >
                      Events
                    </Link>
                    <Link
                      href="/my-events"
                      className={`inline-flex items-center ${router.pathname === '/my-events' ? 'border-b-2 border-black' : ''} px-1 pt-1 text-sm font-bold text-white-200`}
                    >
                      My Events
                    </Link>
                  </div>
                
                  <div className="flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button onClick={toggleModal} className="bg-gradient-to-b from-blue-1 to-green-1 text-white font-bold py-2 px-4 rounded-[10px] mr-4 ml-2">
                      Create Event
                    </button>
                    {account ? <>
                    {account}
                    <span onClick={logout}>Logout</span>
                    </> : (<ConnectButton onClick={connect} disabled={disabled} />)}
                  </div>
                </div>
              </div>
            </div>
	)
}

export default Header