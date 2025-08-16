"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Info, AlertTriangle, Bell } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right" duration={3500}>
      {toasts.map(function ({ id, title, description, action, icon, ...props }) {
        const resolvedVariant = (props as any).variant ?? 'success'
        const defaultIcon =
          resolvedVariant === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : resolvedVariant === 'destructive' ? (
            <AlertTriangle className="h-5 w-5" />
          ) : resolvedVariant === 'info' ? (
            <Info className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )
        const RenderIcon = icon ?? defaultIcon
        return (
          <Toast key={id} {...props} variant={resolvedVariant as any} className="">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{RenderIcon}</div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
} 