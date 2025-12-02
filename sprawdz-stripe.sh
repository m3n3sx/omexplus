#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║        SPRAWDZANIE KONFIGURACJI STRIPE                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Sprawdź klucze w .env
echo "1. Sprawdzanie kluczy backend (.env)..."
if grep -q "sk_test_51" .env || grep -q "sk_live_" .env; then
    echo "   ✅ STRIPE_SECRET_KEY skonfigurowany"
else
    echo "   ❌ STRIPE_SECRET_KEY nie skonfigurowany"
    echo "      Dodaj prawdziwy klucz do .env"
fi

if grep -q "pk_test_51" .env || grep -q "pk_live_" .env; then
    echo "   ✅ STRIPE_PUBLISHABLE_KEY skonfigurowany"
else
    echo "   ❌ STRIPE_PUBLISHABLE_KEY nie skonfigurowany"
    echo "      Dodaj prawdziwy klucz do .env"
fi

echo ""

# Sprawdź klucze frontend
echo "2. Sprawdzanie kluczy frontend (storefront/.env.local)..."
if [ -f storefront/.env.local ]; then
    if grep -q "pk_test_51" storefront/.env.local || grep -q "pk_live_" storefront/.env.local; then
        echo "   ✅ Frontend klucz skonfigurowany"
    else
        echo "   ❌ Frontend klucz nie skonfigurowany"
        echo "      Dodaj NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY do storefront/.env.local"
    fi
else
    echo "   ❌ Plik storefront/.env.local nie istnieje"
fi

echo ""

# Sprawdź zależności
echo "3. Sprawdzanie zależności..."
if grep -q '"stripe"' package.json; then
    echo "   ✅ Stripe package w package.json"
else
    echo "   ❌ Brak Stripe w package.json"
fi

if [ -d "node_modules/stripe" ]; then
    echo "   ✅ Stripe zainstalowany w node_modules"
else
    echo "   ⚠️  Stripe nie zainstalowany - uruchom: npm install"
fi

echo ""

# Sprawdź pliki
echo "4. Sprawdzanie plików implementacji..."
FILES=(
    "src/services/payment-service.ts"
    "src/plugins/stripe/index.ts"
    "src/api/store/checkout/payment/intent/route.ts"
    "storefront/components/PaymentForm.tsx"
    "storefront/hooks/usePayment.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file - brak pliku"
    fi
done

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                    PODSUMOWANIE                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Sprawdź czy wszystko gotowe
if grep -q "sk_test_51" .env && grep -q "pk_test_51" .env && [ -f storefront/.env.local ]; then
    echo "✅ Konfiguracja wygląda dobrze!"
    echo ""
    echo "Następne kroki:"
    echo "1. Zainstaluj zależności: npm install"
    echo "2. Przetestuj: npx ts-node src/scripts/test-stripe-payment.ts"
    echo "3. Uruchom backend: npm run dev"
    echo "4. Uruchom frontend: cd storefront && npm run dev"
else
    echo "⚠️  Konfiguracja niekompletna"
    echo ""
    echo "Co zrobić:"
    echo "1. Pobierz klucze: https://dashboard.stripe.com/test/apikeys"
    echo "2. Dodaj do .env:"
    echo "   STRIPE_SECRET_KEY=sk_test_51..."
    echo "   STRIPE_PUBLISHABLE_KEY=pk_test_51..."
    echo "3. Dodaj do storefront/.env.local:"
    echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51..."
    echo ""
    echo "📖 Przeczytaj: URUCHOM_STRIPE.md"
fi

echo ""
