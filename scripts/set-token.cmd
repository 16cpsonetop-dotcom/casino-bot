@echo off
set /p token=Enter DISCORD_TOKEN: 
echo DISCORD_TOKEN=%token%> .env
echo .env written. Do NOT commit this file.
