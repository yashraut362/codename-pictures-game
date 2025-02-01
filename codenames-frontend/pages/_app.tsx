'use client';
import { SocketProvider } from "@/context/SocketContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SocketProvider>
      <ToastContainer />
      <Component {...pageProps} />
    </SocketProvider>
  )
}
