from flask import Blueprint, redirect, request, session, jsonify
import requests
from urllib.parse import urlencode
import os
from dotenv import load_dotenv

auth_bp: Blueprint = Blueprint('auth', __name__)
# Login Route
# @auth_bp.route('/login')
