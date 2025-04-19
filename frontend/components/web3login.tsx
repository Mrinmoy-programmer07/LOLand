"use client"; // for Next.js 13+

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!; // Use NEXT_PUBLIC_ for client-side

export default function Web3Login() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const instance = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0x13881", // Polygon Mumbai
            rpcTarget: "https://rpc-mumbai.maticvigil.com",
          },
          web3AuthNetwork: "testnet",
          privateKeyProvider: undefined
        });

        await instance.initModal();
        setWeb3auth(instance);
      } catch (err) {
        console.error("Web3Auth Init Error:", err);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    const provider = await web3auth.connect();
    console.log("Provider:", provider);
  };

  return (
    <button onClick={login} className="bg-purple-500 text-white px-4 py-2 rounded">
      Login with Web3Auth
    </button>
  );
}
