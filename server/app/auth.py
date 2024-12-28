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
        response = supabase_client.auth.sign_up({
            "email": email,
            "password": password,
            "redirect_to": "http://localhost:5173/auth/callback"
        })
        if "error" in response and response["error"]:
            return jsonify({"error": response["error"]["message"]}), 400
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        response = supabase_client.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        session = response.session
        user = response.user

        if not session or not session.access_token:
            return jsonify({"error": "Session or access token missing"}), 500

        # Convert user object to dictionary
        user_data = {
            "id": user.id,
            "email": user.email,
            "created_at": user.created_at,
            "confirmed_at": user.confirmed_at,
            "role": user.role,
        }

        return jsonify({
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "expires_in": session.expires_in,
            "user": user_data  # Use serialized user data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Log out a user and invalidate the session"""
    try:
        # Get the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401
        # Validate the token format
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid authorization header format"}), 401
        # Proceed with sign out (if needed)
        response = supabase_client.auth.sign_out()
        if "error" in response and response["error"]:
            return jsonify({"error": response["error"]["message"]}), 400
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Refresh expired access tokens"""
    try:
        data = request.json
        refresh_token = data.get("refresh_token")
        if not refresh_token:
            return jsonify({"error": "Refresh token is required"}), 400
        response = supabase_client.auth.refresh_session(refresh_token)
        if "error" in response and response["error"]:
            return jsonify({"error": response["error"]["message"]}), 400

        return jsonify({
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in,
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
def get_user():
    """Fetch details of the currently logged-in user"""
    try:
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization header missing"}), 401
        token = auth_header.split(" ")[1]
        user_data = supabase_client.auth.get_user(jwt=token)
        # Debugging print statements
        print(f"Supabase user response: {user_data}")
        # Handle Supabase errors
        if "error" in user_data and user_data["error"]:
            return jsonify({"error": user_data["error"]["message"]}), 400
        # Serialize the User object
        user_dict = {
            "id": user_data.user.id,
            "email": user_data.user.email,
            "created_at": user_data.user.created_at.isoformat() if user_data.user.created_at else None,
            "confirmed_at": user_data.user.confirmed_at.isoformat() if user_data.user.confirmed_at else None,
            "email_confirmed_at": user_data.user.email_confirmed_at.isoformat() if user_data.user.email_confirmed_at else None,
            "role": user_data.user.role,
            "app_metadata": user_data.user.app_metadata,
            "user_metadata": user_data.user.user_metadata,
        }
        return jsonify({"user": user_dict}), 200
    except Exception as e:
        print(f"Error in /me route: {e}")
        return jsonify({"error": str(e)}), 500
