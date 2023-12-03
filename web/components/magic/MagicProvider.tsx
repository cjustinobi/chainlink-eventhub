import { createContext, useContext, useEffect, useState } from 'react'
import { Magic } from 'magic-sdk'
import { getChainId, getNetworkUrl } from '@/utils'
import { ethers } from 'ethers'
// import Web3 from 'web3';

// const { Web3 } = require('web3')

export type MagicContextType = {
  magic: Magic | null;
  provider: ethers.providers.Web3Provider;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  provider: null,
});

export const useMagicContext = () => useContext(MagicContext)

const MagicProvider = ({ children }: { children: React.ReactNode }) => {
  const [magicInstance, setMagicInstance] = useState<Magic | null>(null);
  const [web3Instance, setWeb3Instance] = useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {

    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
        network: {
          rpcUrl: getNetworkUrl(),
          chainId: getChainId(),
        },
      })

      setMagicInstance(magic)
      // setWeb3Instance(new Web3((magic as any).rpcProvider));
      setWeb3Instance(new ethers.providers.Web3Provider((magic as any).rpcProvider))
    }
  }, [])

  return (
    <MagicContext.Provider
      value={{
        magic: magicInstance,
        provider: web3Instance,
      }}
    >
      {children}
    </MagicContext.Provider>
  )
}

export default MagicProvider
