from flask import Flask
from app import create
from dotenv import load_dotenv
import os

app: Flask = create()

if __name__ == '__main__':
    app.run(debug=True)