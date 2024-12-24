from flask import Blueprint, redirect, request, session, jsonify
import requests
from urllib.parse import urlencode
import os
from dotenv import load_dotenv
from .client import supabase_client


auth_bp: Blueprint = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        response = supabase_client.auth.sign_up(email, password)
        if "error" in response and response["error"]:
            return jsonify({"error": response["error"]["message"]}), 400
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in a user and return session details"""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        response = supabase_client.auth.sign_in_with_password(email=email, password=password)
        if "error" in response and response["error"]:
            return jsonify({"error": response["error"]["message"]}), 400
        session = response.get("session")
        user = response.get("user")
        if not session or not session.get("access_token"):
            return jsonify({"error": "Session or access token missing"}), 500
        return jsonify({
            "access_token": session["access_token"],
            "refresh_token": session["refresh_token"],
            "expires_in": session["expires_in"],
            "user": user
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
