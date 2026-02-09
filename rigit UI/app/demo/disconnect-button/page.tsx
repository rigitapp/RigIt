'use client'

import { DisconnectButton } from '@/components/disconnect-button'
import { useWallet } from '@/components/wallet-context'

export default function DisconnectButtonDemo() {
  const { connected, publicKey, disconnect, connectWallet } = useWallet()

  const handleDisconnect = async () => {
    await disconnect()
    alert('Wallet disconnected!')
  }

  const formatAddress = (address: string | null) => {
    if (!address) return '6ZXc...gkU'
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-[#010101] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#BEFE46]">Disconnect Button Demo</h1>
          <p className="text-gray-400">Hover over the button to see the icon change from logout to arrow</p>
        </div>
        
        <div className="p-6 border border-[#BEFE46] bg-[#010101]">
          <h2 className="text-xl font-semibold mb-4 text-white">Wallet Status</h2>
          <div className="space-y-2 text-white font-['IBM_Plex_Mono']">
            <p>Connected: <span className={connected ? 'text-[#BEFE46]' : 'text-gray-400'}>{connected ? 'Yes' : 'No'}</span></p>
            <p>Address: <span className="text-[#BEFE46]">{publicKey || 'Not connected'}</span></p>
          </div>
        </div>

        <div className="space-y-8">
          {!connected ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-white">Connect First</h2>
              <button
                onClick={connectWallet}
                className="inline-flex items-center justify-center gap-2 px-10 py-6 bg-[#BEFE46] border-4 border-[#BEFE46] text-[#010101] font-['IBM_Plex_Mono'] text-base font-normal cursor-pointer hover:bg-[#010101] hover:text-[#BEFE46] transition-all"
              >
                CONNECT WALLET
              </button>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Connected - Default Button</h2>
                <DisconnectButton 
                  walletAddress={formatAddress(publicKey)}
                  onClick={handleDisconnect}
                />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">Centered Layout</h2>
                <div className="flex justify-center">
                  <DisconnectButton 
                    walletAddress={formatAddress(publicKey)}
                    onClick={handleDisconnect}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Static Examples</h2>
            <div className="space-y-4">
              <DisconnectButton 
                walletAddress="6ZXc...gkU"
                onClick={() => alert('Static button clicked')}
              />
              <DisconnectButton 
                walletAddress="ABC1...xyz9"
                onClick={() => alert('Static button clicked')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
