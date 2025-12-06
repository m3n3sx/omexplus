const { MedusaModule } = require("@medusajs/framework/modules-sdk")

async function createAdmin() {
  const userModule = MedusaModule.getUserModuleService()
  
  try {
    // Usuń starego admina jeśli istnieje
    const existing = await userModule.listUsers({ email: 'admin@omex.pl' })
    if (existing.length > 0) {
      await userModule.deleteUsers(existing[0].id)
    }
    
    // Stwórz nowego
    const admin = await userModule.createUsers({
      email: 'admin@omex.pl',
      password: 'supersecret',
      first_name: 'Admin',
      last_name: 'OMEX'
    })
    
    console.log('✅ Admin utworzony:', admin.email)
  } catch (err) {
    console.error('❌ Błąd:', err.message)
  }
}

createAdmin()
