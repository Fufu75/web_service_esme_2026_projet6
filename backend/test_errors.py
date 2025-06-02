#!/usr/bin/env python3
"""
Script de test spécifique pour identifier les erreurs 400 et 422
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

def test_specific_errors():
    """Test des routes qui génèrent des erreurs 400/422"""
    token = get_token()
    if not token:
        print("❌ Impossible d'obtenir un token JWT")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    
    print("🔍 Test des routes avec erreurs spécifiques\n")
    
    # Test 1: POST /literary-works avec données manquantes
    print("1. Test POST /literary-works avec données incomplètes")
    response = requests.post(f"{API_URL}/literary-works", 
        headers=headers,
        json={'title': 'Test sans content'})  # Manque 'content'
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")
    
    # Test 2: POST /literary-works avec données correctes
    print("\n2. Test POST /literary-works avec données correctes")
    response = requests.post(f"{API_URL}/literary-works", 
        headers=headers,
        json={
            'title': 'Test Œuvre Correcte',
            'content': 'Contenu de test valide',
            'type': 'poem'
        })
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")
    
    # Test 3: POST /literary-works/1/like (peut échouer si déjà liké)
    print("\n3. Test POST /literary-works/1/like")
    response = requests.post(f"{API_URL}/literary-works/1/like", headers=headers)
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")
    
    # Test 4: POST /workshops/1/join (peut échouer si déjà membre)
    print("\n4. Test POST /workshops/1/join")
    response = requests.post(f"{API_URL}/workshops/1/join", headers=headers)
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")
    
    # Test 5: POST /groups/1/join (peut échouer si déjà membre)
    print("\n5. Test POST /groups/1/join")
    response = requests.post(f"{API_URL}/groups/1/join", headers=headers)
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")
    
    # Test 6: POST /books avec données manquantes
    print("\n6. Test POST /books avec données manquantes")
    response = requests.post(f"{API_URL}/books", 
        headers=headers,
        json={'title': 'Test sans author'})  # Manque 'author'
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")
    
    # Test 7: POST /books avec données correctes
    print("\n7. Test POST /books avec données correctes")
    response = requests.post(f"{API_URL}/books", 
        headers=headers,
        json={
            'title': 'Livre Test Correct',
            'author': 'Auteur Test'
        })
    print(f"   Status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")

if __name__ == "__main__":
    test_specific_errors() 