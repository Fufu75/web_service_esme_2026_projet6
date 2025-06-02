#!/usr/bin/env python3
"""
Script de test complet pour toutes les API du réseau littéraire ESME
Vérifie toutes les routes et identifie les erreurs 422
"""

import requests
import json
import sys
import traceback

API_URL = 'http://localhost:5009/api'

class APITester:
    def __init__(self):
        self.token = None
        self.user_id = None
        self.errors = []
        self.successes = []
        
    def log_result(self, test_name, success, response=None, error=None):
        if success:
            self.successes.append(test_name)
            print(f"✅ {test_name}")
        else:
            error_info = {
                'test': test_name,
                'error': error,
                'status': response.status_code if response else None,
                'response': None
            }
            
            if response:
                try:
                    error_info['response'] = response.json()
                except:
                    error_info['response'] = response.text[:200]
            
            self.errors.append(error_info)
            print(f"❌ {test_name}")
            if error:
                print(f"   Error: {error}")
            if response:
                print(f"   Status: {response.status_code}")
                try:
                    print(f"   Response: {response.json()}")
                except:
                    print(f"   Response: {response.text[:200]}")
    
    def test_auth_routes(self):
        """Test des routes d'authentification"""
        print("\n🔐 Test des routes d'authentification")
        
        # Test inscription
        try:
            response = requests.post(f"{API_URL}/register", json={
                'username': f'testuser_{int(__import__("time").time())}',
                'email': f'test_{int(__import__("time").time())}@test.com',
                'password': 'password123'
            })
            self.log_result("POST /register", response.status_code == 201, response)
        except Exception as e:
            self.log_result("POST /register", False, error=f"Exception: {str(e)}")
        
        # Test connexion
        try:
            response = requests.post(f"{API_URL}/login", json={
                'email': 'marie.dubois@email.com',
                'password': 'password123'
            })
            if response.status_code == 200:
                data = response.json()
                self.token = data['access_token']
                self.user_id = data['user']['id']
                self.log_result("POST /login", True, response)
            else:
                self.log_result("POST /login", False, response)
        except Exception as e:
            self.log_result("POST /login", False, error=f"Exception: {str(e)}")
        
        # Test profil
        if self.token:
            try:
                response = requests.get(f"{API_URL}/profile", 
                    headers={'Authorization': f'Bearer {self.token}'})
                self.log_result("GET /profile", response.status_code == 200, response)
            except Exception as e:
                self.log_result("GET /profile", False, error=f"Exception: {str(e)}")
    
    def test_user_routes(self):
        """Test des routes utilisateurs"""
        print("\n👤 Test des routes utilisateurs")
        
        # Test liste des utilisateurs
        try:
            response = requests.get(f"{API_URL}/users")
            self.log_result("GET /users", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /users", False, error=f"Exception: {str(e)}")
        
        # Test utilisateur spécifique
        try:
            response = requests.get(f"{API_URL}/users/1")
            self.log_result("GET /users/1", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /users/1", False, error=f"Exception: {str(e)}")
        
        # Test activité utilisateur
        try:
            response = requests.get(f"{API_URL}/users/1/activity")
            self.log_result("GET /users/1/activity", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /users/1/activity", False, error=f"Exception: {str(e)}")
    
    def test_literary_work_routes(self):
        """Test des routes œuvres littéraires"""
        print("\n📚 Test des routes œuvres littéraires")
        
        # Test liste des œuvres
        try:
            response = requests.get(f"{API_URL}/literary-works")
            self.log_result("GET /literary-works", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /literary-works", False, error=f"Exception: {str(e)}")
        
        # Test avec filtres
        try:
            response = requests.get(f"{API_URL}/literary-works?sort_by=popularity&status=published")
            self.log_result("GET /literary-works (avec filtres)", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /literary-works (avec filtres)", False, error=f"Exception: {str(e)}")
        
        # Test œuvre spécifique
        try:
            response = requests.get(f"{API_URL}/literary-works/1")
            self.log_result("GET /literary-works/1", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /literary-works/1", False, error=f"Exception: {str(e)}")
        
        # Test limite de publication
        if self.token:
            try:
                response = requests.get(f"{API_URL}/literary-works/publication-limit",
                    headers={'Authorization': f'Bearer {self.token}'})
                self.log_result("GET /literary-works/publication-limit", response.status_code == 200, response)
            except Exception as e:
                self.log_result("GET /literary-works/publication-limit", False, error=f"Exception: {str(e)}")
        
        # Test création d'œuvre
        if self.token:
            try:
                response = requests.post(f"{API_URL}/literary-works", 
                    headers={'Authorization': f'Bearer {self.token}'},
                    json={
                        'title': f'Test Œuvre {int(__import__("time").time())}',
                        'content': 'Contenu de test pour vérifier la création d\'œuvre.',
                        'type': 'poem',
                        'status': 'published'
                    })
                self.log_result("POST /literary-works", response.status_code == 201, response)
            except Exception as e:
                self.log_result("POST /literary-works", False, error=f"Exception: {str(e)}")
        
        # Test like d'œuvre
        if self.token:
            try:
                response = requests.post(f"{API_URL}/literary-works/1/like",
                    headers={'Authorization': f'Bearer {self.token}'})
                self.log_result("POST /literary-works/1/like", response.status_code in [200, 201], response)
            except Exception as e:
                self.log_result("POST /literary-works/1/like", False, error=f"Exception: {str(e)}")
        
        # Test commentaire d'œuvre
        if self.token:
            try:
                response = requests.post(f"{API_URL}/literary-works/1/comments",
                    headers={'Authorization': f'Bearer {self.token}'},
                    json={
                        'content': f'Commentaire de test {int(__import__("time").time())}',
                        'rating': 4
                    })
                self.log_result("POST /literary-works/1/comments", response.status_code == 201, response)
            except Exception as e:
                self.log_result("POST /literary-works/1/comments", False, error=f"Exception: {str(e)}")
    
    def test_workshop_routes(self):
        """Test des routes ateliers"""
        print("\n🎨 Test des routes ateliers")
        
        # Test liste des ateliers
        try:
            response = requests.get(f"{API_URL}/workshops")
            self.log_result("GET /workshops", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /workshops", False, error=f"Exception: {str(e)}")
        
        # Test avec filtres
        try:
            response = requests.get(f"{API_URL}/workshops?status=active")
            self.log_result("GET /workshops (avec filtres)", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /workshops (avec filtres)", False, error=f"Exception: {str(e)}")
        
        # Test atelier spécifique
        try:
            response = requests.get(f"{API_URL}/workshops/1")
            self.log_result("GET /workshops/1", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /workshops/1", False, error=f"Exception: {str(e)}")
        
        # Test création d'atelier
        if self.token:
            try:
                response = requests.post(f"{API_URL}/workshops",
                    headers={'Authorization': f'Bearer {self.token}'},
                    json={
                        'title': f'Atelier Test {int(__import__("time").time())}',
                        'description': 'Description de test',
                        'theme': 'test',
                        'max_participants': 10,
                        'start_date': '2025-06-01',
                        'end_date': '2025-06-30'
                    })
                self.log_result("POST /workshops", response.status_code == 201, response)
            except Exception as e:
                self.log_result("POST /workshops", False, error=f"Exception: {str(e)}")
        
        # Test rejoindre un atelier
        if self.token:
            try:
                response = requests.post(f"{API_URL}/workshops/1/join",
                    headers={'Authorization': f'Bearer {self.token}'})
                self.log_result("POST /workshops/1/join", response.status_code in [200, 201], response)
            except Exception as e:
                self.log_result("POST /workshops/1/join", False, error=f"Exception: {str(e)}")
    
    def test_group_routes(self):
        """Test des routes groupes"""
        print("\n👥 Test des routes groupes")
        
        # Test liste des groupes
        try:
            response = requests.get(f"{API_URL}/groups")
            self.log_result("GET /groups", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /groups", False, error=f"Exception: {str(e)}")
        
        # Test avec filtres
        try:
            response = requests.get(f"{API_URL}/groups?is_private=false")
            self.log_result("GET /groups (avec filtres)", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /groups (avec filtres)", False, error=f"Exception: {str(e)}")
        
        # Test groupe spécifique
        try:
            response = requests.get(f"{API_URL}/groups/1")
            self.log_result("GET /groups/1", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /groups/1", False, error=f"Exception: {str(e)}")
        
        # Test création de groupe
        if self.token:
            try:
                response = requests.post(f"{API_URL}/groups",
                    headers={'Authorization': f'Bearer {self.token}'},
                    json={
                        'name': f'Groupe Test {int(__import__("time").time())}',
                        'description': 'Description de test pour groupe',
                        'is_private': False
                    })
                self.log_result("POST /groups", response.status_code == 201, response)
            except Exception as e:
                self.log_result("POST /groups", False, error=f"Exception: {str(e)}")
        
        # Test rejoindre un groupe
        if self.token:
            try:
                response = requests.post(f"{API_URL}/groups/1/join",
                    headers={'Authorization': f'Bearer {self.token}'})
                self.log_result("POST /groups/1/join", response.status_code in [200, 201], response)
            except Exception as e:
                self.log_result("POST /groups/1/join", False, error=f"Exception: {str(e)}")
    
    def test_book_routes(self):
        """Test des routes livres"""
        print("\n📖 Test des routes livres")
        
        # Test liste des livres
        try:
            response = requests.get(f"{API_URL}/books")
            self.log_result("GET /books", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /books", False, error=f"Exception: {str(e)}")
        
        # Test livre spécifique
        try:
            response = requests.get(f"{API_URL}/books/1")
            self.log_result("GET /books/1", response.status_code == 200, response)
        except Exception as e:
            self.log_result("GET /books/1", False, error=f"Exception: {str(e)}")
        
        # Test création de livre
        if self.token:
            try:
                response = requests.post(f"{API_URL}/books",
                    headers={'Authorization': f'Bearer {self.token}'},
                    json={
                        'title': f'Livre Test {int(__import__("time").time())}',
                        'author': 'Auteur Test'
                    })
                self.log_result("POST /books", response.status_code == 201, response)
            except Exception as e:
                self.log_result("POST /books", False, error=f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Exécute tous les tests"""
        print("🚀 Début des tests API complets\n")
        
        self.test_auth_routes()
        self.test_user_routes()
        self.test_literary_work_routes()
        self.test_workshop_routes()
        self.test_group_routes()
        self.test_book_routes()
        
        # Résumé
        print(f"\n📊 RÉSUMÉ DES TESTS")
        print(f"✅ Succès: {len(self.successes)}")
        print(f"❌ Erreurs: {len(self.errors)}")
        
        if self.errors:
            print(f"\n🔍 DÉTAIL DES ERREURS:")
            for i, error in enumerate(self.errors, 1):
                print(f"\n{i}. {error['test']}")
                if error['error']:
                    print(f"   Erreur: {error['error']}")
                if error['status']:
                    print(f"   Status: {error['status']}")
                if error['response']:
                    print(f"   Response: {error['response']}")
                    
            # Erreurs 422 spécifiquement
            errors_422 = [e for e in self.errors if e['status'] == 422]
            if errors_422:
                print(f"\n🚨 ERREURS 422 SPÉCIFIQUES:")
                for error in errors_422:
                    print(f"  • {error['test']}")
                    if error['response']:
                        print(f"    Response: {error['response']}")
        
        return len(self.errors) == 0

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1) 