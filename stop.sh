#!/bin/bash

echo "🛑 Arrêt du Réseau Littéraire ESME"
echo "=================================="

# Arrêter les processus sur le port 5009 (backend)
BACKEND_PIDS=$(lsof -ti:5009)
if [ ! -z "$BACKEND_PIDS" ]; then
    echo "🔧 Arrêt du backend (port 5009)..."
    kill -9 $BACKEND_PIDS
    echo "✅ Backend arrêté"
else
    echo "ℹ️  Aucun processus backend trouvé"
fi

# Arrêter les processus sur le port 5173 (frontend)
FRONTEND_PIDS=$(lsof -ti:5173)
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "🎨 Arrêt du frontend (port 5173)..."
    kill -9 $FRONTEND_PIDS
    echo "✅ Frontend arrêté"
else
    echo "ℹ️  Aucun processus frontend trouvé"
fi

echo ""
echo "✅ Tous les services ont été arrêtés"
echo "🎉 Vous pouvez maintenant relancer l'application avec ./start.sh" 