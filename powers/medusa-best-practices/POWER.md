---
name: "medusa-best-practices"
displayName: "Medusa Best Practices"
description: "Essential best practices for building e-commerce applications with Medusa.js, covering API design, database optimization, and frontend integration patterns."
keywords: ["medusa", "ecommerce", "best-practices", "api", "optimization"]
author: "Your Team"
---

# Medusa Best Practices

## Overview

This power provides curated best practices for developing e-commerce applications with Medusa.js. It covers common patterns, performance optimizations, and architectural decisions that help you build scalable and maintainable storefronts.

Whether you're building a new Medusa project or optimizing an existing one, these guidelines will help you follow proven patterns and avoid common pitfalls.

## Core Principles

### 1. API-First Design
Always design your custom endpoints with the API consumer in mind. Keep responses consistent with Medusa's standard format.

### 2. Database Optimization
Use proper indexing and avoid N+1 queries. Leverage Medusa's query builder for efficient data fetching.

### 3. Frontend Performance
Implement proper caching strategies and optimize image loading for fast storefront experiences.

## Common Patterns

### Pattern: Custom Product Endpoints

**Problem:** Need to expose custom product data or filtering logic

**Solution:** Create custom API routes that extend Medusa's product endpoints

```typescript
// src/api/store/products/featured/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const productService = req.scope.resolve("productService")
  
  const products = await productService.list({
    is_featured: true
  }, {
    relations: ["variants", "images"],
    take: 10
  })
  
  res.json({ products })
}
```

### Pattern: Efficient Image Loading

**Problem:** Large product images slow down page load

**Solution:** Use Next.js Image component with proper sizing

```tsx
import Image from 'next/image'

<Image
  src={product.thumbnail}
  alt={product.title}
  width={400}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index < 3} // Prioritize above-the-fold images
/>
```

## Best Practices

- **Use TypeScript strictly** - Enable strict mode for better type safety
- **Implement proper error handling** - Always catch and handle API errors gracefully
- **Cache strategically** - Use Redis for session data and frequently accessed content
- **Optimize database queries** - Always specify relations and use pagination
- **Test payment flows thoroughly** - Test Stripe webhooks in both test and production modes
- **Implement proper logging** - Use structured logging for easier debugging
- **Follow Medusa conventions** - Stick to Medusa's naming and structure patterns

## Troubleshooting

### Issue: Slow Product Listing Pages

**Symptoms:**
- Product pages take >2 seconds to load
- High database query count

**Solutions:**
1. Add database indexes on frequently queried fields
2. Implement Redis caching for product lists
3. Use pagination instead of loading all products
4. Optimize image sizes and use CDN

### Issue: Cart State Inconsistencies

**Symptoms:**
- Cart items disappear on refresh
- Quantity updates don't persist

**Solutions:**
1. Verify cart ID is properly stored in cookies/localStorage
2. Check Medusa backend session configuration
3. Ensure cart updates use proper Medusa API endpoints
4. Implement optimistic UI updates with proper error handling

## Additional Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa GitHub](https://github.com/medusajs/medusa)
- [Medusa Discord Community](https://discord.gg/medusajs)

---

**Framework:** Medusa.js
**Type:** Knowledge Base Power
