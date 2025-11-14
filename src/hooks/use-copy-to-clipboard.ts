import { toast } from 'sonner'

/**
 * Custom hook for copying text to clipboard with toast notifications
 * @returns A function that copies text to clipboard and shows toast
 */
export function useCopyToClipboard() {
  const copyToClipboard = async (text: string, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(successMessage)
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy to clipboard')
      return false
    }
  }

  return copyToClipboard
}
