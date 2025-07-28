"use client";

import { useLogin, useLogout, usePrivy } from "@privy-io/react-auth";
import { encodeFunctionData } from "viem";
import { useSmartWallet } from "../hooks/useSmartWallet";
import { monadTestnet } from "viem/chains";
import { useState } from "react";

const NFT_CONTRACT_ADDRESS = "0x1d27c2B0b632E562edA13f2f49348baD22B5eA8D";

const abi = [
  {
    inputs: [{ internalType: "address", name: "_to", type: "address" }],
    name: "mintTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default function Demo() {
  const { ready, authenticated, user } = usePrivy();
  const { smartAccountAddress, smartAccountClient, smartAccountReady } =
    useSmartWallet();
  const { logout } = useLogout();
  const { login } = useLogin();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [isTransactionPending, setIsTransactionPending] = useState(false);

  async function handleMintNFT() {
    if (smartAccountReady && smartAccountAddress) {
      setIsTransactionPending(true);
      try {
        const data = encodeFunctionData({
          abi,
          functionName: "mintTo",
          args: [smartAccountAddress],
        });
        if (smartAccountClient?.account) {
          const txHash = await smartAccountClient?.sendTransaction({
            account: smartAccountClient?.account,
            chain: monadTestnet,
            to: NFT_CONTRACT_ADDRESS,
            data,
          });
          console.log(txHash);
          setTransactionHash(txHash);
          setShowTransactionModal(true);
        }
      } catch (error) {
        console.error("Transaction failed:", error);
        setShowRejectionModal(true);
      } finally {
        setIsTransactionPending(false);
      }
    }
  }

  async function handleMintMultipleNFTs() {
    if (smartAccountReady && smartAccountAddress) {
      setIsTransactionPending(true);
      try {
        const data = encodeFunctionData({
          abi,
          functionName: "mintTo",
          args: [smartAccountAddress],
        });

        if (smartAccountClient?.account) {
          const txHash = await smartAccountClient?.sendTransaction({
            calls: [
              {
                to: NFT_CONTRACT_ADDRESS,
                data,
              },
              {
                to: NFT_CONTRACT_ADDRESS,
                data,
              },
            ],
          });
          console.log(txHash);
          setTransactionHash(txHash);
          setShowTransactionModal(true);
        }
      } catch (error) {
        console.error("Transaction failed:", error);
        setShowRejectionModal(true);
      } finally {
        setIsTransactionPending(false);
      }
    }
  }

  function handleLogout() {
    logout();
  }

  function closeTransactionModal() {
    setShowTransactionModal(false);
    setTransactionHash("");
  }

  function closeRejectionModal() {
    setShowRejectionModal(false);
  }

  const monadExplorerUrl = `https://testnet.monadexplorer.com/tx/${transactionHash}`;

  return (
    <>
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 md:p-8 border border-slate-200 dark:border-slate-700">
        <div className="max-w-md mx-auto">
          {ready ? (
            <>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
                Mint NFT
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 text-center">
                Try the gasless experience by minting an NFT below
              </p>

              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4 mb-6 flex items-center justify-center">
                <img
                  src="/nft.png"
                  alt="NFT"
                  className="object-cover rounded-lg w-full max-w-[280px] h-[280px]"
                />
              </div>

              {authenticated && user ? (
                <>
                  {smartAccountReady ? (
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 text-center font-mono">
                      Connected to {smartAccountAddress}
                    </p>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 text-center">
                      Connecting to smart wallet...
                    </p>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={handleMintNFT}
                      disabled={isTransactionPending || !smartAccountReady}
                      className="w-full bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTransactionPending ? "Minting..." : "Mint NFT"}
                    </button>

                    <button
                      onClick={handleMintMultipleNFTs}
                      disabled={isTransactionPending || !smartAccountReady}
                      className="w-full bg-slate-600 dark:bg-slate-300 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-500 dark:hover:bg-slate-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isTransactionPending ? "Minting..." : "Mint 2 NFTs"}
                    </button>

                    <button
                      className="w-full bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={login}
                  className="w-full bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors duration-200 flex items-center justify-center"
                >
                  Connect Wallet
                </button>
              )}
            </>
          ) : (
            <>
              {/* Skeleton for heading */}
              <div className="w-3/4 h-8 bg-slate-200 dark:bg-slate-600 rounded mb-6 animate-pulse mx-auto" />
              {/* Skeleton for description */}
              <div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-600 rounded mb-6 animate-pulse mx-auto" />
              {/* Skeleton for image */}
              <div className="w-full max-w-[280px] h-[280px] bg-slate-200 dark:bg-slate-600 rounded-xl mb-6 animate-pulse mx-auto" />
              {/* Skeleton for button */}
              <div className="w-full h-12 bg-slate-200 dark:bg-slate-600 rounded-lg animate-pulse" />
            </>
          )}
        </div>

        {/* Transaction Success Modal */}
        {showTransactionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Transaction Successful!
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Your NFT has been minted successfully.
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                  You can view the transaction on the Monad testnet explorer.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.open(monadExplorerUrl, "_blank")}
                    className="flex-1 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors duration-200"
                  >
                    View on Explorer
                  </button>
                  <button
                    onClick={closeTransactionModal}
                    className="flex-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                  Transaction Rejected
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  You rejected the transaction.
                </p>
                <button
                  onClick={closeRejectionModal}
                  className="w-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
