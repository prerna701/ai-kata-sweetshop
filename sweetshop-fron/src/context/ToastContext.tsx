import React, { createContext, useContext } from 'react'
import { toast } from 'sonner'

// Create the context
const ToastContext = createContext<any>(null)

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

// The provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  
  // Show success toast with Sonner
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, {
      description: description
    })
  }

  // Show error toast with Sonner
  const showError = (message: string, description?: string) => {
    toast.error(message, {
      description: description
    })
  }

  // Show info toast with Sonner
  const showInfo = (message: string, description?: string) => {
    toast.info(message, {
      description: description
    })
  }

  // Provide all toast functions
  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
    </ToastContext.Provider>
  )
}