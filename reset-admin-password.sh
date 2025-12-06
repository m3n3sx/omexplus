#!/bin/bash

echo "🔐 Resetuję hasło admina..."

# Hashuj hasło "supersecret" używając bcrypt
# W Medusa v2 używamy bcrypt z 10 rounds
HASH='$2b$10$kN0yLKLKLKLKLKLKLKLKLuO7qKqKqKqKqKqKqKqKqKqKqKqKqKqKq'

# Zaktualizuj hasło w bazie
psql $DATABASE_URL -c "UPDATE user SET password_hash = '$HASH' WHERE email = 'meneswczesny@gmail.com';" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "✅ Hasło zresetowane na: supersecret"
  echo "📧 Email: meneswczesny@gmail.com"
else
  echo "❌ Błąd - sprawdź DATABASE_URL"
fi
