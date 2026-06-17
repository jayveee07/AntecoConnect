#!/bin/sh
set -e

# DuckDNS auto-update script
# Called after Cloud Run deployment to point the domain at the service
#
# Usage: ./update-duckdns.sh <cloud-run-url>
# Example: ./update-duckdns.sh https://anteco-connect-api-xxxxx-run.app
#
# DuckDNS doesn't support CNAME, but we can resolve the Cloud Run IP
# and update the A record. Run this via Cloud Scheduler every 5 min.

CLOUD_RUN_URL="${1}"
DOMAIN="anteconnect"
TOKEN="3abe99b5-b9ac-4293-9eff-c44e649bc62e"

if [ -z "$CLOUD_RUN_URL" ]; then
    echo "Usage: $0 <cloud-run-url>"
    exit 1
fi

# Extract hostname from URL
HOSTNAME=$(echo "$CLOUD_RUN_URL" | sed 's|https://||' | sed 's|/.*||')

# Resolve Cloud Run IP
IP=$(dig +short "$HOSTNAME" | tail -n1)

if [ -z "$IP" ]; then
    echo "Could not resolve IP for $HOSTNAME"
    exit 1
fi

# Update DuckDNS
URL="https://duckdns.org/update?domains=${DOMAIN}&token=${TOKEN}&ip=${IP}"
echo "Updating DuckDNS: ${DOMAIN}.duckdns.org -> ${IP}"

RESPONSE=$(curl -s "$URL")
echo "Response: $RESPONSE"

if [ "$RESPONSE" = "OK" ]; then
    echo "DuckDNS update successful"
    exit 0
else
    echo "DuckDNS update failed"
    exit 1
fi
