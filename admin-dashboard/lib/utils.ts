import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, currencyCode: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount / 100)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    requires_action: "bg-orange-100 text-orange-800",
    archived: "bg-gray-100 text-gray-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    captured: "bg-green-100 text-green-800",
    awaiting: "bg-yellow-100 text-yellow-800",
    not_paid: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
    partially_refunded: "bg-purple-100 text-purple-800",
    canceled: "bg-gray-100 text-gray-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

export function getFulfillmentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    fulfilled: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    partially_fulfilled: "bg-yellow-100 text-yellow-800",
    not_fulfilled: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}
