from flask import Blueprint, session, jsonify, redirect, request
import requests
import random
import string
from .client import supabase_client

routes_bp: Blueprint = Blueprint('routes', __name__)

@routes_bp.route('/me', methods=['GET'])
def get_user():
    """Fetch details of the currently logged-in user"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401
        token = auth_header.split(" ")[1]
        user_data = supabase_client.auth.get_user(jwt=token)
        if "error" in user_data and user_data["error"]:
            return jsonify({"error": user_data["error"]["message"]}), 400
        return jsonify({"user": user_data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
