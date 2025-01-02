from flask import Flask
from flask_cors import CORS
import os

def create() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    app.secret_key = os.urandom(24)
    from .auth import auth_bp
    from .data import data_bp
    from .subscribe import subscription_bp
    from .ai import ai_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(data_bp)
    app.register_blueprint(subscription_bp)
    app.register_blueprint(ai_bp)
    return app
