#!/bin/bash

# DevTeam Delegate Tool
# Allows Kiro to delegate tasks to DevTeamSwarm

PROMPT="$1"

if [ -z "$PROMPT" ]; then
    echo "❌ Error: No prompt provided"
    echo "Usage: devteam-delegate.sh 'Your task here'"
    exit 1
fi

# Check if dev server is running
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "⚠️ DevTeamSwarm server is not running"
    echo "Starting server in background..."
    cd DevTeamSwarm
    nohup agentcore dev > /tmp/devteam.log 2>&1 &
    echo $! > /tmp/devteam.pid
    sleep 5
    cd ..
fi

# Invoke the team
echo "🚀 Delegating to DevTeamSwarm: $PROMPT"
echo ""

cd DevTeamSwarm
agentcore invoke --dev "{\"prompt\": \"$PROMPT\"}"
cd ..
