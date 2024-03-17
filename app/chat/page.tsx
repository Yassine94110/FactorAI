'use client'
import {Suspense} from 'react'
import {Flex} from '@radix-ui/themes'
import {useWeb3Modal, useWeb3ModalAccount} from '@web3modal/ethers/react'
import {Chat, ChatContext, ChatSideBar, useChatHook} from '@/components'
import Addresses from "@/components/addresses";
import {BuildWithGaladriel} from "@/components/buildwithgaladriel";
import Navbar from "@/components/navbar";

const ChatProvider = () => {
  const provider = useChatHook()
  const {open} = useWeb3Modal()

  const {isConnected} = useWeb3ModalAccount()
  return (
    <ChatContext.Provider value={provider}>
      {isConnected ?
        <Flex style={{height: 'calc(100% - 56px)', backgroundColor: "var(--background-color)"}} className="relative">
          <>
            <ChatSideBar/>
            <div className="flex-1 relative">
              <Chat ref={provider.chatRef}/>
            </div>
          </>
        </Flex>
        :
        <>
          <Navbar/>
          <main
            className="flex min-h-screen flex-col items-center gap-20 p-2 lg:p-12 justify-between z-2 relative bg-[#0657E0]">
            <div
              className={"flex flex-col gap-6 text-center text-xl"}
              style={{fontFamily: "PPMondwest-Regular"}}
            >
              <div className="text-7xl">
              <img className="h-80 inline align-text-bottom" src="/logo.png"/>
                <div>
                  On-chain GPT smartcontract builder powered by Galadriel
                </div>
              </div>
              <div className="pt-[10px]">
                <button
                  onClick={() => open()}
                  // className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200 " + FONT.className}
                  // className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200"}
                  className={"bg-violet-700 hover:bg-violet-900 text-white text-3xl font-bold py-2 px-4 rounded duration-200"}
                >
                🔨 Connect wallet to build 🔨
                </button>
                <div className="pt-4 underline">
                  <a
                    href="https://docs.galadriel.com/setting-up-a-wallet"
                    target="_blank"
                  >
                    (Galadriel testnet)
                  </a>
                </div>
              </div>
              <div className="text-4xl pt-12">
                To play, visit our <a href="https://discord.gg/4UuffUbkjb" target="_blank"
                                      className="px-2 underline">Discord</a> to get testnet funds
              </div>
            </div>
            <div
              className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0"}>
              <Addresses/>
              <BuildWithGaladriel/>
            </div>
          </main>
        </>
      }
    </ChatContext.Provider>
  )
}

const ChatPage = () => {
  return (
    <Suspense>
      <ChatProvider/>
    </Suspense>
  )
}

export default ChatPage
