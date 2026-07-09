import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility helper to safely merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formats numbers into Indian Rupees (₹)
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, 
  }).format(amount)
}

// Regex engine to parse natural language financial inputs
export function parseNaturalLanguageExpense(input: string) {
  // Extract the first consecutive sequence of numbers as the amount
  const amountMatch = input.match(/\d+/)
  const amount = amountMatch ? parseInt(amountMatch[0], 10) : 0

  // Strip the numbers out to isolate the item description
  let cleanText = input.replace(/\d+/, '').trim()

  // Calculate transaction date windows
  let date = new Date().toISOString().split('T')[0] // Defaults to today
  if (cleanText.toLowerCase().includes('yesterday')) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    date = yesterday.toISOString().split('T')[0]
    cleanText = cleanText.replace(/yesterday/i, '').trim()
  }

  // Fallback category routing rules
  let category = 'Other'
  const lowerText = cleanText.toLowerCase()
  if (
    lowerText.includes('food') || 
    lowerText.includes('dinner') || 
    lowerText.includes('lunch') || 
    lowerText.includes('swiggy') || 
    lowerText.includes('zomato') || 
    lowerText.includes('cafe') ||
    lowerText.includes('mcd')
  ) {
    category = 'Food'
  } else if (
    lowerText.includes('cab') || 
    lowerText.includes('auto') || 
    lowerText.includes('metro') || 
    lowerText.includes('uber') || 
    lowerText.includes('ola') || 
    lowerText.includes('petrol') ||
    lowerText.includes('fuel')
  ) {
    category = 'Transport'
  } else if (
    lowerText.includes('rent') || 
    lowerText.includes('bill') || 
    lowerText.includes('electricity') || 
    lowerText.includes('wifi') ||
    lowerText.includes('recharge')
  ) {
    category = 'Bills'
  } else if (
    lowerText.includes('movie') || 
    lowerText.includes('netflix') || 
    lowerText.includes('game') ||
    lowerText.includes('show')
  ) {
    category = 'Entertainment'
  }

  return {
    amount,
    description: cleanText || 'Quick Expense',
    category,
    date
  }
}
