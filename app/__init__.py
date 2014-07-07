#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (aberke)
# 	Written: Summer 2014
#
#
#--------------------------------------------------------------------------------
#*********************************************************************************




from flask import Flask, send_file, jsonify
from flask.ext.compress import Compress



# Configuration ----------------------------------------------

app = Flask('app')
app.config.from_object('config')
Compress(app)

from data import get_data
data = get_data()

#---------------------------------------------- Configuration #


@app.route('/')
def base(cleanerName=None):
	return send_file('static/map.html')


@app.route('/data')
def GETdata():
	return jsonify({'data': data})



















