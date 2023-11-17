#!/usr/bin/env python
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api

app = Flask(__name__)
CORS(app)

@app.route('/')
def landing():
    return '<h1>Hello World!</h1>'

app.run(host='0.0.0.0',port=5555)