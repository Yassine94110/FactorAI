'use client'

import { ClassAttributes, Fragment, HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { IconButton, Tooltip } from '@radix-ui/themes'
import cs from 'classnames'
import { RxClipboardCopy } from 'react-icons/rx'
import ReactMarkdown, { ExtraProps } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import ERC20WithNameSymbolSupply from "@/contracts/ERC20WithNameSymbolSupply.json";
import {BrowserProvider, Contract, ContractFactory, ethers, TransactionReceipt} from "ethers";
import {useWeb3ModalProvider} from '@web3modal/ethers/react';
import { set } from 'lodash-es'



export interface MarkdownProps {
  className?: string
  children: string
}

const HighlightCode = (
  props: ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & ExtraProps
) => {
  const { walletProvider } = useWeb3ModalProvider()
  const { children, className, ref, ...rest } = props
  const match = /language-(\w+)/.exec(className || '')
  const copy = useCopyToClipboard()
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
  const [ token, setToken ] = useState<string>('')
  const [supply, setSupply] = useState<string>('')
  const [symbol, setSymbol] = useState<string>('')
  const [chatBotContract, setChatBotContract] = useState<string>('');
const [newContract, setNewContract] = useState<string | any>("loading...");
const [hideAddToken, setHideAddToken] = useState<boolean>(true)
const [newChainId, setNewChainId] = useState< any>(undefined)



  const code = match ? String(children).replace(/\n$/, '') : ''

  const onCopy = useCallback(() => {
    copy(code, (isSuccess) => {
      if (isSuccess) {
        setTooltipOpen(true)
      }
    })
  }, [code, copy])

  useEffect(() => {
    if(newContract!="loading..."){
      setHideAddToken(false);
    }
  }, [newContract]); // Les croch


  const handleAddToken = async () => {
    try {
      
      const wasAdded = await  window?.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: newContract, // The address that the token is at.
          },
        },
      });

    } catch (error) {
      console.log('error', error)
    }
   
  }

  const handleDeploy = async () => {
    
      const { token, symbol, initialSupply,chainId } = JSON.parse(code)
      setNewChainId(chainId);
      console.log('chainIdos', newChainId )
      
      if (chainId != undefined) {
        console.log("AYAAAAA")
  try {
    const wasAdded = await  window?.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xa4b1' }],
    });

  } catch (error) {
    console.log('error', error)
  }
  }
      

    try {
      const ethersProvider = new BrowserProvider(walletProvider as any)
      const signer = await ethersProvider.getSigner()
      console.log( code )
      const { token, symbol, initialSupply,chainId } = JSON.parse(code)
      console.log('chainId', chainId)
      console.log('token', token)
      console.log('symbol', symbol)
      console.log('initialSupply', initialSupply)
      const factory = new ContractFactory(ERC20WithNameSymbolSupply.abi, ERC20WithNameSymbolSupply.bytecode, signer);
      const contract = await factory.deploy(token, symbol, initialSupply);
      const adressLastContract = await contract.getAddress()
    
      setNewContract(adressLastContract)
    
  
          
      if (chainId != undefined) {
        // use window ethereum use wallet_switchEthereumChain to chain id 42161
  try {
    const wasAdded2 = await  window?.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa289' }],
    });

  } catch (error) {
    console.log('error', error)
  }
  setNewChainId(undefined)
  }



      


      


}
 catch (error) {
      console.log('error', error)
    }


    console.log('Le bouton a été cliqué');
  }

  return match ? (
    <Fragment>
      <Tooltip open={tooltipOpen} content="Copied!">
        <IconButton
          className="absolute right-4 top-4 cursor-pointer"
          variant="solid"
          onClick={onCopy}
          onMouseLeave={() => setTooltipOpen(false)}
        >
          <RxClipboardCopy />
        </IconButton>
      </Tooltip>
      <SyntaxHighlighter {...rest} style={vscDarkPlus} language={match[1]} PreTag="div">
        {code}
      </SyntaxHighlighter>
      <button className={"bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded m-2"} onClick={handleDeploy}>📜 Deploy ✨</button>

    
{      !hideAddToken && <button className={"bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded m-2"} onClick={handleAddToken}>⤴️ Add to Metamask 🦊</button>}
    
      
    
    </Fragment>
  ) : (
    <code ref={ref} {...rest} className={cs('highlight', className)}>
      {children}
    </code>
  )
}

export const Markdown = ({ className, children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      className={cs('prose dark:prose-invert max-w-none', className)}
      remarkPlugins={[remarkParse, remarkMath, remarkRehype, remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeKatex, rehypeStringify]}
      components={{
        code(props) {
          return <HighlightCode {...props} />
        }
      }}
    >
      {children}
    </ReactMarkdown>
  )
}
