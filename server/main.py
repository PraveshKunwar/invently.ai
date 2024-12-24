from flask import Flask
from app import create

app: Flask = create()

if __name__ == '__main__':
    app.run(debug=True)