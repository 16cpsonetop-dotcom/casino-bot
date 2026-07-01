Write-Host 'Enter your DISCORD_TOKEN (input hidden):'
$secure = Read-Host -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$token = [Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

$envFile = Join-Path -Path (Get-Location) -ChildPath '.env'
$content = "DISCORD_TOKEN=$token`n"
if (Test-Path $envFile) {
  $existing = Get-Content $envFile | Where-Object { $_ -notmatch '^DISCORD_TOKEN=' }
  $content = $existing -join "`n" + "`n" + $content
}

Set-Content -Path $envFile -Value $content -NoNewline
Write-Host '.env written. Do NOT commit this file.' -ForegroundColor Green
