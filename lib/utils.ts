import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// FORMATTING: Uses standard en-IN locale for Indian Rupee formatting
// Elaborated Concept: Intl.NumberFormat is extremely fast and native to V8, 
// ensuring ₹1,00,000 is formatted correctly based on the Indian numbering system.
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0, 
  }).format(amount)
}

export function parseNaturalLanguageExpense(input: string) {
  // Matches "450 dinner", "299 subscription yesterday"
  const amountMatch = input.match(/^(\d+(?:\.\d+)?)\s+(.*)/);
  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1]);
  let textRemaining = amountMatch[2].toLowerCase();
  
  let date = new Date();
  if (textRemaining.includes('yesterday')) {
    date.setDate(date.getDate() - 1);
    textRemaining = textRemaining.replace('yesterday', '').trim();
  }

  // Basic local categorization keyword mapping
  const categoryMap: Record<string, string> = {
    'uber': 'Transport', 'train': 'Transport', 'bus': 'Transport',
    'dinner': 'Food', 'lunch': 'Food', 'swiggy': 'Food', 'zomato': 'Food', 'coffee': 'Food',
    'netflix': 'Subscriptions', 'spotify': 'Subscriptions',
    'gym': 'Fitness', 'clothes': 'Shopping'
  };

  let category = 'Other';
  for (const [keyword, cat] of Object.entries(categoryMap)) {
    if (textRemaining.includes(keyword)) {
      category = cat;
      break;
    }
  }

  return {
    amount,
    description: textRemaining.charAt(0).toUpperCase() + textRemaining.slice(1),
    category,
    date: date.toISOString().split('T')[0],
  };
}
