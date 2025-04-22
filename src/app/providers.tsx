'use client'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { pdfjs } from 'react-pdf';


function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
      },
    },
  })
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new client
    return makeQueryClient()
  } else {
    // Browser: use singleton pattern
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export default function Providers({ 
  children,
}: { 
  children: React.ReactNode 
}) {
  // Get the singleton query client
  const queryClient = getQueryClient()

  return (
    // Only provide QueryClientProvider
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}