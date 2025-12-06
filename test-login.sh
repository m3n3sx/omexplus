#!/bin/bash

PASSWORD='CAnabis123#$'

echo "Testuję logowanie..."
curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"meneswczesny@gmail.com\",\"password\":\"$PASSWORD\"}"
