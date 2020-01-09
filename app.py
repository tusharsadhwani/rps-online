import random
import string
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

class Player:
    def __init__(self, pid, name):
        self.pid = pid
        self.name = name
        self.score = 0

rooms = {}
ids = []

def add_new_player(user_name, room_code):
    while True:
        player_id = random.randrange(1, 1_000_000)
        if player_id not in ids:
            break
    
    rooms[room_code].append(Player(pid=player_id, name=user_name))
    return player_id

@app.route('/new')
def new_game():
    required_args = ['name']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    user_name = request.args['name']

    while True:
        room_code = ''
        for _ in range(5):
            room_code += random.choice(string.ascii_letters + string.digits)

        if room_code not in rooms:
            rooms[room_code] = []
            break

    player_id = add_new_player(user_name, room_code)
    return jsonify(code=room_code)

@app.route('/join')
def join_game():
    required_args = ['room', 'name']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']
    user_name = request.args['name']

    if room_code not in rooms:
        return jsonify(error=400, msg="Room does not exist")
    
    player_id = add_new_player(user_name, room_code)
    return jsonify(id=player_id)

@app.route('/players')
def list_players():
    required_args = ['room']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']
    if room_code not in rooms:
        return jsonify(error=400, msg="Room does not exist")
    
    players = rooms[room_code]
    return jsonify(list(p.name for p in players))
    
@app.route('/')
def ping():
    return jsonify(success=True)
