# AI Assistant Integration Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Run Migrations
```bash
npm run migrations:run
```

### Step 2: Add Widget to Your App
```tsx
// storefront/app/layout.tsx
import { ChatWidget } from '@/components/assistant/ChatWidget'

export default function RootLayout({ children, params: { locale } }) {
  return (
    <html lang={locale}>
      <body>
        {children}
        
        {/* Add chat widget */}
        <ChatWidget 
          customerId={user?.id}
          language={locale}
          position="bottom-right"
        />
      </body>
    </html>
  )
}
```

### Step 3: Test It
```bash
npm run dev
# Visit http://localhost:3000
# Click chat button in bottom-right corner
```

## 📋 Complete Integration Checklist

### Backend Setup
- [x] Run database migrations
- [x] Seed intent mappings and knowledge base
- [x] Verify API endpoints work
- [x] Test intent detection
- [x] Test conversation flow

### Frontend Setup
- [x] Add ChatWidget to layout
- [x] Configure language (en/pl)
- [x] Set customer ID (if logged in)
- [x] Choose position (bottom-right/left)
- [x] Test on mobile devices

### Customization
- [ ] Update knowledge base with your FAQs
- [ ] Add more intent mappings
- [ ] Customize system prompt
- [ ] Add your branding colors
- [ ] Configure escalation contacts

## 🎨 Customization Guide

### 1. Update Knowledge Base

```sql
-- Add your own FAQs
INSERT INTO knowledge_base (id, category, question, answer, keywords, priority) VALUES
('kb-custom-001', 'shipping', 
  'Do you ship internationally?',
  'Yes! We ship worldwide. Delivery times: EU 3-5 days, USA 7-10 days, Rest of world 10-14 days.',
  ARRAY['shipping', 'international', 'worldwide'],
  10);
```

### 2. Add Custom Intents

```sql
-- Add new intent
INSERT INTO intent_mappings (id, intent_name, patterns, keywords, confidence_threshold, action) VALUES
('intent-custom-001', 'BULK_ORDER',
  ARRAY['bulk order', 'large quantity', 'wholesale'],
  ARRAY['bulk', 'wholesale', 'quantity', 'large order'],
  75.00, 'show_bulk_pricing');
```

### 3. Customize System Prompt

Edit `src/services/ai-assistant.service.ts`:

```typescript
private getSystemPrompt(): string {
  return `You are a helpful AI assistant for [YOUR COMPANY NAME].

Your role:
- Help customers find machinery parts
- Answer technical questions
- Provide expert advice
- [Add your specific guidelines]

Your personality:
- [Your brand voice]
- [Your communication style]
`
}
```

### 4. Customize Widget Appearance

Edit `storefront/components/assistant/ChatWidget.tsx`:

```tsx
// Change colors
className="bg-primary-600" // Your brand color

// Change position
position="bottom-left" // or "bottom-right"

// Change size
className="w-96 h-[600px]" // Adjust dimensions
```

### 5. Add Custom Actions

Edit `src/services/ai-assistant.service.ts`:

```typescript
private async determineActions(intent: Intent, entities: any, context: AssistantContext): Promise<any[]> {
  const actions: any[] = []

  switch (intent.name) {
    case 'YOUR_CUSTOM_INTENT':
      actions.push({
        type: 'your_custom_action',
        data: { /* your data */ }
      })
      break
  }

  return actions
}
```

## 🔗 Integration with Advanced Search

The assistant automatically integrates with your advanced search system:

### Auto-Launch Search
When user says: "I need parts for my CAT 320D"
```typescript
// Assistant detects intent and launches search
actions: [{
  type: 'launch_search',
  data: {
    machineModel: 'cat-320d',
    autoFill: true
  }
}]
```

### Pre-Fill Search Fields
```typescript
// In ChatWidget.tsx handleActions()
case 'launch_search':
  const params = new URLSearchParams({
    machineType: action.data.machineType,
    manufacturer: action.data.manufacturer,
    model: action.data.model,
    category: action.data.category
  })
  window.location.href = `/search?${params}`
  break
```

### Add Help Button to Search Steps

```tsx
// In any search step component
import { useState } from 'react'

export function MachineTypeSelector() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div>
      <button 
        onClick={() => setShowHelp(true)}
        className="text-primary-600 hover:text-primary-700"
      >
        ❓ Need help?
      </button>

      {showHelp && (
        <div className="p-4 bg-primary-50 rounded-lg">
          <p>Not sure which machine type? Our AI assistant can help!</p>
          <button onClick={() => {
            // Open chat widget
            window.dispatchEvent(new CustomEvent('openChat', {
              detail: { message: 'Help me choose machine type' }
            }))
          }}>
            Ask Assistant
          </button>
        </div>
      )}
    </div>
  )
}
```

## 📱 Mobile Optimization

The chat widget is fully responsive:

```tsx
// Automatic mobile adjustments
- Smaller width on mobile (90vw)
- Touch-friendly buttons (44px minimum)
- Swipe to close gesture
- Bottom sheet on mobile
- Keyboard-aware positioning
```

To test mobile:
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device
4. Test chat widget
```

## 🌍 Multi-Language Support

### Add New Language

1. **Add translations to messages**:
```json
// storefront/messages/de.json (German)
{
  "assistant": {
    "welcome": "Hallo! Wie kann ich helfen?",
    "typing": "Schreibt...",
    ...
  }
}
```

2. **Update knowledge base**:
```sql
-- Add German translations
UPDATE knowledge_base
SET answer_de = 'German translation here'
WHERE id = 'kb-001';
```

3. **Update quick replies**:
```sql
-- Add German quick replies
UPDATE quick_replies
SET reply_text_de = 'German text'
WHERE id = 'qr-001';
```

## 🔧 Advanced Features

### 1. Voice Input

Add to `ChatInput.tsx`:
```tsx
const handleVoiceInput = () => {
  const recognition = new (window as any).webkitSpeechRecognition()
  recognition.lang = language === 'pl' ? 'pl-PL' : 'en-US'
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    setMessage(transcript)
  }
  recognition.start()
}
```

### 2. Typing Indicators

Already implemented in `ChatWidget.tsx`:
```tsx
{isTyping && (
  <div className="flex gap-1">
    <span className="animate-bounce">●</span>
    <span className="animate-bounce delay-100">●</span>
    <span className="animate-bounce delay-200">●</span>
  </div>
)}
```

### 3. File Attachments

Add to `ChatInput.tsx`:
```tsx
const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('conversationId', conversationId)
  
  const response = await fetch('/api/assistant/upload', {
    method: 'POST',
    body: formData
  })
  
  // Handle uploaded file
}
```

### 4. Rich Messages

Add to `ChatMessage.tsx`:
```tsx
// Support for buttons, cards, carousels
if (message.type === 'card') {
  return (
    <div className="border rounded-lg p-4">
      <img src={message.image} />
      <h3>{message.title}</h3>
      <p>{message.description}</p>
      <button>{message.action}</button>
    </div>
  )
}
```

## 📊 Analytics & Monitoring

### Track Conversations

```typescript
// Already implemented in API
await trackAnalytics(manager, {
  conversationId,
  customerId,
  sessionId,
  eventType: 'message_sent',
  eventData: {
    intent: result.intent.name,
    confidence: result.intent.confidence
  }
})
```

### View Analytics

```sql
-- Most common intents
SELECT intent, COUNT(*) as count
FROM conversation_messages
WHERE role = 'user'
GROUP BY intent
ORDER BY count DESC;

-- Average confidence by intent
SELECT intent, AVG(confidence) as avg_confidence
FROM conversation_messages
WHERE role = 'user' AND intent IS NOT NULL
GROUP BY intent;

-- Escalation rate
SELECT 
  COUNT(CASE WHEN status = 'escalated' THEN 1 END) * 100.0 / COUNT(*) as escalation_rate
FROM conversations;

-- Customer satisfaction (based on helpful votes)
SELECT 
  helpful_count * 100.0 / (helpful_count + not_helpful_count) as satisfaction_rate
FROM knowledge_base;
```

### Dashboard Queries

```sql
-- Daily conversation volume
SELECT 
  DATE(started_at) as date,
  COUNT(*) as conversations,
  AVG(
    (SELECT COUNT(*) FROM conversation_messages 
     WHERE conversation_id = conversations.id)
  ) as avg_messages_per_conversation
FROM conversations
WHERE started_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(started_at)
ORDER BY date DESC;

-- Top customer issues
SELECT 
  cm.intent,
  COUNT(*) as frequency,
  AVG(cm.confidence) as avg_confidence
FROM conversation_messages cm
WHERE cm.role = 'user' 
  AND cm.created_at >= NOW() - INTERVAL '7 days'
GROUP BY cm.intent
ORDER BY frequency DESC
LIMIT 10;
```

## 🐛 Troubleshooting

### Issue: Chat widget not appearing
```bash
# Check if component is imported
grep -r "ChatWidget" storefront/app/

# Check browser console for errors
# Open DevTools → Console

# Verify migrations ran
psql -d medusa -c "SELECT * FROM conversations LIMIT 1;"
```

### Issue: Messages not sending
```bash
# Check API endpoint
curl -X POST http://localhost:9000/api/assistant \
  -H "Content-Type: application/json" \
  -d '{"action":"chat","message":"test","sessionId":"test123","language":"en"}'

# Check backend logs
npm run dev # Watch for errors
```

### Issue: Intent not detected
```sql
-- Check intent mappings
SELECT * FROM intent_mappings;

-- Test pattern matching
SELECT * FROM intent_mappings
WHERE 'my pump is broken' LIKE ANY(patterns);
```

### Issue: Wrong language
```tsx
// Verify language prop
<ChatWidget language={locale} /> // Should be 'en' or 'pl'

// Check conversation language
SELECT language FROM conversations WHERE id = 'your_conv_id';
```

## 🔒 Security Considerations

### 1. Rate Limiting
```typescript
// Add to API route
const rateLimit = new Map()

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now()
  const requests = rateLimit.get(sessionId) || []
  const recentRequests = requests.filter((time: number) => now - time < 60000)
  
  if (recentRequests.length >= 20) {
    return false // Too many requests
  }
  
  recentRequests.push(now)
  rateLimit.set(sessionId, recentRequests)
  return true
}
```

### 2. Input Sanitization
```typescript
// Already implemented
function sanitizeInput(message: string): string {
  return message
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, 1000) // Max length
}
```

### 3. Customer Verification
```typescript
// Verify customer ID matches session
if (customerId && !verifyCustomerSession(customerId, sessionId)) {
  throw new Error('Unauthorized')
}
```

## 🚀 Production Deployment

### 1. Environment Variables
```env
# .env.production
DATABASE_URL=your_production_db
OPENAI_API_KEY=your_api_key (optional)
RATE_LIMIT_MAX=20
RATE_LIMIT_WINDOW=60000
```

### 2. Performance Optimization
```typescript
// Add caching for knowledge base
const knowledgeCache = new Map()

async function getKnowledgeBase() {
  if (knowledgeCache.has('kb')) {
    return knowledgeCache.get('kb')
  }
  
  const kb = await manager.query('SELECT * FROM knowledge_base')
  knowledgeCache.set('kb', kb)
  setTimeout(() => knowledgeCache.delete('kb'), 3600000) // 1 hour
  
  return kb
}
```

### 3. Monitoring
```typescript
// Add error tracking
try {
  await processMessage(message, context)
} catch (error) {
  // Log to monitoring service
  console.error('Assistant error:', error)
  
  // Track in database
  await trackError(error, conversationId)
  
  // Return user-friendly message
  return {
    response: 'Sorry, something went wrong. Please try again.',
    intent: { name: 'ERROR', confidence: 0 }
  }
}
```

## 📚 Additional Resources

- **API Documentation**: See `src/api/assistant/route.ts`
- **Service Logic**: See `src/services/ai-assistant.service.ts`
- **Component Examples**: See `storefront/components/assistant/`
- **Database Schema**: See `src/migrations/1733650000000-*.ts`

## 🆘 Support

- **Issues**: Create GitHub issue
- **Questions**: support@example.com
- **Documentation**: `/docs` folder

---

**Built with ❤️ for B2B machinery parts businesses**
