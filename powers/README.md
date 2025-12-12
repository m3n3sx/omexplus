# Medusa E-commerce Powers

Kompletny zestaw narzędzi (Kiro Powers) do pracy z Medusa.js i Next.js storefront.

## 📦 Dostępne Powers

### 1. **Medusa Best Practices** 
`medusa-best-practices`

Podstawowe best practices dla rozwoju aplikacji e-commerce z Medusą.

**Zawiera:**
- Core principles (API-First, Database Optimization, Frontend Performance)
- Common patterns (Custom endpoints, Image loading)
- Best practices checklist
- Troubleshooting guide

**Kiedy używać:** Przy rozpoczynaniu nowego projektu lub code review

---

### 2. **Medusa Development Workflow**
`medusa-development-workflow`

Kompletny workflow dla codziennej pracy z Medusą.

**Zawiera:**
- Tworzenie migracji bazy danych
- Custom API endpoints
- Seedowanie danych testowych
- Debugging i logi
- Praca z PostgreSQL
- Testowanie integracji
- Hot reload i development

**Kiedy używać:** Codziennie podczas developmentu

---

### 3. **Medusa Deployment**
`medusa-deployment`

Przewodnik po deploymencie na production.

**Zawiera:**
- Deployment backendu na VPS
- Deployment frontendu na Netlify
- Konfiguracja SSL (Certbot)
- Continuous Deployment (GitHub Actions)
- Monitoring i logi (PM2, Nginx)
- Backup strategy
- Rollback procedures

**Kiedy używać:** Przy deploymencie i maintenance production

---

### 4. **Medusa Troubleshooting**
`medusa-troubleshooting`

Rozwiązywanie typowych problemów.

**Zawiera:**
- Błędy startowe
- Problemy z bazą danych
- Błędy API
- Problemy CORS
- Stripe issues
- Performance problems
- Migracje
- Frontend issues

**Kiedy używać:** Gdy coś nie działa i potrzebujesz szybkiego rozwiązania

---

### 5. **Storefront Optimization**
`storefront-optimization`

Optymalizacja Next.js storefront.

**Zawiera:**
- Optymalizacja obrazów (next/image)
- Performance optimization (code splitting, memoization)
- Caching strategies (ISR, client-side)
- SEO optimization (metadata, structured data, sitemap)
- Loading states & skeletons
- Font optimization
- Web Vitals monitoring

**Kiedy używać:** Przy optymalizacji performance i SEO

---

### 6. **Medusa API Reference**
`medusa-api-reference`

Szybki przewodnik po Medusa Store API.

**Zawiera:**
- Products API
- Cart API
- Checkout API
- Payment API
- Customer API
- Orders API
- TypeScript types
- Frontend integration examples

**Kiedy używać:** Jako quick reference podczas kodowania

---

## 🚀 Instalacja

### Opcja 1: Local Directory (Zalecane dla developmentu)

1. Otwórz Kiro Powers panel (Ctrl/Cmd + Shift + P → "Configure Powers")
2. Kliknij "Available Powers" → "Manage Repos" → "Add Repository"
3. Wybierz "Local Directory"
4. Podaj ścieżkę: `/home/ooxo/my-medusa-store/powers`
5. Zainstaluj wybrane powers

### Opcja 2: Git Repository (Dla zespołu)

```bash
# 1. Utwórz repo na GitHub
git init
git add powers/
git commit -m "Add Medusa powers"
git remote add origin https://github.com/your-username/medusa-powers.git
git push -u origin main

# 2. W Kiro Powers panel:
# - Add Repository → Git Repository
# - Podaj URL: https://github.com/your-username/medusa-powers.git
```

## 📖 Jak Używać

Po zainstalowaniu, powers będą automatycznie aktywowane gdy:
- Zadasz pytanie związane z keywords (np. "jak zrobić migrację?" → aktywuje development-workflow)
- Bezpośrednio poprosisz o pomoc (np. "pomóż mi z deploymentem")

**Przykłady:**
```
"Jak stworzyć nową migrację w Medusa?"
→ Aktywuje: medusa-development-workflow

"Mam błąd CORS, jak to naprawić?"
→ Aktywuje: medusa-troubleshooting

"Jak zoptymalizować obrazy w Next.js?"
→ Aktywuje: storefront-optimization

"Jak dodać produkt do koszyka przez API?"
→ Aktywuje: medusa-api-reference
```

## 🎯 Workflow Recommendations

### Dla Nowych Projektów
1. **medusa-best-practices** - Zacznij tutaj
2. **medusa-development-workflow** - Setup środowiska
3. **medusa-api-reference** - Podczas kodowania

### Dla Istniejących Projektów
1. **medusa-development-workflow** - Codzienna praca
2. **medusa-troubleshooting** - Gdy coś nie działa
3. **storefront-optimization** - Przed production

### Przed Deploymentem
1. **storefront-optimization** - Optymalizacja
2. **medusa-deployment** - Deployment guide
3. **medusa-troubleshooting** - Na wszelki wypadek

## 🔧 Maintenance

### Aktualizacja Powers

```bash
# Jeśli używasz local directory:
cd /home/ooxo/my-medusa-store/powers
git pull  # Jeśli w repo

# W Kiro:
# Powers panel → Installed Powers → Refresh
```

### Dodawanie Własnych Powers

```bash
# 1. Utwórz nowy katalog
mkdir powers/my-custom-power

# 2. Utwórz POWER.md
cat > powers/my-custom-power/POWER.md << 'EOF'
---
name: "my-custom-power"
displayName: "My Custom Power"
description: "Description of what this power does"
keywords: ["keyword1", "keyword2"]
author: "Your Name"
---

# My Custom Power

## Overview
...
EOF

# 3. Power będzie automatycznie wykryty
```

## 📝 Struktura Power

Każdy power zawiera:

```
power-name/
└── POWER.md          # Główna dokumentacja z frontmatter
```

**Frontmatter format:**
```yaml
---
name: "power-name"              # Lowercase kebab-case
displayName: "Human Name"       # Display name
description: "Clear description" # Max 3 sentences
keywords: ["key1", "key2"]      # Search keywords
author: "Author Name"           # Creator
---
```

## 🤝 Contributing

Masz pomysł na nowy power? Dodaj go!

1. Stwórz nowy katalog w `powers/`
2. Dodaj `POWER.md` z odpowiednim frontmatter
3. Commit i push (jeśli używasz repo)
4. Podziel się z zespołem!

## 📚 Dodatkowe Zasoby

- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Kiro Powers Documentation](https://kiro.dev/docs/powers)

---

**Wersja:** 1.0.0  
**Ostatnia aktualizacja:** 2024-12-11  
**Kompatybilność:** Medusa 1.x/2.x, Next.js 15
