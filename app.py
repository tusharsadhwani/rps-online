import random
import string
from enum import Enum
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

hand_strings = ['r', 'p', 's']

class Hand(Enum):
    ROCK = 'r'
    PAPER = 'p'
    SCISSORS = 's'

class Player:
    def __init__(self, pid, name):
        self.pid = pid
        self.name = name
        self.score = {}
        self.hand = None
    
    @property
    def hand_char(self):
        if self.hand is None:
            return None
        return self.hand.value

class Room:
    max_rounds = 10

    def __init__(self, room_code):
        self.room_code = room_code
        self.open = True
        self.round = 1
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
    required_args = ['room', 'round']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']
    round_no = int(request.args['round'])

    if room_code not in rooms:
        return jsonify(error=400, msg="Room does not exist")
    
    room = rooms[room_code]
    players = room.players

    if round_no != room.round:
        if round_no > room.max_rounds:
            scores = [f"{p.name} - {sum(p.score.values())}" for p in players]
            return jsonify(gameover=True, scores=scores)

        return jsonify(ready=False, players=[{'name': p.name, 'hand': None} for p in players])

    if all(p.hand is not None for p in players):
        ready = True
    else:
        ready = False
    return jsonify(ready=ready, players=[{'name': p.name, 'hand': p.hand_char} for p in players])
    
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
    required_args = ['room', 'id', 'round', 'hand']
    if any(arg not in request.args for arg in required_args):
        return jsonify(error=400, msg="Invalid Request")
        
    room_code = request.args['room']
    player_id = int(request.args['id'])
    round_no = int(request.args['round'])
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
    
    if round_no > room.round:
        if (round_no == room.round + 1
            and all(p.hand is not None for p in room.players)):
                room.round += 1
                for p in room.players:
                    p.hand = None
        else:
            return jsonify(error=401, message="Invalid round number")

    player.hand = (
        Hand.ROCK if hand == 'r' else
        Hand.PAPER if hand == 'p' else
        Hand.SCISSORS
    )

    if all(p.hand is not None for p in room.players):
        current_round = room.round
        rocks = 0
        papers = 0
        scissors = 0
        for p in room.players:
            if p.hand == Hand.ROCK:
                rocks += 1
            elif p.hand == Hand.PAPER:
                papers += 1
            elif p.hand == Hand.SCISSORS:
                scissors += 1

        for p in room.players:
            if p.hand == Hand.ROCK:
                p.score[current_round] = scissors
            elif p.hand == Hand.PAPER:
                p.score[current_round] = rocks
            elif p.hand == Hand.SCISSORS:
                p.score[current_round] = papers

    return jsonify(success=True)

@app.route('/')
def ping():
    return jsonify(success=True)
