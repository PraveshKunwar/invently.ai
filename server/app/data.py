from flask import Blueprint, redirect, request, session, jsonify
import requests
from urllib.parse import urlencode
import os
from dotenv import load_dotenv
from .client import supabase_client


data_bp: Blueprint = Blueprint('data', __name__)

@data_bp.route('/product', methods=['GET'])
def get_products():
    try:
        response = supabase_client.table("Products").select("*").execute()
        if "error" in response and response["error"]:
            return jsonify({"error": response["error"]["message"]}), 400
        products = response.data
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
