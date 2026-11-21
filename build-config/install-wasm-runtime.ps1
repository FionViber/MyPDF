param(
  [Parameter(Mandatory = $true)]
  [string] $SourceRoot,
  [string] $DestinationRoot = (Join-Path $PSScriptRoot '..\wasm')
)

$ErrorActionPreference = 'Stop'
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding

$source = [IO.Path]::GetFullPath($SourceRoot)
$destination = [IO.Path]::GetFullPath($DestinationRoot)
if (-not (Test-Path -LiteralPath (Join-Path $source 'manifest.json'))) {
  throw 'SourceRoot must contain the prepared runtime manifest.'
}

New-Item -ItemType Directory -Force -Path $destination | Out-Null
foreach ($name in @('gs', 'pymupdf', 'coherentpdf', 'licenses')) {
  $target = Join-Path $destination $name
  if (Test-Path -LiteralPath $target) {
    Remove-Item -LiteralPath $target -Recurse -Force
  }
  Copy-Item -LiteralPath (Join-Path $source $name) -Destination $target -Recurse
}
Get-ChildItem -LiteralPath $destination -Recurse -File -Filter '*.tgz' |
  Remove-Item -Force
Copy-Item -LiteralPath (Join-Path $source 'manifest.json') -Destination $destination -Force
Write-Output "Installed runtime assets from $source to $destination"
