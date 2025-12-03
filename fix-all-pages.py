#!/usr/bin/env python3
"""
Skrypt do usuwania starych importów Header/Footer ze wszystkich stron
"""

import re
from pathlib import Path

# Lista plików do naprawienia
files = [
    "storefront/app/[locale]/orders/[id]/page.tsx",
    "storefront/app/[locale]/order-success/page.tsx",
    "storefront/app/[locale]/o-nas/page.tsx",
    "storefront/app/[locale]/kontakt/page.tsx",
    "storefront/app/[locale]/faq/page.tsx",
    "storefront/app/[locale]/logowanie/page.tsx",
    "storefront/app/[locale]/orders/page.tsx",
    "storefront/app/[locale]/rejestracja/page.tsx",
    "storefront/app/[locale]/checkout/page.tsx",
    "storefront/app/[locale]/products/page.tsx",
    "storefront/app/[locale]/products/[id]/page.tsx",
]

def fix_file(filepath):
    """Usuwa stare importy i użycia Header/Footer"""
    path = Path(filepath)
    
    if not path.exists():
        print(f"⚠️  Plik nie istnieje: {filepath}")
        return False
    
    content = path.read_text()
    original = content
    
    # Usuń importy
    content = re.sub(r"import Header from '@/components/Header'\n?", "", content)
    content = re.sub(r"import Footer from '@/components/Footer'\n?", "", content)
    
    # Usuń użycia w JSX
    content = re.sub(r"\s*<Header />\s*\n?", "\n", content)
    content = re.sub(r"\s*<Footer />\s*\n?", "\n", content)
    
    if content != original:
        path.write_text(content)
        print(f"✅ Naprawiono: {filepath}")
        return True
    else:
        print(f"ℹ️  Bez zmian: {filepath}")
        return False

def main():
    print("🔧 Naprawianie wszystkich stron...")
    print("")
    
    fixed = 0
    for filepath in files:
        if fix_file(filepath):
            fixed += 1
    
    print("")
    print(f"🎉 Gotowe! Naprawiono {fixed} plików.")
    print("")
    print("Teraz uruchom:")
    print("cd storefront && ./restart.sh")

if __name__ == "__main__":
    main()
