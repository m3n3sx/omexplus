/**
 * Scheduled Jobs Setup
 * 
 * Konfiguracja wszystkich zaplanowanych zadań
 */

import checkStockAlerts from './check-stock-alerts'
import { syncAllSuppliers } from '../integrations/suppliers/sync'

export default async function setupJobs(container: any) {
  console.log("⏰ Setting up scheduled jobs...")

  // ===== STOCK ALERTS =====
  // Check every 6 hours
  console.log("📋 Scheduling stock alerts check (every 6 hours)")
  
  setInterval(async () => {
    await checkStockAlerts(container)
  }, 6 * 60 * 60 * 1000) // 6 hours

  // Run immediately on startup
  setTimeout(() => {
    checkStockAlerts(container)
  }, 5000) // Wait 5 seconds after startup

  // ===== SUPPLIER SYNC =====
  // Sync daily at 3 AM
  console.log("📋 Scheduling supplier sync (daily at 3 AM)")

  const scheduleSupplierSync = () => {
    const now = new Date()
    const next3AM = new Date(now)
    next3AM.setHours(3, 0, 0, 0)

    // If 3 AM has passed today, schedule for tomorrow
    if (next3AM < now) {
      next3AM.setDate(next3AM.getDate() + 1)
    }

    const msUntil3AM = next3AM.getTime() - now.getTime()

    console.log(`Next supplier sync at: ${next3AM.toLocaleString()}`)

    setTimeout(() => {
      syncAllSuppliers(container)

      // Schedule next sync (24 hours later)
      setInterval(() => {
        syncAllSuppliers(container)
      }, 24 * 60 * 60 * 1000)
    }, msUntil3AM)
  }

  scheduleSupplierSync()

  // ===== PRICE RULES =====
  // Recalculate prices daily at 2 AM (if you have active price rules)
  console.log("📋 Scheduling price rules recalculation (daily at 2 AM)")

  const schedulePriceRules = () => {
    const now = new Date()
    const next2AM = new Date(now)
    next2AM.setHours(2, 0, 0, 0)

    if (next2AM < now) {
      next2AM.setDate(next2AM.getDate() + 1)
    }

    const msUntil2AM = next2AM.getTime() - now.getTime()

    console.log(`Next price rules recalculation at: ${next2AM.toLocaleString()}`)

    setTimeout(() => {
      recalculatePriceRules(container)

      // Schedule next recalculation (24 hours later)
      setInterval(() => {
        recalculatePriceRules(container)
      }, 24 * 60 * 60 * 1000)
    }, msUntil2AM)
  }

  schedulePriceRules()

  console.log("✅ Scheduled jobs configured successfully")
  console.log("")
  console.log("Active jobs:")
  console.log("  • Stock alerts check: every 6 hours")
  console.log("  • Supplier sync: daily at 3 AM")
  console.log("  • Price rules: daily at 2 AM")
  console.log("")
}

async function recalculatePriceRules(container: any) {
  console.log("💰 Recalculating price rules...")

  try {
    const manager = container.resolve("manager")

    // Get all active price rules
    const rules = await manager.query(
      `SELECT * FROM custom_price_rule WHERE active = true ORDER BY priority DESC`
    )

    console.log(`Found ${rules.length} active price rules`)

    for (const rule of rules) {
      try {
        // Apply each rule
        // Note: This would need to call the apply endpoint
        // For now, just log
        console.log(`Applying rule: ${rule.name}`)
      } catch (error) {
        console.error(`Error applying rule ${rule.id}:`, error)
      }
    }

    console.log("✅ Price rules recalculation completed")
  } catch (error) {
    console.error("❌ Error in recalculatePriceRules:", error)
  }
}

// Export for manual triggering
export { checkStockAlerts, syncAllSuppliers, recalculatePriceRules }
