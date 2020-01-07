import random
import string
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

rooms = []

@app.route('/new')
def new_game():
    room_code = ''
    for _ in range(5):
        room_code += random.choice(string.ascii_letters + string.digits)

    rooms.append(room_code)
    return jsonify({'code': room_code})