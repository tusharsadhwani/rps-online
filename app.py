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
    while True:
        room_code = ''
        for _ in range(5):
            room_code += random.choice(string.ascii_letters + string.digits)

        if room_code not in rooms:
            rooms.append(room_code)
            break

    return jsonify({'code': room_code})