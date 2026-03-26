'use client'

import * as React from 'react'
import { Check, ChevronDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface CreatableSelectOption {
  value: string
  label: string
  color?: string
}

interface CreatableSelectProps {
  options: CreatableSelectOption[]
  value: string
  onChange: (value: string) => void
  onAddNew?: (value: string) => void
  placeholder?: string
  emptyText?: string
  className?: string
}

const defaultColors = [
  'bg-orange-100 text-orange-700 border-orange-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-green-100 text-green-700 border-green-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-yellow-100 text-yellow-700 border-yellow-200',
  'bg-red-100 text-red-700 border-red-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-teal-100 text-teal-700 border-teal-200',
  'bg-cyan-100 text-cyan-700 border-cyan-200',
]

export function CreatableSelect({
  options,
  value,
  onChange,
  onAddNew,
  placeholder = 'Lựa chọn hoặc thêm mới',
  emptyText = 'Không tìm thấy kết quả',
  className,
}: CreatableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const selectedOption = options.find((option) => option.value === value)
  
  // Check if input matches any existing option
  const matchingOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  )
  
  const showAddNew = inputValue.trim() !== '' && 
    !options.some((option) => 
      option.label.toLowerCase() === inputValue.toLowerCase() ||
      option.value.toLowerCase() === inputValue.toLowerCase()
    )

  const getColorForOption = (index: number) => {
    return defaultColors[index % defaultColors.length]
  }

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setOpen(false)
    setInputValue('')
  }

  const handleAddNew = () => {
    if (inputValue.trim() && onAddNew) {
      const newValue = inputValue.trim().toLowerCase().replace(/\s+/g, '-')
      onAddNew(inputValue.trim())
      onChange(newValue)
      setOpen(false)
      setInputValue('')
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between',
            className
          )}
        >
          {selectedOption ? (
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium border',
                selectedOption.color || getColorForOption(options.indexOf(selectedOption))
              )}
            >
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={inputValue}
            onValueChange={setInputValue}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {matchingOptions.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded text-xs font-medium border',
                      option.color || getColorForOption(index)
                    )}
                  >
                    {option.label}
                  </span>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-blue-600 ml-auto" />
                  )}
                </CommandItem>
              ))}
              {showAddNew && (
                <CommandItem
                  value={`add-new-${inputValue}`}
                  onSelect={handleAddNew}
                  className="flex items-center gap-2 cursor-pointer text-blue-600 border-t border-gray-100 mt-1 pt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm lựa chọn &quot;{inputValue}&quot;</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
