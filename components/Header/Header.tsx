import Link from "next/link";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import styles from "./header.module.css";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import Image from "next/image";
import axios from "axios";

export default function Header() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  const conn = new Connection(process.env.NEXT_PUBLIC_RPC!, "processed");

  const wallet = useWallet();
  const walletModal = useWalletModal();

  const handleSignIn = async () => {
    try {
      setLoading(true);
      if (!wallet.connected) {
        walletModal.setVisible(true);
        setLoading(false);
      }
      const csrf = await getCsrfToken();
      if (!wallet.publicKey || !csrf || !wallet.signTransaction) return;

      let transaction = new Transaction({
        recentBlockhash: (await conn.getLatestBlockhash()).blockhash,
        feePayer: wallet.publicKey,
      });

      const message = {
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      };

      transaction.add(
        new TransactionInstruction({
          keys: [
            { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
          ],
          data: Buffer.from(JSON.stringify(message)),
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        })
      );

      const signature = await wallet.signTransaction!(transaction);

      const serializedTransaction = signature.serialize({
        requireAllSignatures: true,
      });
      const transactionBase64 = serializedTransaction.toString("base64");

      signIn("credentials", {
        redirect: false,
        signature: transactionBase64,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      (wallet.connected && status === "unauthenticated") ||
      (!wallet.connected && status === "authenticated") ||
      (!wallet.connected && status === "loading") || (status == "authenticated" && wallet.publicKey != session.user)
    ) {
      signOut({ redirect: false });
      handleSignIn();
    }

    axios.post("http://localhost:3000/api/hello",(res: any)=>{

    console.log("res",res)

    })

  }, [wallet.connecting, wallet.connected,wallet.publicKey]);

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          <span className={styles.notSignedInText}>
            <span style={{ position: "absolute", top: "2rem" }}>
              DOGESWAP-BETA
            </span>

            {!session && (
              <>
                <span className={styles.buttonPrimary} onClick={handleSignIn}>
                  Sign in
                </span>
                {/* <span className="float-right p-2.5"> */}
                  {/* <span className="flex">
                    <span className="flex h-3 w-3 py-2 mx-1">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="flex">
                    {"circulating supply : " + props.circulatingSupply}
                    <Image
                      className="px-1 rounded-xl"
                      alt="DAWG-LOGO"
                      src={DAWG_LOGO}
                      loader={() => DAWG_LOGO}
                      width={30}
                      height={30}
                    />
                    </span>
                  </span> */}
                {/* </span> */}
              </>
            )}
            {session?.user && (
              <>
                <span className={styles.notSignedInText}>
                  <span>
                    <span className={styles.signedInText}>
                      <small>Signed in as</small>
                      <br />
                      <strong>
                        {session.user.email ??
                          session.user.name?.substring(0, 5) +
                            ".." +
                            session.user.name?.substring(
                              session.user.name.length - 3
                            )}
                      </strong>
                    </span>
                    {session.user.image && (
                      <span
                        style={{
                          backgroundImage: `url('${session.user.image}')`,
                        }}
                        className={styles.avatar}
                      />
                    )}

                    <Link
                      href={`/api/auth/signout`}
                      className={styles.button}
                      onClick={(e) => {
                        e.preventDefault();
                        signOut({ redirect: false });
                      }}
                    >
                      Sign out
                    </Link>
                  </span>
                </span>
              </>
            )}
          </span>
        </p>
      </div>
    </header>
  );
}
