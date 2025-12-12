# Advanced Search System - Quick Start Guide

## 🚀 Installation

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Medusa.js backend
- Next.js 15 frontend

### Step 1: Install Dependencies

```bash
# Backend
npm install

# Frontend
cd storefront
npm install
```

### Step 2: Run Database Migrations

```bash
# Run migrations to create tables
npm run migrations:run

# Seed initial data
npm run seed
```

### Step 3: Configure Environment

```bash
# Backend .env
DATABASE_URL=postgresql://user:pass@localhost:5432/medusa
AI_SERVICE_ENABLED=true

# Frontend storefront/.env.local
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_ENABLE_VOICE_SEARCH=true
```

### Step 4: Start Services

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd storefront
npm run dev
```

### Step 5: Access the System

Open browser: `http://localhost:3000/search`

## 📝 Usage Examples

### Example 1: Natural Language Search

```typescript
// User types: "Hydraulic pump for my CAT 320D"
// AI extracts:
{
  machineType: "excavator",
  manufacturer: "cat",
  model: "cat-320d",
  issue: "Pump problem",
  confidence: 95
}
// Wizard jumps to Step 4 (Issue)
```

### Example 2: Voice Search

```typescript
// User clicks microphone
// Speaks: "I need parts for Komatsu excavator"
// System transcribes and analyzes
// Wizard jumps to Step 2 (Manufacturer)
```

### Example 3: Manual Wizard

```typescript
// User clicks "Use Step-by-Step Wizard"
// Follows 6 steps:
// 1. Select Excavator
// 2. Select CAT
// 3. Select 320D model
// 4. Describe "pump leaking"
// 5. AI suggests Hydraulics category
// 6. View compatible parts
```

## 🧪 Testing

### Run Unit Tests

```bash
npm test
```

### Run Integration Tests

```bash
npm run test:integration
```

### Test API Endpoints

```bash
# Test autocomplete
curl "http://localhost:9000/api/advanced-search?action=autocomplete&query=excavator&step=1"

# Test query analysis
curl -X POST http://localhost:9000/api/advanced-search \
  -H "Content-Type: application/json" \
  -d '{"action":"analyze-query","query":"CAT pump leaking"}'

# Test part suggestions
curl -X POST http://localhost:9000/api/advanced-search \
  -H "Content-Type: application/json" \
  -d '{"action":"suggest-parts","machineModelId":"cat-320d","categoryId":"hydraulics"}'

# Test compatibility validation
curl "http://localhost:9000/api/advanced-search?action=validate-part&machineId=cat-320d&partId=part-123"

# Test recommendations
curl "http://localhost:9000/api/advanced-search?action=recommendations&machineId=cat-320d"
```

## 📊 Adding Custom Data

### Add Machine Type

```sql
INSERT INTO machine_types (id, name, name_pl, emoji, popularity_score)
VALUES ('forklift', 'Forklift', 'Wózek widłowy', '🏭', 85);
```

### Add Manufacturer

```sql
INSERT INTO manufacturers (id, name, machine_type_id, popularity_score, region)
VALUES ('toyota', 'Toyota', 'forklift', 100, 'global');
```

### Add Machine Model

```sql
INSERT INTO machine_models (id, name, manufacturer_id, year_from, year_to, power_hp, weight_kg, specs, popularity_score)
VALUES ('toyota-8fg25', 'Toyota 8FG25', 'toyota', 2010, 2023, 50, 3500, '{"capacity": "2.5t"}', 90);
```

### Add Symptom Mapping

```sql
INSERT INTO symptom_mappings (id, symptom_text, symptom_text_pl, category, subcategory, confidence_score, keywords)
VALUES ('sym-016', 'Forks not lifting', 'Widły się nie podnoszą', 'Hydraulics', 'Lift Cylinders', 95.00, ARRAY['fork', 'lift', 'raise', 'hydraulic']);
```

### Add Compatibility

```sql
INSERT INTO compatibility_matrix (id, product_id, machine_model_id, compatibility_level, confidence_score, is_original, notes)
VALUES ('comp-001', 'prod-123', 'cat-320d', 'perfect', 98.50, true, 'Original CAT part');
```

## 🎨 Customization

### Change Colors

Edit `storefront/tailwind.config.ts`:

```typescript
colors: {
  primary: {
    600: '#your-color',
    700: '#your-darker-color'
  }
}
```

### Add New Step

1. Create component: `storefront/components/search/YourStep.tsx`
2. Add to wizard: `AdvancedSearchSystem.tsx`
3. Update progress bar: `ProgressBar.tsx`

### Customize AI Behavior

Edit `src/services/ai-search.service.ts`:

```typescript
async analyzeSearchQuery(query: string): Promise<QueryAnalysis> {
  // Add your custom AI logic
  // Integrate with OpenAI, Claude, etc.
}
```

## 🐛 Troubleshooting

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
echo $DATABASE_URL
```

### Issue: API returns 404
```bash
# Verify backend is running
curl http://localhost:9000/health

# Check route registration
grep -r "advanced-search" src/api/
```

### Issue: Voice input not working
```bash
# Check browser support
# Chrome/Edge: Supported
# Firefox: Limited support
# Safari: Requires user permission
```

### Issue: No parts found
```bash
# Check compatibility matrix has data
psql -d medusa -c "SELECT COUNT(*) FROM compatibility_matrix;"

# Add test data
npm run seed
```

## 📚 Next Steps

1. **Add More Data**: Populate database with your machinery and parts
2. **Integrate AI**: Connect to OpenAI/Claude for better NLP
3. **Customize UI**: Match your brand colors and style
4. **Add Analytics**: Track user behavior and conversions
5. **Optimize Performance**: Add caching and indexes
6. **Deploy**: Follow deployment guide in DEPLOYMENT.md

## 🆘 Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@example.com

## 📄 License

MIT License - see LICENSE file
