// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react';
// import { Magic } from 'magic-sdk';
// import { getChainId, getNetworkUrl } from '@/lib/utils'
// const { Web3 } = require('web3');

// export type MagicContextType = {
//   magic: Magic | null;
//   web3: typeof Web3 | null;
// };

// const MagicContext = createContext<MagicContextType>({
//   magic: null,
//   web3: null,
// });

// export const useMagicContext = () => useContext(MagicContext);

// const MagicProvider = ({ children }: { children: React.ReactNode }) => {
//   const [magicInstance, setMagicInstance] = useState<Magic | null>(null);
//   const [web3Instance, setWeb3Instance] = useState<typeof Web3 | null>(null);

//   useEffect(() => {
//     if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
//       const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
//         network: {
//           rpcUrl: getNetworkUrl(),
//           chainId: getChainId(),
//         },
//       });


//       setMagicInstance(magic);
//       setWeb3Instance(new Web3((magic as any).rpcProvider));
//     }
//   }, []);


//   return (
//     <MagicContext.Provider
//       value={{
//         magic: magicInstance,
//         web3: web3Instance,
//       }}
//     >
//       {children}
//     </MagicContext.Provider>
//   );
// };

// export default MagicProvider;





'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Magic } from 'magic-sdk'
import { getChainId, getNetworkUrl } from '@/lib/utils'
import { ethers } from 'ethers'
// const { Web3 } = require('web3')

export type MagicContextType = {
  magic: Magic | null;
  // provider: typeof Web3;
  provider: ethers.providers.Web3Provider | null;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  provider: null,
});

export const useMagicContext = () => useContext(MagicContext)

const MagicProvider = ({ children }: { children: React.ReactNode }) => {
  const [magicInstance, setMagicInstance] = useState<Magic | null>(null);
  const [web3Instance, setWeb3Instance] = useState<ethers.providers.Web3Provider | null >(null);

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
