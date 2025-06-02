from flask import Flask, jsonify
from config import Config
from models import db
from routes.books import books_bp
from routes.users import users_bp
from routes.literary_works import literary_works_bp
from routes.workshops import workshops_bp
from routes.groups import groups_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

# Configuration CORS améliorée
CORS(app, 
     resources={r"/api/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     supports_credentials=True)

# Configuration JWT
app.config["JWT_SECRET_KEY"] = Config.SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 24 heures
jwt = JWTManager(app)

# Initialisation de la base de données
db.init_app(app)

with app.app_context():
    db.create_all()

# Route racine
@app.route('/')
def home():
    return jsonify({
        'message': 'API Réseau Littéraire ESME',
        'version': '1.0',
        'status': 'active'
    })

# Route de santé
@app.route('/api/')
def api_health():
    return jsonify({
        'message': 'API Réseau Littéraire ESME',
        'version': '1.0',
        'status': 'healthy',
        'endpoints': [
            '/api/register',
            '/api/login',
            '/api/books',
            '/api/literary-works',
            '/api/workshops',
            '/api/groups'
        ]
    })

# Enregistrement des blueprints
app.register_blueprint(books_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')
app.register_blueprint(literary_works_bp, url_prefix='/api')
app.register_blueprint(workshops_bp, url_prefix='/api')
app.register_blueprint(groups_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5009)