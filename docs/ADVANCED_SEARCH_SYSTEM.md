# Advanced B2B Machinery Parts Search System

## 🎯 Overview

A production-ready, AI-powered search system designed for non-technical B2B customers to find compatible machinery parts through an intuitive 6-step wizard.

## 🏗️ Architecture

### Layer 1: Initial Context
- **Natural Language Input**: Text, voice, or form-based
- **AI Processing**: Extracts machine type, manufacturer, model, and issue

### Layer 2: 6-Step Wizard
1. **Machine Type**: Visual grid with autocomplete
2. **Manufacturer**: Filtered by machine type, sorted by popularity
3. **Model**: Detailed specs preview, year range filtering
4. **Symptom/Issue**: AI-powered natural language understanding
5. **Category**: AI-suggested categories based on symptom
6. **Part Results**: Compatibility-validated parts with recommendations

### Layer 3: Smart Matching & Validation
- Real-time compatibility checking
- Confidence scoring (0-100%)
- Original vs. compatible part identification
- Stock availability validation

### Layer 4: AI Predictions
- Autocomplete at every step
- Symptom-to-category mapping
- Purchase history analysis
- Frequently bought together recommendations

### Layer 5: Visual Previews
- Machine images and specs
- Part category icons
- Compatibility gauges
- Stock status indicators
- Price comparisons

### Layer 6: Smart Suggestions
- "Customers also bought" recommendations
- Upgrade opportunities
- Maintenance kit suggestions

### Layer 7: Error Prevention
- Pre-purchase validation
- Compatibility warnings
- Stock availability checks
- Alternative part suggestions

## 📊 Database Schema

### Core Tables

#### `machine_types`
- Stores machinery categories (excavator, loader, etc.)
- Includes popularity scores and multilingual names

#### `manufacturers`
- Manufacturer data linked to machine types
- Regional popularity tracking

#### `machine_models`
- Specific models with detailed specs
- Year ranges, power, weight, technical specifications

#### `symptom_mappings` (AI CORE)
- Maps natural language symptoms to part categories
- Keyword-based matching
- Confidence scoring

#### `compatibility_matrix`
- Part-to-machine compatibility data
- Confidence levels: perfect, compatible, check_specs, not_compatible
- Original part identification

#### `purchase_history`
- Customer purchase tracking
- Used for recommendations

#### `frequently_bought_together`
- Cross-sell recommendations
- Frequency scoring

#### `saved_searches`
- Customer search history
- Quick reorder functionality

#### `search_analytics`
- Search behavior tracking
- Conversion analytics

## 🔌 API Endpoints

### GET `/api/advanced-search?action=autocomplete`
**Parameters:**
- `query`: Search string
- `step`: Current wizard step (1-6)
- `machineTypeId`: (optional) Filter by machine type
- `manufacturerId`: (optional) Filter by manufacturer

**Returns:**
```json
{
  "success": true,
  "results": [...],
  "count": 10
}
```

### POST `/api/advanced-search` (action: analyze-query)
**Body:**
```json
{
  "action": "analyze-query",
  "query": "Hydraulic pump for my CAT 320D"
}
```

**Returns:**
```json
{
  "success": true,
  "analysis": {
    "machineType": "excavator",
    "manufacturer": "cat",
    "model": "cat-320d",
    "issue": "Pump not working",
    "confidence": 95,
    "suggestedCategory": "Hydraulics"
  }
}
```

### POST `/api/advanced-search` (action: suggest-parts)
**Body:**
```json
{
  "action": "suggest-parts",
  "machineModelId": "cat-320d",
  "categoryId": "hydraulics"
}
```

**Returns:**
```json
{
  "success": true,
  "parts": [
    {
      "id": "part-123",
      "title": "Hydraulic Pump CAT 320D",
      "price": 2500.00,
      "compatibility_level": "perfect",
      "confidence_score": 98.5,
      "is_original": true,
      "in_stock": true,
      "quantity": 5
    }
  ]
}
```

### GET `/api/advanced-search?action=validate-part`
**Parameters:**
- `machineId`: Machine model ID
- `partId`: Product ID

**Returns:**
```json
{
  "success": true,
  "compatible": true,
  "confidence": 98.5,
  "level": "perfect",
  "isOriginal": true,
  "machineName": "CAT 320D",
  "yearRange": "2005-2013",
  "reason": "✅ Original part - 98.5% perfect match"
}
```

### GET `/api/advanced-search?action=recommendations`
**Parameters:**
- `machineId`: Machine model ID
- `partId`: (optional) Product ID

**Returns:**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "part-456",
      "title": "Hydraulic Seal Kit",
      "price": 150.00,
      "in_stock": true,
      "reason": "87% of customers also buy this"
    }
  ]
}
```

## 🎨 React Components

### Main Components

#### `AdvancedSearchSystem.tsx`
- Main container component
- Manages wizard state and navigation
- Handles AI query analysis
- Tracks analytics

#### `SearchInput.tsx`
- Initial search interface
- Voice input support (Web Speech API)
- Example searches
- Manual wizard trigger

#### `MachineTypeSelector.tsx`
- Visual grid of machine types
- Autocomplete search
- Popularity indicators
- Multilingual support

#### `ManufacturerSelector.tsx`
- Filtered by machine type
- Sort by popularity or name
- Regional indicators
- Popularity bars

#### `ModelSelector.tsx`
- Detailed specs preview
- Year range display
- Power and weight specs
- Popularity badges

#### `SymptomSelector.tsx` (AI CORE)
- Natural language input
- AI-powered autocomplete
- Common symptom quick-select
- Real-time suggestions

#### `CategorySelector.tsx`
- AI-suggested categories
- Confidence scoring
- Match explanations
- "Show all" fallback

#### `PartResults.tsx`
- Compatibility-sorted results
- Filter by stock status
- Sort by compatibility or price
- Visual compatibility indicators

#### `CompatibilityValidator.tsx`
- Real-time validation
- Confidence meter
- Original part badges
- Warning messages

#### `RecommendationPanel.tsx`
- Frequently bought together
- Upgrade suggestions
- Maintenance reminders

### Utility Components

#### `AutocompleteDropdown.tsx`
- Reusable autocomplete UI
- Keyboard navigation
- Click-outside handling

#### `ProgressBar.tsx`
- Visual progress indicator
- Step navigation
- Back/Reset buttons

## 🧪 Testing Examples

### Unit Tests

```typescript
// Test AI query analysis
describe('AISearchService', () => {
  it('should extract machine type from query', async () => {
    const result = await aiService.analyzeSearchQuery('CAT excavator pump')
    expect(result.machineType).toBe('excavator')
    expect(result.manufacturer).toBe('cat')
  })

  it('should map symptom to category', async () => {
    const categories = await aiService.mapSymptomToCategory('pump leaking')
    expect(categories[0].category).toBe('Hydraulics')
    expect(categories[0].subcategory).toBe('Pumps')
  })
})
```

### Integration Tests

```typescript
// Test complete search flow
describe('Advanced Search Flow', () => {
  it('should complete full wizard flow', async () => {
    // Step 1: Select machine type
    const machineTypes = await fetch('/api/advanced-search?action=autocomplete&query=&step=1')
    expect(machineTypes.results).toHaveLength(7)

    // Step 2: Select manufacturer
    const manufacturers = await fetch('/api/advanced-search?action=autocomplete&query=cat&step=2&machineTypeId=excavator')
    expect(manufacturers.results[0].id).toBe('cat')

    // Step 3: Select model
    const models = await fetch('/api/advanced-search?action=autocomplete&query=320&step=3&manufacturerId=cat')
    expect(models.results[0].id).toBe('cat-320d')

    // Step 4: Analyze symptom
    const analysis = await fetch('/api/advanced-search', {
      method: 'POST',
      body: JSON.stringify({ action: 'analyze-query', query: 'pump leaking' })
    })
    expect(analysis.suggestedCategory).toBe('Hydraulics')

    // Step 5: Get parts
    const parts = await fetch('/api/advanced-search', {
      method: 'POST',
      body: JSON.stringify({ 
        action: 'suggest-parts',
        machineModelId: 'cat-320d',
        categoryId: 'hydraulics'
      })
    })
    expect(parts.parts.length).toBeGreaterThan(0)

    // Step 6: Validate compatibility
    const validation = await fetch('/api/advanced-search?action=validate-part&machineId=cat-320d&partId=part-123')
    expect(validation.compatible).toBe(true)
  })
})
```

### E2E Tests

```typescript
// Test user journey
describe('User Journey', () => {
  it('should guide non-technical user to correct part', async () => {
    // User enters natural language query
    await page.type('input[placeholder*="looking for"]', 'My CAT excavator pump is broken')
    await page.click('button:has-text("Search Parts")')

    // AI pre-fills wizard
    await page.waitForSelector('text=Step 4: What\'s the Problem?')
    
    // User confirms symptom
    await page.click('button:has-text("Pump not working")')

    // AI suggests category
    await page.waitForSelector('text=AI-Suggested Categories')
    await page.click('button:has-text("Hydraulics")')

    // User sees compatible parts
    await page.waitForSelector('text=Compatible Parts')
    const firstPart = await page.locator('.part-card').first()
    expect(await firstPart.locator('text=✅ Perfect Match').count()).toBe(1)

    // User selects part
    await firstPart.click('button:has-text("Select Part")')

    // Compatibility validation shown
    await page.waitForSelector('text=Compatibility Check')
    expect(await page.locator('text=✅').count()).toBeGreaterThan(0)
  })
})
```

## 🚀 Deployment

### Prerequisites
1. PostgreSQL database
2. Node.js 20+
3. Medusa.js backend
4. Next.js 15 frontend

### Installation

```bash
# Backend migrations
npm run migrations:run

# Seed data
npm run seed

# Start backend
npm run dev

# Start frontend (in storefront/)
cd storefront
npm run dev
```

### Environment Variables

```env
# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/medusa
AI_SERVICE_ENABLED=true

# Frontend (storefront/.env.local)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_ENABLE_VOICE_SEARCH=true
```

## 📱 Mobile Optimization

- Touch-friendly buttons (min 44px)
- Swipe navigation between steps
- Voice input for hands-free operation
- Responsive grid layouts
- Fullscreen results on mobile

## ♿ Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus indicators

## 🌍 Internationalization

All text supports i18n via `next-intl`:

```typescript
// storefront/messages/en.json
{
  "search": {
    "title": "Advanced Parts Search",
    "step1": "Select Machine Type",
    "step2": "Select Manufacturer",
    ...
  }
}

// storefront/messages/pl.json
{
  "search": {
    "title": "Zaawansowane wyszukiwanie części",
    "step1": "Wybierz typ maszyny",
    "step2": "Wybierz producenta",
    ...
  }
}
```

## 📈 Analytics

Track search behavior:
- Query patterns
- Conversion rates
- Drop-off points
- Popular machines
- Common symptoms

## 🔒 Security

- Input sanitization
- SQL injection prevention
- Rate limiting on API endpoints
- CSRF protection
- XSS prevention

## 🎯 Performance

- Database indexes on foreign keys
- Query result caching
- Lazy loading of images
- Code splitting
- API response compression

## 📞 Support

For issues or questions:
- GitHub Issues
- Email: support@example.com
- Documentation: /docs

## 📄 License

MIT License - see LICENSE file for details
