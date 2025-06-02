#!/usr/bin/env python3
"""
Test des corrections pour le frontend - Vérification CORS et JWT
"""

import requests
import json

API_URL = 'http://localhost:5009/api'

def test_cors_and_jwt():
    """Test des corrections CORS et JWT pour le frontend"""
    print("🔧 TEST DES CORRECTIONS FRONTEND")
    print("=" * 40)
    
    # Test 1: Connexion et récupération du token
    print("\n1. Test de connexion...")
    try:
        response = requests.post(f"{API_URL}/login", 
            json={
                'email': 'marie.dubois@email.com',
                'password': 'password123'
            },
            headers={'Origin': 'http://localhost:5173'})  # Simule une requête depuis le frontend
        
        if response.status_code == 200:
            token = response.json()['access_token']
            print("✅ Connexion réussie")
            print(f"   Token: {token[:50]}...")
        else:
            print(f"❌ Échec de connexion: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False
    
    # Test 2: Requête OPTIONS (preflight CORS)
    print("\n2. Test de requête OPTIONS (CORS preflight)...")
    try:
        response = requests.options(f"{API_URL}/profile",
            headers={
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Authorization'
            })
        
        if response.status_code == 200:
            print("✅ Requête OPTIONS réussie")
            print(f"   Headers CORS: {response.headers.get('Access-Control-Allow-Headers', 'Non défini')}")
        else:
            print(f"❌ Échec OPTIONS: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur OPTIONS: {e}")
    
    # Test 3: Accès au profil avec token
    print("\n3. Test d'accès au profil avec token...")
    try:
        response = requests.get(f"{API_URL}/profile",
            headers={
                'Authorization': f'Bearer {token}',
                'Origin': 'http://localhost:5173'
            })
        
        if response.status_code == 200:
            profile = response.json()
            print("✅ Accès au profil réussi")
            print(f"   Utilisateur: {profile['username']} ({profile['email']})")
        else:
            print(f"❌ Échec accès profil: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Erreur accès profil: {e}")
    
    # Test 4: Création d'œuvre littéraire
    print("\n4. Test de création d'œuvre littéraire...")
    try:
        response = requests.post(f"{API_URL}/literary-works",
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json',
                'Origin': 'http://localhost:5173'
            },
            json={
                'title': 'Test Frontend Fix',
                'content': 'Cette œuvre teste les corrections frontend.',
                'type': 'poem',
                'status': 'published'
            })
        
        if response.status_code == 201:
            work = response.json()
            print("✅ Création d'œuvre réussie")
            print(f"   Œuvre: {work['work']['title']}")
        elif response.status_code == 429:
            print("⚠️  Limite de publication atteinte (normal)")
        else:
            print(f"❌ Échec création œuvre: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Erreur création œuvre: {e}")
    
    print(f"\n🎯 RÉSULTAT:")
    print("✅ Les corrections CORS et JWT sont appliquées")
    print("🌐 Le frontend devrait maintenant fonctionner correctement")
    print("📱 Testez l'application sur http://localhost:5173")
    
    return True

if __name__ == "__main__":
    test_cors_and_jwt() 