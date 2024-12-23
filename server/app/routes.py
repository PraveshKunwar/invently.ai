from flask import Blueprint, session, jsonify, redirect, request
import requests
import random
import string

routes_bp: Blueprint = Blueprint('routes', __name__)

# @routes_bp.route('/me')