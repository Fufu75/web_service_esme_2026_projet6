#!/usr/bin/env python3
"""
Script de validation finale - Vérification que toutes les erreurs 422 sont éliminées
"""

import requests
import json

API_URL = 'http://localhost:5009/api'

def get_token():
    """Obtenir un token JWT valide"""
    response = requests.post(f"{API_URL}/login", json={
        'email': 'marie.dubois@email.com',
        'password': 'password123'
    })
    if response.status_code == 200:
        return response.json()['access_token']
    return None

def validation_finale():
    """Validation finale de l'API"""
    print("🎯 VALIDATION FINALE - Réseau Littéraire ESME")
    print("=" * 50)
    
    token = get_token()
    if not token:
        print("❌ Impossible d'obtenir un token JWT")
        return False
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Tests des fonctionnalités principales
    tests_reussis = 0
    total_tests = 0
    
    print("\n📝 Test des fonctionnalités principales :")
    
    # 1. Création d'œuvre littéraire
    total_tests += 1
    response = requests.post(f"{API_URL}/literary-works", 
        headers=headers,
        json={
            'title': 'Validation Finale - Poème',
            'content': 'Un poème pour valider notre API\nTout fonctionne parfaitement !',
            'type': 'poem',
            'status': 'published'
        })
    if response.status_code == 201:
        tests_reussis += 1
        print("✅ Création d'œuvre littéraire")
        work_id = response.json()['work']['id']
    else:
        print(f"❌ Création d'œuvre littéraire - Status: {response.status_code}")
        work_id = 1
    
    # 2. Ajout de commentaire
    total_tests += 1
    response = requests.post(f"{API_URL}/literary-works/{work_id}/comments",
        headers=headers,
        json={
            'content': 'Excellent travail sur cette API !',
            'rating': 5
        })
    if response.status_code == 201:
        tests_reussis += 1
        print("✅ Ajout de commentaire")
    else:
        print(f"❌ Ajout de commentaire - Status: {response.status_code}")
    
    # 3. Création d'atelier
    total_tests += 1
    response = requests.post(f"{API_URL}/workshops",
        headers=headers,
        json={
            'title': 'Atelier Validation API',
            'description': 'Atelier pour valider notre API',
            'theme': 'validation',
            'max_participants': 20,
            'start_date': '2025-06-01',
            'end_date': '2025-06-30'
        })
    if response.status_code == 201:
        tests_reussis += 1
        print("✅ Création d'atelier")
    else:
        print(f"❌ Création d'atelier - Status: {response.status_code}")
    
    # 4. Création de groupe
    total_tests += 1
    response = requests.post(f"{API_URL}/groups",
        headers=headers,
        json={
            'name': 'Groupe Validation API',
            'description': 'Groupe pour valider notre API',
            'is_private': False
        })
    if response.status_code == 201:
        tests_reussis += 1
        print("✅ Création de groupe")
    else:
        print(f"❌ Création de groupe - Status: {response.status_code}")
    
    # 5. Création de livre
    total_tests += 1
    response = requests.post(f"{API_URL}/books",
        headers=headers,
        json={
            'title': 'Guide de Validation API',
            'author': 'Équipe ESME'
        })
    if response.status_code == 201:
        tests_reussis += 1
        print("✅ Création de livre")
    else:
        print(f"❌ Création de livre - Status: {response.status_code}")
    
    # 6. Récupération des données
    total_tests += 1
    response = requests.get(f"{API_URL}/literary-works")
    if response.status_code == 200:
        tests_reussis += 1
        print("✅ Récupération des œuvres")
    else:
        print(f"❌ Récupération des œuvres - Status: {response.status_code}")
    
    # 7. Récupération des ateliers
    total_tests += 1
    response = requests.get(f"{API_URL}/workshops")
    if response.status_code == 200:
        tests_reussis += 1
        print("✅ Récupération des ateliers")
    else:
        print(f"❌ Récupération des ateliers - Status: {response.status_code}")
    
    # 8. Récupération des groupes
    total_tests += 1
    response = requests.get(f"{API_URL}/groups")
    if response.status_code == 200:
        tests_reussis += 1
        print("✅ Récupération des groupes")
    else:
        print(f"❌ Récupération des groupes - Status: {response.status_code}")
    
    print(f"\n📊 RÉSULTATS DE LA VALIDATION :")
    print(f"✅ Tests réussis : {tests_reussis}/{total_tests}")
    print(f"📈 Taux de réussite : {(tests_reussis/total_tests)*100:.1f}%")
    
    if tests_reussis == total_tests:
        print("\n🎉 VALIDATION RÉUSSIE !")
        print("🚀 L'API du Réseau Littéraire ESME est entièrement fonctionnelle")
        print("✅ Toutes les erreurs 422 ont été éliminées")
        print("✅ L'authentification JWT fonctionne parfaitement")
        print("✅ Toutes les fonctionnalités principales sont opérationnelles")
        return True
    else:
        print(f"\n⚠️  {total_tests - tests_reussis} test(s) ont échoué")
        return False

if __name__ == "__main__":
    success = validation_finale()
    exit(0 if success else 1) 