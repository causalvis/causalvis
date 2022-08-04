from flask import Flask, send_from_directory
from flask_cors import CORS, cross_origin
import time
import random
import json

app = Flask(__name__)

cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

# Path for our main Svelte page
@app.route("/")
def base():
    return send_from_directory('client/lib', 'index.js')

# Path for all the static files (compiled JS/CSS, etc.)
@app.route("/<path:path>")
def home(path):
    return send_from_directory('client/lib', path)

@app.route('/time', methods=["POST"])
# @cross_origin()
def get_current_time():
	print("received")
	return {"time": time.time()}

if __name__ == "__main__":
	app.run(debug=True)