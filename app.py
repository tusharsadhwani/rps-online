from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True

@app.route('/new')
def new_game():
    print(request.args)
    return jsonify({'success': True})