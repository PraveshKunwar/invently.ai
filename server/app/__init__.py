from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL: str = os.getenv('SUPABASE_URL')
SUPABASE_KEY: str = os.getenv('SUPABASE_KEY')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def create() -> Flask:
    load_dotenv()
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
    app.secret_key = os.urandom(24)

    from .auth import auth_bp
    from .routes import routes_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(routes_bp)
    return app
