from flask import Blueprint, redirect, request, session, jsonify
import requests
from urllib.parse import urlencode
import os
from dotenv import load_dotenv
from .client import supabase_client
from datetime import datetime
import stripe

stripe.api_key = os.getenv("VITE_STRIPE_SECRET_KEY")

subscription_bp: Blueprint = Blueprint('subscription', __name__)

@subscription_bp.route('/subscribe', methods=['POST'])
def subscribe():
    try:
        data = request.json
        plan_id = data.get("plan_id")

        price_map = {
            "free_plan_id": 0,
            "pro_plan_id": 999,
            "business_plan_id": 2999,
        }

        amount = price_map.get(plan_id)
        if amount is None:
            return jsonify({"error": "Invalid plan ID"}), 400

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            metadata={"plan_id": plan_id}
        )
        return jsonify({"clientSecret": intent.client_secret}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
