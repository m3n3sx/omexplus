'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { isAuthenticated } from '@/lib/auth'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Eye, MousePointer,
  DollarSign, ShoppingCart, Target, Zap, Bot, RefreshCw,
  ArrowUpRight, ArrowDownRight, Calendar,
  Play, Pause, Settings, PlusCircle, Megaphone, LineChart
} from 'lucide-react'
import { AIMarketingManager } from '@/components/marketing/AIMarketingManager'

// Simulated data - in production this would come from Google APIs
const MOCK_ANALYTICS = {
  overview: {
    users: 12453,
    usersTrend: 12.5,
    sessions: 18234,
    sessionsTrend: 8.3,
    pageViews: 45678,
    pageViewsTrend: 15.2,
    bounceRate: 42.3,
    bounceRateTrend: -3.1,
    avgSessionDuration: '2:34',
    conversionRate: 3.2,
  },
  topPages: [
    { path: '/', views: 8234, title: 'Strona główna' },
    { path: '/pl/products', views: 5123, title: 'Produkty' },
    { path: '/pl/categories/filtry', views: 3456, title: 'Filtry' },
    { path: '/pl/products/filtr-oleju-cat', views: 2345, title: 'Filtr oleju CAT' },
    { path: '/pl/kontakt', views: 1234, title: 'Kontakt' },
  ],
  trafficSources: [
    { source: 'Google Organic', sessions: 7234, percentage: 39.7 },
    { source: 'Google Ads', sessions: 4567, percentage: 25.0 },
    { source: 'Direct', sessions: 3456, percentage: 19.0 },
    { source: 'Facebook', sessions: 1890, percentage: 10.4 },
    { source: 'Referral', sessions: 1087, percentage: 6.0 },
  ],
  chartData: [
    { date: '24 Dec', users: 1234, sessions: 1567 },
    { date: '25 Dec', users: 987, sessions: 1234 },
    { date: '26 Dec', users: 1456, sessions: 1890 },
    { date: '27 Dec', users: 1678, sessions: 2123 },
    { date: '28 Dec', users: 1890, sessions: 2456 },
    { date: '29 Dec', users: 2012, sessions: 2678 },
    { date: '30 Dec', users: 2234, sessions: 2890 },
  ]
}

const MOCK_ADS = {
  overview: {
    spend: 4567.89,
    spendTrend: 5.2,
    impressions: 234567,
    impressionsTrend: 12.3,
    clicks: 5678,
    clicksTrend: 8.9,
    ctr: 2.42,
    conversions: 123,
    conversionsTrend: 15.6,
    costPerConversion: 37.14,
    roas: 4.2,
  },
  campaigns: [
    { id: 1, name: 'Filtry CAT - Search', status: 'active', spend: 1234.56, clicks: 2345, conversions: 45, roas: 5.2 },
    { id: 2, name: 'Części Komatsu - Display', status: 'active', spend: 890.12, clicks: 1234, conversions: 23, roas: 3.8 },
    { id: 3, name: 'Remarketing - Koszyk', status: 'active', spend: 567.89, clicks: 890, conversions: 34, roas: 6.1 },
    { id: 4, name: 'Brand - OMEX', status: 'paused', spend: 234.56, clicks: 567, conversions: 12, roas: 4.5 },
    { id: 5, name: 'Promocje świąteczne', status: 'ended', spend: 1640.76, clicks: 642, conversions: 9, roas: 2.1 },
  ]
}

export default function MarketingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'analytics' | 'ads' | 'ai'>('analytics')
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    // Simulate loading
    setTimeout(() => setLoading(false), 500)
  }, [router])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketing & Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400">Google Analytics, Ads i AI Campaign Manager</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="7d">Ostatnie 7 dni</option>
              <option value="30d">Ostatnie 30 dni</option>
              <option value="90d">Ostatnie 90 dni</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <RefreshCw className="w-4 h-4" />
              Odśwież
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'analytics' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ads' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Google Ads
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'ai' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'hover:bg-white/50'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Manager
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard 
                title="Użytkownicy" 
                value={MOCK_ANALYTICS.overview.users.toLocaleString()} 
                trend={MOCK_ANALYTICS.overview.usersTrend}
                icon={Users}
              />
              <StatCard 
                title="Sesje" 
                value={MOCK_ANALYTICS.overview.sessions.toLocaleString()} 
                trend={MOCK_ANALYTICS.overview.sessionsTrend}
                icon={Eye}
              />
              <StatCard 
                title="Odsłony" 
                value={MOCK_ANALYTICS.overview.pageViews.toLocaleString()} 
                trend={MOCK_ANALYTICS.overview.pageViewsTrend}
                icon={MousePointer}
              />
              <StatCard 
                title="Bounce Rate" 
                value={`${MOCK_ANALYTICS.overview.bounceRate}%`} 
                trend={MOCK_ANALYTICS.overview.bounceRateTrend}
                icon={TrendingDown}
                invertTrend
              />
              <StatCard 
                title="Śr. czas sesji" 
                value={MOCK_ANALYTICS.overview.avgSessionDuration} 
                icon={Calendar}
              />
              <StatCard 
                title="Konwersja" 
                value={`${MOCK_ANALYTICS.overview.conversionRate}%`} 
                icon={Target}
                highlight
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <h3 className="font-semibold mb-4">Ruch na stronie</h3>
                <div className="h-64 flex items-end gap-2">
                  {MOCK_ANALYTICS.chartData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-1 justify-center" style={{ height: '200px' }}>
                        <div 
                          className="w-3 bg-blue-500 rounded-t"
                          style={{ height: `${(day.users / 2500) * 100}%` }}
                          title={`Użytkownicy: ${day.users}`}
                        />
                        <div 
                          className="w-3 bg-blue-200 rounded-t"
                          style={{ height: `${(day.sessions / 3000) * 100}%` }}
                          title={`Sesje: ${day.sessions}`}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{day.date.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span>Użytkownicy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-200 rounded" />
                    <span>Sesje</span>
                  </div>
                </div>
              </div>

              {/* Traffic Sources */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
                <h3 className="font-semibold mb-4">Źródła ruchu</h3>
                <div className="space-y-4">
                  {MOCK_ANALYTICS.trafficSources.map((source, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{source.source}</span>
                        <span className="font-medium">{source.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">Najpopularniejsze strony</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3">Strona</th>
                      <th className="pb-3">Ścieżka</th>
                      <th className="pb-3 text-right">Odsłony</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ANALYTICS.topPages.map((page, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 font-medium">{page.title}</td>
                        <td className="py-3 text-gray-500 text-sm">{page.path}</td>
                        <td className="py-3 text-right font-medium">{page.views.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Ads Tab */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            {/* Ads Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <StatCard 
                title="Wydatki" 
                value={`${MOCK_ADS.overview.spend.toLocaleString()} zł`} 
                trend={MOCK_ADS.overview.spendTrend}
                icon={DollarSign}
              />
              <StatCard 
                title="Wyświetlenia" 
                value={MOCK_ADS.overview.impressions.toLocaleString()} 
                trend={MOCK_ADS.overview.impressionsTrend}
                icon={Eye}
              />
              <StatCard 
                title="Kliknięcia" 
                value={MOCK_ADS.overview.clicks.toLocaleString()} 
                trend={MOCK_ADS.overview.clicksTrend}
                icon={MousePointer}
              />
              <StatCard 
                title="CTR" 
                value={`${MOCK_ADS.overview.ctr}%`} 
                icon={Target}
              />
              <StatCard 
                title="Konwersje" 
                value={MOCK_ADS.overview.conversions.toString()} 
                trend={MOCK_ADS.overview.conversionsTrend}
                icon={ShoppingCart}
              />
              <StatCard 
                title="CPA" 
                value={`${MOCK_ADS.overview.costPerConversion.toFixed(2)} zł`} 
                icon={DollarSign}
              />
              <StatCard 
                title="ROAS" 
                value={`${MOCK_ADS.overview.roas}x`} 
                icon={TrendingUp}
                highlight
              />
            </div>

            {/* Campaigns */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Kampanie</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <PlusCircle className="w-4 h-4" />
                  Nowa kampania
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3">Kampania</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Wydatki</th>
                      <th className="pb-3 text-right">Kliknięcia</th>
                      <th className="pb-3 text-right">Konwersje</th>
                      <th className="pb-3 text-right">ROAS</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ADS.campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{campaign.name}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                            campaign.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {campaign.status === 'active' && <Play className="w-3 h-3" />}
                            {campaign.status === 'paused' && <Pause className="w-3 h-3" />}
                            {campaign.status === 'active' ? 'Aktywna' : campaign.status === 'paused' ? 'Wstrzymana' : 'Zakończona'}
                          </span>
                        </td>
                        <td className="py-3 text-right">{campaign.spend.toLocaleString()} zł</td>
                        <td className="py-3 text-right">{campaign.clicks.toLocaleString()}</td>
                        <td className="py-3 text-right">{campaign.conversions}</td>
                        <td className="py-3 text-right">
                          <span className={campaign.roas >= 4 ? 'text-green-600 font-medium' : campaign.roas >= 2 ? 'text-yellow-600' : 'text-red-600'}>
                            {campaign.roas}x
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Settings className="w-4 h-4 text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 text-left">
                <Zap className="w-6 h-6 mb-2" />
                <h4 className="font-semibold">Smart Bidding</h4>
                <p className="text-sm opacity-90">Optymalizuj stawki automatycznie</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 text-left">
                <Target className="w-6 h-6 mb-2" />
                <h4 className="font-semibold">Remarketing</h4>
                <p className="text-sm opacity-90">Dotrzyj do porzuconych koszyków</p>
              </button>
              <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 text-left">
                <LineChart className="w-6 h-6 mb-2" />
                <h4 className="font-semibold">Performance Max</h4>
                <p className="text-sm opacity-90">Kampanie AI-powered</p>
              </button>
            </div>
          </div>
        )}

        {/* AI Manager Tab */}
        {activeTab === 'ai' && (
          <AIMarketingManager />
        )}
      </div>
    </DashboardLayout>
  )
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  highlight,
  invertTrend 
}: { 
  title: string
  value: string
  trend?: number
  icon: any
  highlight?: boolean
  invertTrend?: boolean
}) {
  const isPositive = invertTrend ? (trend || 0) < 0 : (trend || 0) > 0
  
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'bg-white dark:bg-gray-800'}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${highlight ? 'text-blue-600' : 'text-gray-400'}`} />
        {trend !== undefined && (
          <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={`text-xl font-bold ${highlight ? 'text-blue-600' : ''}`}>{value}</div>
      <div className="text-xs text-gray-500">{title}</div>
    </div>
  )
}
