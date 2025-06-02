#!/bin/bash

echo "🚀 Démarrage du Réseau Littéraire ESME"
echo "======================================"

# Vérifier si les ports sont libres
if lsof -Pi :5009 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 5009 déjà utilisé. Arrêtez le processus avec: kill -9 $(lsof -ti:5009)"
    exit 1
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port 5173 déjà utilisé. Arrêtez le processus avec: kill -9 $(lsof -ti:5173)"
    exit 1
fi

echo "✅ Ports disponibles"

# Démarrer le backend
echo "🔧 Démarrage du backend..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
echo "⏳ Attente du backend..."
sleep 5

# Vérifier que le backend fonctionne
if curl -s http://localhost:5009/api/ > /dev/null; then
    echo "✅ Backend démarré sur http://localhost:5009"
else
    echo "❌ Erreur de démarrage du backend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 Application démarrée avec succès !"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:5009"
echo ""
echo "Pour arrêter l'application, appuyez sur Ctrl+C"

# Fonction pour nettoyer les processus à l'arrêt
cleanup() {
    echo ""
    echo "🛑 Arrêt de l'application..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Application arrêtée"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait 