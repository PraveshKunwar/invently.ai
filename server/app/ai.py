from flask import Blueprint, request, jsonify
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

ai_bp = Blueprint("ai", __name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

@ai_bp.route("/ai/query", methods=["POST"])
def ai_query():
    try:
        data = request.json
        query = data.get("query")
        if not query:
            return jsonify({"error": "Query is required"}), 400
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(query)
        return jsonify({"response": response.text}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
