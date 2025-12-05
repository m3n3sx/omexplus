// Test backend connection
const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

async function testBackend() {
  console.log("Testing Medusa backend connection...")
  console.log("Backend URL:", BACKEND_URL)
  
  try {
    // Test 1: Check if backend is running
    console.log("\n1. Testing backend health...")
    const healthResponse = await fetch(`${BACKEND_URL}/health`)
    console.log("Health check status:", healthResponse.status)
    
    // Test 2: Try to get store info
    console.log("\n2. Testing store endpoint...")
    const storeResponse = await fetch(`${BACKEND_URL}/store`)
    const storeData = await storeResponse.json()
    console.log("Store response:", storeData)
    
    // Test 3: Try authentication
    console.log("\n3. Testing authentication endpoint...")
    const authResponse = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@medusa-test.com",
        password: "supersecret"
      }),
    })
    
    console.log("Auth status:", authResponse.status)
    
    if (authResponse.ok) {
      const authData = await authResponse.json()
      console.log("Auth successful!")
      console.log("Response:", authData)
    } else {
      const errorText = await authResponse.text()
      console.log("Auth failed:", errorText)
      
      // Try alternative admin endpoint
      console.log("\n4. Trying alternative admin auth...")
      const adminAuthResponse = await fetch(`${BACKEND_URL}/admin/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@medusa-test.com",
          password: "supersecret"
        }),
      })
      
      console.log("Admin auth status:", adminAuthResponse.status)
      if (adminAuthResponse.ok) {
        const adminAuthData = await adminAuthResponse.json()
        console.log("Admin auth successful!")
        console.log("Response:", adminAuthData)
      } else {
        const adminErrorText = await adminAuthResponse.text()
        console.log("Admin auth failed:", adminErrorText)
      }
    }
    
  } catch (error) {
    console.error("Error testing backend:", error)
  }
}

testBackend()
