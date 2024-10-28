#!/bin/bash

CSV_FILE="test.csv"
ENDPOINT_URL="https://ens-phot-devreg.rd.tuni.fi/api/devices/"

json_array=$(cat "$CSV_FILE" | python -c 'import csv, json, sys; print(json.dumps([dict(r) for r in csv.DictReader(sys.stdin, delimiter=";")]))')
echo "$json_array"
curl -X POST "$ENDPOINT_URL" -H "Content-Type: application/json" -d "$json_array"
echo "Devices posted to $ENDPOINT_URL"
