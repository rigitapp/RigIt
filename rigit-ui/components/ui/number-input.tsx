import * as React from 'react'
import { cn } from '@/lib/utils'

interface NumberInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  defaultValue?: string | number
}

function NumberInput({ className, defaultValue = '0.0', ...props }: NumberInputProps) {
  return (
    <input
      type="text"
      inputMode="decimal"
      defaultValue={defaultValue}
      className={cn(
        // Base styles matching Figma
        'font-mono font-semibold text-[40px] leading-normal',
        'bg-transparent border-none outline-none',
        'w-full text-center',
        // Default state - gray text #595959
        'text-[#595959]',
        // Active state - white text
        'focus:text-white',
        'transition-colors duration-200',
        // Remove default input styling
        'p-0 m-0',
        'placeholder:text-[#595959]',
        className,
      )}
      {...props}
    />
  )
}

export { NumberInput }
