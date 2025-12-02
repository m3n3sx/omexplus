#!/bin/bash

clear

echo "╔══════════════════════════════════════════════════════════╗"
echo "║         STRIPE PAYMENT - OMEX B2B E-COMMERCE             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Sprawdź konfigurację
echo "🔍 Sprawdzanie konfiguracji..."
echo ""

HAS_BACKEND_KEY=false
HAS_FRONTEND_KEY=false

if grep -q "sk_test_51" .env || grep -q "sk_live_" .env; then
    HAS_BACKEND_KEY=true
fi

if [ -f storefront/.env.local ]; then
    if grep -q "pk_test_51" storefront/.env.local || grep -q "pk_live_" storefront/.env.local; then
        HAS_FRONTEND_KEY=true
    fi
fi

if [ "$HAS_BACKEND_KEY" = true ] && [ "$HAS_FRONTEND_KEY" = true ]; then
    echo "✅ Konfiguracja OK!"
    echo ""
    echo "🚀 Uruchamianie..."
    echo ""
    echo "📖 Dokumentacja:"
    echo "   - START_TUTAJ.md - Szybki start"
    echo "   - URUCHOM_STRIPE.md - Instrukcja PL"
    echo "   - README_STRIPE_PAYMENT.md - Pełna dokumentacja"
    echo ""
    echo "🧪 Karty testowe:"
    echo "   Sukces: 4242 4242 4242 4242"
    echo "   3D Secure: 4000 0025 0000 3155"
    echo "   Odrzucona: 4000 0000 0000 0002"
    echo ""
    echo "🌐 Po uruchomieniu otwórz:"
    echo "   http://localhost:3000/checkout/payment"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Uruchamianie backend (Medusa)..."
    npm run dev
else
    echo "⚠️  KONFIGURACJA NIEKOMPLETNA"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    if [ "$HAS_BACKEND_KEY" = false ]; then
        echo "❌ Brak kluczy backend w .env"
        echo ""
        echo "Co zrobić:"
        echo "1. Przejdź do: https://dashboard.stripe.com/test/apikeys"
        echo "2. Skopiuj klucze"
        echo "3. Edytuj plik .env i dodaj:"
        echo ""
        echo "   STRIPE_SECRET_KEY=sk_test_51..."
        echo "   STRIPE_PUBLISHABLE_KEY=pk_test_51..."
        echo ""
    fi
    
    if [ "$HAS_FRONTEND_KEY" = false ]; then
        echo "❌ Brak klucza frontend w storefront/.env.local"
        echo ""
        echo "Co zrobić:"
        echo "1. Edytuj plik storefront/.env.local"
        echo "2. Dodaj linię:"
        echo ""
        echo "   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51..."
        echo ""
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📖 Przeczytaj szczegółową instrukcję:"
    echo "   cat START_TUTAJ.md"
    echo ""
    echo "🔍 Sprawdź status konfiguracji:"
    echo "   bash sprawdz-stripe.sh"
    echo ""
    exit 1
fi
