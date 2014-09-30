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




from flask import Flask, send_file
from flask.ext.compress import Compress
from util import dumpJSON


# Configuration ----------------------------------------------

app = Flask('app')
app.config.from_object('config')
Compress(app)

from app.data import get_markets
mkt_data = get_markets()

#---------------------------------------------- Configuration #


@app.route('/')
def base():
	return send_file('static/map.html')

@app.route('/admin')
def admin():
	return send_file('static/admin.html')


@app.route('/data')
def GETdata():
	return dumpJSON({'data': mkt_data})



















