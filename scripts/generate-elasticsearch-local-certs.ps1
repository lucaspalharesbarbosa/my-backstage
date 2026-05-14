# Gera par PEM (http.key / http.crt) para TLS local do Elasticsearch 7.
# Requisito: openssl no PATH (Git for Windows, Chocolatey openssl, etc.).
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$certsDir = Join-Path $repoRoot "docker\elasticsearch\certs"

New-Item -ItemType Directory -Force -Path $certsDir | Out-Null

$key = Join-Path $certsDir "http.key"
$crt = Join-Path $certsDir "http.crt"

if ((Test-Path $key) -or (Test-Path $crt)) {
  Write-Host "Já existem http.key/http.crt em $certsDir"
  Write-Host "Apague-os manualmente se quiser regerar."
  exit 0
}

$opensslExe = $null
$cmd = Get-Command openssl -ErrorAction SilentlyContinue
if ($cmd) { $opensslExe = $cmd.Source }
if (-not $opensslExe) {
  $candidates = @(
    "C:\Program Files\Git\usr\bin\openssl.exe",
    "C:\Program Files (x86)\Git\usr\bin\openssl.exe"
  )
  foreach ($p in $candidates) {
    if (Test-Path $p) { $opensslExe = $p; break }
  }
}
if (-not $opensslExe) {
  Write-Error "openssl nao encontrado. Adicione OpenSSL ao PATH ou instale Git for Windows (inclui openssl)."
}

# SAN cobre acesso pelo host (localhost/127.0.0.1) e pelo hostname do compose (elasticsearch).
& $opensslExe req -x509 -nodes -days 3650 -newkey rsa:2048 `
  -keyout $key -out $crt `
  -subj "/CN=localhost" `
  -addext "subjectAltName=DNS:localhost,DNS:elasticsearch,IP:127.0.0.1"

Write-Host "Gerado:"
Write-Host "  $key"
Write-Host "  $crt"
Write-Host "Use http.crt no curl (--cacert) e no app-config do Backstage (tls.caFile)."
