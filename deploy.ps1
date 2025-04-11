# Configurações
$AppName = "ksm_api"
$ContainerName = "ksm_api"
$Port = 3333

Write-Host "🔍 Verificando se o container '$ContainerName' está rodando..."
$running = docker ps -q -f "name=$ContainerName"
if ($running) {
    Write-Host "🛑 Parando container em execução..."
    docker stop $ContainerName | Out-Null
}

Write-Host "🗑️ Removendo container antigo (se existir)..."
docker rm -f $ContainerName 2>$null

Write-Host "🧼 Removendo imagem antiga (se existir)..."
docker rmi -f $AppName 2>$null

Write-Host "🏗️ Construindo nova imagem Docker..."
docker build -t $AppName .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao construir a imagem. Abortando o deploy."
    exit 1
}

Write-Host "🚀 Iniciando novo container '$ContainerName'..."
docker run -d `
  --name $ContainerName `
  -p ${Port}:${Port} `
  $AppName

Write-Host "✅ Deploy finalizado! Container '$ContainerName' rodando na porta $Port."