import { NumberInput } from '@/components/ui/number-input'

export default function NumberInputDemo() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-8 text-center">Number Input States</h1>
        </div>

        {/* Default State */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">Default State</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <NumberInput defaultValue="0.0" placeholder="0.0" />
          </div>
          <p className="text-sm text-muted-foreground">
            Text color: #595959 (gray) - shown when not focused
          </p>
        </div>

        {/* Active State */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">Active State (Click to focus)</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <NumberInput defaultValue="0.5" placeholder="0.0" />
          </div>
          <p className="text-sm text-muted-foreground">
            Text color: #FFFFFF (white) - shown when focused/active
          </p>
        </div>

        {/* Interactive Example */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-muted-foreground">Try it yourself</h2>
          <div className="bg-card border border-border rounded-lg p-8">
            <NumberInput placeholder="0.0" />
          </div>
          <p className="text-sm text-muted-foreground">
            Click to focus and see the color change from gray to white
          </p>
        </div>
      </div>
    </div>
  )
}
