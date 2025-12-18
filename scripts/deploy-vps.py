#!/usr/bin/env python3
import subprocess
import time
import sys

def run_ssh(cmd):
    """Uruchom komendę przez SSH"""
    full_cmd = f'ssh vps "{cmd}"'
    result = subprocess.run(full_cmd, shell=True, capture_output=True, text=True)
    return result.stdout + result.stderr

def check_port(port):
    """Sprawdź czy port jest otwarty"""
    output = run_ssh(f"ss -tlnp | grep :{port} || echo 'NOT_FOUND'")
    return "NOT_FOUND" not in output

print("🚀 Uruchamianie serwisów OOXO.pl na VPS...")

# 1. Zatrzymaj stare procesy
print("\n1️⃣ Zatrzymywanie starych procesów...")
run_ssh("pkill -f medusa; pkill -f next; sleep 2")
print("✓ Zatrzymano")

# 2. Uruchom Backend
print("\n2️⃣ Uruchamianie Backend (port 9000)...")
run_ssh("cd /www/wwwroot/ooxo.pl && sudo -u www bash -c 'NODE_ENV=production nohup node node_modules/.bin/medusa start > /tmp/backend.log 2>&1 &'")
time.sleep(8)

if check_port(9000):
    print("✅ Backend działa na porcie 9000")
else:
    print("❌ Backend nie działa - sprawdź /tmp/backend.log")
    print(run_ssh("tail -10 /tmp/backend.log"))

# 3. Uruchom Storefront
print("\n3️⃣ Uruchamianie Storefront (port 3000)...")
run_ssh("cd /www/wwwroot/ooxo.pl/storefront && sudo -u www bash -c 'nohup npm run start > /tmp/storefront.log 2>&1 &'")
time.sleep(8)

if check_port(3000):
    print("✅ Storefront działa na porcie 3000")
else:
    print("❌ Storefront nie działa - sprawdź /tmp/storefront.log")
    print(run_ssh("tail -10 /tmp/storefront.log"))

# 4. Uruchom Admin Dashboard (dev mode)
print("\n4️⃣ Uruchamianie Admin Dashboard (port 7001)...")
run_ssh("cd /www/wwwroot/ooxo.pl/admin-dashboard && sudo -u www bash -c 'PORT=7001 nohup npm run dev > /tmp/admin.log 2>&1 &'")
time.sleep(10)

if check_port(7001):
    print("✅ Admin Dashboard działa na porcie 7001")
else:
    print("❌ Admin Dashboard nie działa - sprawdź /tmp/admin.log")
    print(run_ssh("tail -10 /tmp/admin.log"))

# 5. Podsumowanie
print("\n" + "="*50)
print("📊 PODSUMOWANIE")
print("="*50)

services = [
    ("Backend", 9000, "https://ooxo.pl/api"),
    ("Storefront", 3000, "https://ooxo.pl"),
    ("Admin Dashboard", 7001, "http://IP:7001")
]

for name, port, url in services:
    status = "✅ DZIAŁA" if check_port(port) else "❌ NIE DZIAŁA"
    print(f"{name:20} Port {port:5} {status:15} {url}")

print("\n📝 Logi:")
print("  tail -f /tmp/backend.log")
print("  tail -f /tmp/storefront.log")
print("  tail -f /tmp/admin.log")

print("\n✅ Gotowe!")
