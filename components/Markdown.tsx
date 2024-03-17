'use client'

import { ClassAttributes, Fragment, HTMLAttributes, useCallback, useState } from 'react'
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
  const [ token, setToken ] = useState<string>('');
  const [supply, setSupply] = useState<string>('')
  const [symbol, setSymbol] = useState<string>('')

  const code = match ? String(children).replace(/\n$/, '') : ''

  const onCopy = useCallback(() => {
    copy(code, (isSuccess) => {
      if (isSuccess) {
        setTooltipOpen(true)
      }
    })
  }, [code, copy])

  const handleDeploy = async () => {

      
    try {
      const ethersProvider = new BrowserProvider(walletProvider as any)
      const signer = await ethersProvider.getSigner()
      console.log( code )
      const { token, symbol, initialSupply } = JSON.parse(code)
      console.log('token', token)
      console.log('symbol', symbol)
      console.log('initialSupply', initialSupply)
      const factory = new ContractFactory(ERC20WithNameSymbolSupply.abi, ERC20WithNameSymbolSupply.bytecode, signer);
      const contract = await factory.deploy(token, symbol, initialSupply);
      console.log('contract', await contract.getAddress())


      


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
      <button className={"bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"} onClick={handleDeploy}>📜 Deploy ✨</button>

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
