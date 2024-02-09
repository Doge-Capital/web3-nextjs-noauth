import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export default function ConnectWallet() {

  const wallet = useWallet();

  const walletModal = useWalletModal();

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="items-cente flex flex-row gap-5">
      {wallet && !wallet.connected && <Button onClick={handleSignIn}>Connect Wallet</Button>}

      {wallet && wallet.connected && (
        <>
          <Button
            onClick={async (e) => {
              try {
                e.preventDefault();
                await wallet.disconnect();
              } catch (e) {
                console.log(e);
              }
            }}
          >
            {wallet.publicKey
              ? obfuscatePubKey(wallet.publicKey.toBase58())
              : "signing out .."}
          </Button>
        </>
      )}
    </div>
  );
}

export const obfuscatePubKey = (address: string) => {
  return (
    address?.substring(0, 4) + ".." + address.substring(address.length - 4)
  );
};
