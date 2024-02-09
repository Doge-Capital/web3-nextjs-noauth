import "../styles/globals.css";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { ThemeProvider } from "../components/theme-provider";

require("@solana/wallet-adapter-react-ui/styles.css");

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  const endpoint = process.env.NEXT_PUBLIC_RPC!;
  const wallets = [new SolflareWalletAdapter(), new LedgerWalletAdapter()];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* <Maintanance/> */}

              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Navbar />
                <Component {...pageProps} />
                <Toaster />
              </ThemeProvider>
              {/* <div className="mt-[33vh] text-center text-3xl text-white">
                Under Maintenance for fixing bugs ! Will be back in a few hours!
              </div> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;
