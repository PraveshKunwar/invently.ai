from flask import Blueprint, redirect, request, session, jsonify
import requests
from urllib.parse import urlencode
import os
from dotenv import load_dotenv
from .client import supabase_client
from datetime import datetime


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

@data_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        response = supabase_client.table('Products').select('*').eq('id', product_id).execute()
        product = response.data
        if not product:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(product[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@data_bp.route('/product/<int:product_id>', methods=['PUT'])
def update_product_with_history(product_id):
    try:
        data = request.json
        updates = data.get('updates')
        if not updates or not isinstance(updates, list):
            return jsonify({"error": "No updates provided or invalid format"}), 400
        current_product_response = supabase_client.table('Products').select('*').eq('id', product_id).execute()
        current_product = current_product_response.data[0] if current_product_response.data else None
        if not current_product:
            return jsonify({"error": "Product not found"}), 404
        changes = []
        for update in updates:
            field_name = update['field_name']
            new_value = update['new_value']
            old_value = current_product[field_name]
            if str(old_value) != str(new_value):
                changes.append({
                    "product_id": product_id,
                    "field_name": field_name,
                    "old_value": old_value,
                    "new_value": new_value,
                    "updated_at": datetime.utcnow().isoformat()
                })
        if changes:
            supabase_client.table('ProductsHistory').insert(changes).execute()
        update_payload = {update['field_name']: update['new_value'] for update in updates}
        update_payload['updated_at'] = datetime.utcnow().isoformat()
        response = supabase_client.table("Products").update(update_payload).eq("id", product_id).execute()
        if "error" in response and response["error"]:
            return jsonify({"error": response["error"]["message"]}), 400
        return jsonify({"message": "Product updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
