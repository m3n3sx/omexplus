"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { isAuthenticated } from "@/lib/auth"
import { Store, CreditCard, Truck, DollarSign, Mail, Palette, Users, Shield, Bell, Globe } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("store")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }
  }, [router])

  const tabs = [
    { id: "store", label: "Sklep", icon: Store },
    { id: "appearance", label: "Wygląd", icon: Palette, href: "/settings/appearance" },
    { id: "payment", label: "Płatności", icon: CreditCard },
    { id: "shipping", label: "Wysyłka", icon: Truck },
    { id: "tax", label: "Podatki", icon: DollarSign },
    { id: "email", label: "Email", icon: Mail },
    { id: "notifications", label: "Powiadomienia", icon: Bell },
    { id: "users", label: "Użytkownicy", icon: Users, href: "/users" },
    { id: "security", label: "Bezpieczeństwo", icon: Shield },
    { id: "localization", label: "Lokalizacja", icon: Globe },
  ]

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert("Settings saved successfully!")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ustawienia</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Zarządzaj konfiguracją sklepu</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    if (tab.href) {
                      return (
                        <Link
                          key={tab.id}
                          href={tab.href}
                          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {tab.label}
                        </Link>
                      )
                    }
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === "store" && (
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Store Name" defaultValue="OMEX Store" />
                  <Input label="Store URL" defaultValue="https://omex-store.com" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Store Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      defaultValue="Your one-stop shop for quality products"
                    />
                  </div>
                  <Input label="Contact Email" type="email" defaultValue="contact@omex-store.com" />
                  <Input label="Support Phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </CardContent>
              </Card>
            )}

            {activeTab === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Stripe</span>
                    </label>
                  </div>
                  <Input label="Stripe Publishable Key" placeholder="pk_test_..." />
                  <Input label="Stripe Secret Key" type="password" placeholder="sk_test_..." />
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Enable PayPal</span>
                    </label>
                  </div>
                  <Input label="PayPal Client ID" placeholder="Your PayPal client ID" />
                </CardContent>
              </Card>
            )}

            {activeTab === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="Default Shipping Rate" type="number" step="0.01" defaultValue="5.00" />
                  <Input label="Free Shipping Threshold" type="number" step="0.01" defaultValue="50.00" />
                  <Input label="Processing Time (days)" type="number" defaultValue="2" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Shipping Zones
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">United States - $5.00</span>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">International - $15.00</span>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "tax" && (
              <Card>
                <CardHeader>
                  <CardTitle>Tax Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded text-primary-600 focus:ring-primary-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Enable automatic tax calculation</span>
                    </label>
                  </div>
                  <Input label="Default Tax Rate (%)" type="number" step="0.01" defaultValue="8.5" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tax Regions
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">California - 8.5%</span>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">New York - 7.0%</span>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "email" && (
              <Card>
                <CardHeader>
                  <CardTitle>Email Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input label="From Email" type="email" defaultValue="noreply@omex-store.com" />
                  <Input label="From Name" defaultValue="OMEX Store" />
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Email Templates</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Order Confirmation</span>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Shipping Notification</span>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">Refund Confirmation</span>
                        <Button size="sm" variant="ghost">Edit</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave} isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
