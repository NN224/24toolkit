import { toast } from 'sonner'
import i18n from '@/i18n'

/**
 * Custom hook for copying text to clipboard with toast notifications
 * @returns A function that copies text to clipboard and shows toast
 */
export function useCopyToClipboard() {
  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(successMessage || i18n.t('common.copied'))
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error(i18n.t('common.copyFailed'))
      return false
    }
  }

  return copyToClipboard
}
