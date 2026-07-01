#!/usr/bin/env bash
echo "Enter your DISCORD_TOKEN (input hidden):"
read -s token
echo
envfile=".env"
if [ -f "$envfile" ]; then
  # remove existing DISCORD_TOKEN line
  grep -v '^DISCORD_TOKEN=' "$envfile" > "$envfile.tmp" || true
  echo "DISCORD_TOKEN=$token" >> "$envfile.tmp"
  mv "$envfile.tmp" "$envfile"
else
  echo "DISCORD_TOKEN=$token" > "$envfile"
fi
chmod 600 "$envfile" 2>/dev/null || true
echo ".env written. Do NOT commit this file."
