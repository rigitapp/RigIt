"use client";

import { ClaimButtons } from '@/components/claim-buttons'

export default function ClaimButtonsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Claim Buttons Demo</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive buttons with active, hover, and inactive states
          </p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">How it works:</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <strong>Active state:</strong> Black background, lime green
                border and text
              </li>
              <li>
                <strong>Inactive state:</strong> Gray background and border,
                black text
              </li>
              <li>
                <strong>Hover state:</strong> Lime green background, black text
                (only on active button)
              </li>
              <li>When one button is active, the other is automatically inactive</li>
              <li>Click any button to switch the active state</li>
            </ul>
          </div>

          <ClaimButtons
            onClaimWinnings={() => console.log('Claiming winnings...')}
            onClaimRefunds={() => console.log('Claiming refunds...')}
            defaultActive="winnings"
          />
        </div>

        <div className="mt-8 bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Color Reference</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#BEFE46] border border-gray-300 rounded"></div>
              <div>
                <div className="font-mono text-sm">#BEFE46</div>
                <div className="text-xs text-gray-600">Lime Green (active text & border)</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#010101] border border-gray-300 rounded"></div>
              <div>
                <div className="font-mono text-sm">#010101</div>
                <div className="text-xs text-gray-600">Black (active background, inactive text)</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#666666] border border-gray-300 rounded"></div>
              <div>
                <div className="font-mono text-sm">#666666</div>
                <div className="text-xs text-gray-600">Gray (inactive background & border)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
