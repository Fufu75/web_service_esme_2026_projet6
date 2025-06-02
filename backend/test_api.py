#!/usr/bin/env python3
"""
Script de test pour vérifier le bon fonctionnement de l'API
"""

import requests
import json

BASE_URL = "http://localhost:5009/api"

def test_api():
    print("🧪 Test de l'API Réseau Littéraire ESME")
    print("=" * 50)
    
    # Test 1: Connexion
    print("1. Test de connexion...")
    login_data = {
        "email": "marie.dubois@email.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/login", json=login_data)
    if response.status_code == 200:
        token = response.json()["access_token"]
        print("   ✅ Connexion réussie")
    else:
        print(f"   ❌ Erreur de connexion: {response.status_code}")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 2: Profil utilisateur
    print("2. Test du profil utilisateur...")
    response = requests.get(f"{BASE_URL}/profile", headers=headers)
    if response.status_code == 200:
        print("   ✅ Profil récupéré avec succès")
    else:
        print(f"   ❌ Erreur profil: {response.status_code}")
    
    # Test 3: Liste des œuvres littéraires
    print("3. Test de la liste des œuvres...")
    response = requests.get(f"{BASE_URL}/literary-works")
    if response.status_code == 200:
        works = response.json()
        print(f"   ✅ {len(works)} œuvres récupérées")
    else:
        print(f"   ❌ Erreur œuvres: {response.status_code}")
    
    # Test 4: Détail d'une œuvre
    print("4. Test du détail d'une œuvre...")
    response = requests.get(f"{BASE_URL}/literary-works/1")
    if response.status_code == 200:
        print("   ✅ Détail de l'œuvre récupéré")
    else:
        print(f"   ❌ Erreur détail œuvre: {response.status_code}")
    
    # Test 5: Ajout d'un commentaire
    print("5. Test d'ajout de commentaire...")
    comment_data = {
        "content": "Test de commentaire automatique",
        "rating": 4
    }
    response = requests.post(f"{BASE_URL}/literary-works/2/comments", 
                           json=comment_data, headers=headers)
    if response.status_code == 201:
        print("   ✅ Commentaire ajouté avec succès")
    else:
        print(f"   ❌ Erreur commentaire: {response.status_code}")
    
    # Test 6: Liste des ateliers
    print("6. Test de la liste des ateliers...")
    response = requests.get(f"{BASE_URL}/workshops")
    if response.status_code == 200:
        workshops = response.json()
        print(f"   ✅ {len(workshops)} ateliers récupérés")
    else:
        print(f"   ❌ Erreur ateliers: {response.status_code}")
    
    # Test 7: Création d'un groupe
    print("7. Test de création de groupe...")
    group_data = {
        "name": f"Groupe Test API",
        "description": "Groupe créé par le script de test",
        "is_private": False
    }
    response = requests.post(f"{BASE_URL}/groups", json=group_data, headers=headers)
    if response.status_code == 201:
        print("   ✅ Groupe créé avec succès")
    else:
        print(f"   ❌ Erreur création groupe: {response.status_code}")
    
    # Test 8: Liste des groupes
    print("8. Test de la liste des groupes...")
    response = requests.get(f"{BASE_URL}/groups")
    if response.status_code == 200:
        groups = response.json()
        print(f"   ✅ {len(groups)} groupes récupérés")
    else:
        print(f"   ❌ Erreur groupes: {response.status_code}")
    
    print("\n🎉 Tests terminés !")

if __name__ == "__main__":
    try:
        test_api()
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur. Assurez-vous qu'il fonctionne sur le port 5009.")
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}") 