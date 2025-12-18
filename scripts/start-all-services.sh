#!/bin/bash

# Skrypt uruchamiający wszystkie serwisy OOXO.pl
# Backend, Storefront, Admin Dashboard

PROJECT_DIR="/www/wwwroot/ooxo.pl"
LOG_DIR="/tmp"

echo "🚀 Starting all OOXO services..."

# Kolory
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Zatrzymaj stare procesy
echo -e "${YELLOW}Stopping old processes...${NC}"
sudo pkill -f 'medusa start' 2>/dev/null || true
sudo pkill -f 'next.*3000' 2>/dev/null || true
sudo pkill -f 'next.*7001' 2>/dev/null || true
sleep 3

# 2. Uruchom Backend (port 9000)
echo -e "${YELLOW}Starting Backend on port 9000...${NC}"
cd $PROJECT_DIR
sudo -u www bash -c "NODE_ENV=production nohup node node_modules/.bin/medusa start > $LOG_DIR/ooxo-backend.log 2>&1 &"
sleep 5

# 3. Uruchom Storefront (port 3000)
echo -e "${YELLOW}Starting Storefront on port 3000...${NC}"
cd $PROJECT_DIR/storefront
sudo -u www bash -c "nohup npm run start > $LOG_DIR/ooxo-storefront.log 2>&1 &"
sleep 5

# 4. Zbuduj Admin Dashboard (jeśli potrzeba)
echo -e "${YELLOW}Checking Admin Dashboard build...${NC}"
cd $PROJECT_DIR/admin-dashboard
if [ ! -f ".next/BUILD_ID" ]; then
    echo -e "${YELLOW}Building Admin Dashboard...${NC}"
    npm run build > $LOG_DIR/ooxo-admin-build.log 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Admin build failed! Check $LOG_DIR/ooxo-admin-build.log${NC}"
    else
        echo -e "${GREEN}✓ Admin built successfully${NC}"
    fi
fi

# 5. Uruchom Admin Dashboard (port 7001)
echo -e "${YELLOW}Starting Admin Dashboard on port 7001...${NC}"
cd $PROJECT_DIR/admin-dashboard
sudo -u www bash -c "PORT=7001 nohup npm run start > $LOG_DIR/ooxo-admin.log 2>&1 &"
sleep 5

# 6. Sprawdź status
echo -e "\n${YELLOW}Checking services...${NC}"
sleep 3

if netstat -tlnp 2>/dev/null | grep -q ":9000"; then
    echo -e "${GREEN}✓${NC} Backend running on port 9000"
else
    echo -e "${RED}✗${NC} Backend NOT running"
    echo "Last 10 lines of log:"
    tail -10 $LOG_DIR/ooxo-backend.log
fi

if netstat -tlnp 2>/dev/null | grep -q ":3000"; then
    echo -e "${GREEN}✓${NC} Storefront running on port 3000"
else
    echo -e "${RED}✗${NC} Storefront NOT running"
    echo "Last 10 lines of log:"
    tail -10 $LOG_DIR/ooxo-storefront.log
fi

if netstat -tlnp 2>/dev/null | grep -q ":7001"; then
    echo -e "${GREEN}✓${NC} Admin Dashboard running on port 7001"
else
    echo -e "${RED}✗${NC} Admin Dashboard NOT running"
    echo "Last 10 lines of log:"
    tail -10 $LOG_DIR/ooxo-admin.log
fi

echo -e "\n${GREEN}✓ Script completed!${NC}"
echo -e "\nAccess:"
echo -e "  • Storefront:  ${GREEN}https://ooxo.pl${NC}"
echo -e "  • Admin:       ${GREEN}https://ooxo.pl:7001${NC} (or configure nginx)"
echo -e "  • API:         ${GREEN}https://ooxo.pl/api${NC}"

echo -e "\nLogs:"
echo -e "  tail -f $LOG_DIR/ooxo-backend.log"
echo -e "  tail -f $LOG_DIR/ooxo-storefront.log"
echo -e "  tail -f $LOG_DIR/ooxo-admin.log"

echo -e "\nProcesses:"
ps aux | grep -E 'medusa|next' | grep -v grep
