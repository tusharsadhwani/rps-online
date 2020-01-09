import random
import string
from enum import Enum, auto
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

hand_strings = ['r', 'p', 's']

class Hand(Enum):
    ROCK = auto()
    PAPER = auto()
    SCISSORS = auto()

class Player:
    def __init__(self, pid, name):
        self.pid = pid
        self.name = name
        self.score = 0
        self.hand = None

class Room:
    max_rounds = 10

    def __init__(self, room_code):
        self.room_code = room_code
        self.open = True
        self.round = 0
        self.players = []
    
    def add_player(self, player):
        if len(self.players) == 8:
            return

        self.players.append(player)
        if len(self.players) == 8:
            self.open = False

rooms = {}
ids = []

def add_new_player(user_name, room):
    while True:
        player_id = random.randrange(1, 1_000_000)
        if player_id not in ids:
            break
    
    room.add_player(Player(pid=player_id, name=user_name))
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
            new_room = Room(room_code)
            rooms[room_code] = new_room
            break

    player_id = add_new_player(user_name, new_room)
    return jsonify(code=room_code, id=player_id)

@app.route('/join')
def join_game():
    required_args = ['room', 'name']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']
    user_name = request.args['name']

    if room_code not in rooms:
        return jsonify(error=400, msg="Room does not exist")
    
    room = rooms[room_code]
    if not room.open:
        return jsonify(error=401, msg="Room is closed")

    player_id = add_new_player(user_name, room)
    return jsonify(id=player_id)

@app.route('/players')
def list_players():
    required_args = ['room']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']
    if room_code not in rooms:
        return jsonify(error=400, msg="Room does not exist")
    
    room = rooms[room_code]
    players = room.players
    return jsonify(list(p.name for p in players))

@app.route('/start')
def start_game():
    required_args = ['room']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']

    if room_code not in rooms:
        return jsonify(error=400, msg="Room does not exist")
    
    room = rooms[room_code]
    room.open = False
    return jsonify(success=True)

@app.route('/play')
def play_round():
    required_args = ['room', 'id', 'hand']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']
    player_id = request.args['id']
    hand = request.args['hand']

    if hand not in hand_strings:
        return jsonify(error=401, message="Invalid hand")

    if room_code not in rooms:
        return jsonify(error=400, message="Room does not exist")
    
    room = rooms[room_code]

    player = None
    for p in room.players:
        if p.pid == player_id:
            player = p
    
    if player is None:
        return jsonify(error=401, message="Player ID invalid")
    
    player.hand = (
        Hand.ROCK if hand == 'r' else
        Hand.PAPER if hand == 'p' else
        Hand.SCISSORS
    )

    return jsonify(success=True)

@app.route('/')
def ping():
    return jsonify(success=True)
