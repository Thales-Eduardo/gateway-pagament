#!/bin/bash

URL="http://localhost:3334/payment"

i=1
while [ $i -le 5 ]; do
  echo UUID=$(uuidgen)

  JSON=$(cat <<EOF
{
  "produto": {
    "product_id": "01JZ5VX50DYEGCF55ZZ9KZ9SQA",
    "user_id": "$UUID",
    "price": 50.00,
    "quantity": 1,
    "total_price": 50.00
  },
  "card": {
    "card_number": "4111111111111111",
    "card_exp_month": "03",
    "card_exp_year": "2026",
    "card_security_code": "123"
  }
}
EOF
)

  echo "Enviando requisição $i:"
  echo "UUID=$UUID"
  curl -X POST "$URL" \
    -H "Content-Type: application/json" \
    -d "$JSON" \
    -s -o /dev/null -w "HTTP Status: %{http_code}, Tamanho Resposta: %{size_download} bytes\n"
  
  echo "----------------------------------"
  
  i=$((i+1))
done