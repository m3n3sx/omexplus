'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { isAuthenticated } from '@/lib/auth'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Eye, MousePointer,
  DollarSign, ShoppingCart, Target, Zap, Bot, RefreshCw,
  ArrowUpRight, ArrowDownRight, Calendar,
  Play, Pause, Settings, PlusCircle, Megaphone, LineChart,
  AlertCircle, CheckCircle
} from 'lucide-react'
import { AIMarketingManager } from '@/components/marketing/AIMarketingManager'

interface AnalyticsData {
  overview: {
    users: number
    usersTrend: number
    sessions: number
    sessionsTrend: number
    pageViews: number
    pageViewsTrend: number
    bounceRate: number
    bounceRateTrend: number
    avgSessionDuration: string
    conversionRate: number
  }
  topPages: Array<{ path: string; title: string; views: number }>
  trafficSources: Array<{ source: string; sessions: number; percentage: number }>
  chartData: Array<{ date: string; users: number; sessions: number }>
}

interface AdsData {
  overview: {
    spend: number
    spendTrend: number
    impressions: number
    impressionsTrend: number
    clicks: number
    clicksTrend: number
    ctr: number
    conversions: number
    conversionsTrend: number
    costPerConversion: number
    roas: number
  }
  campaigns: Array<{
    id: string
    name: string
    status: 'active' | 'paused' | 'ended'
    spend: number
    clicks: number
    impressions: number
    conversions: number
    roas: number
  }>
}

export default function MarketingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'analytics' | 'ads' | 'ai'>('analytics')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [adsData, setAdsData] = useState<AdsData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLiveData, setIsLiveData] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true)
      setError(null)

      const [analyticsRes, adsRes] = await Promise.all([
        fetch(`/api/analytics?range=${dateRange}`),
        fetch(`/api/ads?range=${dateRange}`)
      ])

      if (!analyticsRes.ok || !adsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [analytics, ads] = await Promise.all([
        analyticsRes.json(),
        adsRes.json()
      ])

      setAnalyticsData(analytics)
      setAdsData(ads)
      
      // Check if we're getting live data (based on response headers or data patterns)
      // For now, we'll assume it's mock data unless configured
      setIsLiveData(!!process.env.NEXT_PUBLIC_GOOGLE_CONFIGURED)
    } catch (err) {
      console.error('Error fetching marketing data:', err)
      setError('Nie udało się pobrać danych. Sprawdź konfigurację API.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [dateRange])

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    fetchData()
  }, [router, fetchData])

  const handleCampaignAction = async (campaignId: string, action: 'pause' | 'enable') => {
    try {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, campaignId })
      })
      
      if (res.ok) {
        fetchData() // Refresh data
      }
    } catch (err) {
      console.error('Campaign action failed:', err)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-gray-500">Pobieranie danych z Google...</p>
          </div>
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
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-500 dark:text-gray-400">Google Analytics, Ads i AI Campaign Manager</p>
              {isLiveData ? (
                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Live Data
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Demo Data
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="7d">Ostatnie 7 dni</option>
              <option value="30d">Ostatnie 30 dni</option>
              <option value="90d">Ostatnie 90 dni</option>
            </select>
            <button 
              onClick={fetchData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Odśwież
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
        {activeTab === 'analytics' && analyticsData && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard 
                title="Użytkownicy" 
                value={analyticsData.overview.users.toLocaleString('pl-PL')} 
                trend={analyticsData.overview.usersTrend}
                icon={Users}
              />
              <StatCard 
                title="Sesje" 
                value={analyticsData.overview.sessions.toLocaleString('pl-PL')} 
                trend={analyticsData.overview.sessionsTrend}
                icon={Eye}
              />
              <StatCard 
                title="Odsłony" 
                value={analyticsData.overview.pageViews.toLocaleString('pl-PL')} 
                trend={analyticsData.overview.pageViewsTrend}
                icon={MousePointer}
              />
              <StatCard 
                title="Bounce Rate" 
                value={`${analyticsData.overview.bounceRate}%`} 
                trend={analyticsData.overview.bounceRateTrend}
                icon={TrendingDown}
                invertTrend
              />
              <StatCard 
                title="Śr. czas sesji" 
                value={analyticsData.overview.avgSessionDuration} 
                icon={Calendar}
              />
              <StatCard 
                title="Konwersja" 
                value={`${analyticsData.overview.conversionRate}%`} 
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
                  {analyticsData.chartData.map((day, i) => {
                    const maxUsers = Math.max(...analyticsData.chartData.map(d => d.users))
                    const maxSessions = Math.max(...analyticsData.chartData.map(d => d.sessions))
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex gap-1 justify-center" style={{ height: '200px' }}>
                          <div 
                            className="w-3 bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${(day.users / (maxUsers || 1)) * 100}%` }}
                            title={`Użytkownicy: ${day.users.toLocaleString('pl-PL')}`}
                          />
                          <div 
                            className="w-3 bg-blue-200 rounded-t transition-all hover:bg-blue-300"
                            style={{ height: `${(day.sessions / (maxSessions || 1)) * 100}%` }}
                            title={`Sesje: ${day.sessions.toLocaleString('pl-PL')}`}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{day.date}</span>
                      </div>
                    )
                  })}
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
                  {analyticsData.trafficSources.map((source, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{source.source}</span>
                        <span className="font-medium">{source.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all"
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
                    {analyticsData.topPages.map((page, i) => (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 font-medium">{page.title}</td>
                        <td className="py-3 text-gray-500 text-sm font-mono">{page.path}</td>
                        <td className="py-3 text-right font-medium">{page.views.toLocaleString('pl-PL')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Ads Tab */}
        {activeTab === 'ads' && adsData && (
          <div className="space-y-6">
            {/* Ads Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <StatCard 
                title="Wydatki" 
                value={`${adsData.overview.spend.toLocaleString('pl-PL')} zł`} 
                trend={adsData.overview.spendTrend}
                icon={DollarSign}
              />
              <StatCard 
                title="Wyświetlenia" 
                value={adsData.overview.impressions.toLocaleString('pl-PL')} 
                trend={adsData.overview.impressionsTrend}
                icon={Eye}
              />
              <StatCard 
                title="Kliknięcia" 
                value={adsData.overview.clicks.toLocaleString('pl-PL')} 
                trend={adsData.overview.clicksTrend}
                icon={MousePointer}
              />
              <StatCard 
                title="CTR" 
                value={`${adsData.overview.ctr}%`} 
                icon={Target}
              />
              <StatCard 
                title="Konwersje" 
                value={adsData.overview.conversions.toString()} 
                trend={adsData.overview.conversionsTrend}
                icon={ShoppingCart}
              />
              <StatCard 
                title="CPA" 
                value={`${adsData.overview.costPerConversion.toFixed(2)} zł`} 
                icon={DollarSign}
              />
              <StatCard 
                title="ROAS" 
                value={`${adsData.overview.roas}x`} 
                icon={TrendingUp}
                highlight
              />
            </div>

            {/* Campaigns */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Kampanie</h3>
                <a 
                  href="https://ads.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Nowa kampania
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500 border-b">
                      <th className="pb-3">Kampania</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Wydatki</th>
                      <th className="pb-3 text-right">Wyświetlenia</th>
                      <th className="pb-3 text-right">Kliknięcia</th>
                      <th className="pb-3 text-right">Konwersje</th>
                      <th className="pb-3 text-right">ROAS</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {adsData.campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                        <td className="py-3 text-right">{campaign.spend.toLocaleString('pl-PL')} zł</td>
                        <td className="py-3 text-right">{campaign.impressions.toLocaleString('pl-PL')}</td>
                        <td className="py-3 text-right">{campaign.clicks.toLocaleString('pl-PL')}</td>
                        <td className="py-3 text-right">{campaign.conversions}</td>
                        <td className="py-3 text-right">
                          <span className={campaign.roas >= 4 ? 'text-green-600 font-medium' : campaign.roas >= 2 ? 'text-yellow-600' : 'text-red-600'}>
                            {campaign.roas}x
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {campaign.status === 'active' && (
                              <button 
                                onClick={() => handleCampaignAction(campaign.id, 'pause')}
                                className="p-2 hover:bg-yellow-100 rounded-lg text-yellow-600"
                                title="Wstrzymaj"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}
                            {campaign.status === 'paused' && (
                              <button 
                                onClick={() => handleCampaignAction(campaign.id, 'enable')}
                                className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                                title="Wznów"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                              <Settings className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 text-left">
                <Zap className="w-6 h-6 mb-2" />
                <h4 className="font-semibold">Smart Bidding</h4>
                <p className="text-sm opacity-90">Optymalizuj stawki automatycznie</p>
              </a>
              <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 text-left">
                <Target className="w-6 h-6 mb-2" />
                <h4 className="font-semibold">Remarketing</h4>
                <p className="text-sm opacity-90">Dotrzyj do porzuconych koszyków</p>
              </a>
              <a href="https://ads.google.com" target="_blank" rel="noopener noreferrer" className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 text-left">
                <LineChart className="w-6 h-6 mb-2" />
                <h4 className="font-semibold">Performance Max</h4>
                <p className="text-sm opacity-90">Kampanie AI-powered</p>
              </a>
            </div>
          </div>
        )}

        {/* AI Manager Tab */}
        {activeTab === 'ai' && (
          <AIMarketingManager analyticsData={analyticsData} adsData={adsData} />
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
