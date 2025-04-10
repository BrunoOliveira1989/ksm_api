#!/bin/bash

APP_NAME="ksm_api"
CONTAINER_NAME="ksm_api"
PORT=3333

echo "🔍 Verificando se o container '$CONTAINER_NAME' está rodando..."
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "🛑 Parando container existente..."
  docker stop $CONTAINER_NAME
fi

echo "🗑️ Removendo container antigo (se existir)..."
docker rm -f $CONTAINER_NAME 2>/dev/null

echo "🧼 Removendo imagem antiga (se existir)..."
docker rmi -f $APP_NAME 2>/dev/null

echo "🏗️ Construindo nova imagem Docker..."
docker build -t $APP_NAME .

if [ $? -ne 0 ]; then
  echo "❌ Erro ao construir a imagem. Abortando o deploy."
  exit 1
fi

echo "🚀 Iniciando novo container '$CONTAINER_NAME'..."
docker run -d \
  --name $CONTAINER_NAME \
  -p $PORT:$PORT \
  $APP_NAME

echo "✅ Deploy completo! Container '$CONTAINER_NAME' rodando na porta $PORT."