from flask import Flask
from config import Config
from backend.models import db
from backend.routes.books import books_bp
from backend.routes.users import users_bp
from backend.routes.literary_works import literary_works_bp
from backend.routes.workshops import workshops_bp
from backend.routes.groups import groups_bp
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

# Configuration CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration JWT
app.config["JWT_SECRET_KEY"] = Config.SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 24 heures
jwt = JWTManager(app)

# Initialisation de la base de données
db.init_app(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()

# Enregistrement des blueprints
app.register_blueprint(books_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api')
app.register_blueprint(literary_works_bp, url_prefix='/api')
app.register_blueprint(workshops_bp, url_prefix='/api')
app.register_blueprint(groups_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')