#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (aberke)
# 	2014
#	NYC
#
#
#--------------------------------------------------------------------------------
#*********************************************************************************

from flask import Flask, send_file, request
from flask.ext.compress import Compress
import json
from util import dumpJSON, respond500
from basic_auth import requires_auth


#--------------------------------------------------------------
#- Configuration ----------------------------------------------

app = Flask('app')
app.config.from_object('config')
Compress(app)

from app.data import api

#---------------------------------------------- Configuration --
#---------------------------------------------------------------


#---------------------------------------------------------------
#- User Interface ----------------------------------------------

@app.route('/')
def base():
	return send_file('static/html/base.html')

# @app.route('/admin')
# @requires_auth
# def admin():
# 	return send_file('static/admin.html')

@app.route('/data')
def GET_data():
	return GET_markets_all()

#--------------------------------------------- User Interface -
#--------------------------------------------------------------




#--------------------------------------------------------------
#- Admin API --------------------------------------------------


@app.route('/api/markets', methods=['GET'])
def GET_markets_all():
	""" Returns list of markets """
	return dumpJSON(data=api.find_markets())


@app.route('/api/markets/<id>', methods=['GET'])
def GET_market(id):
	market = api.find_one_market(id=id)
	return dumpJSON(data=market)

# TODO - AUTHENTICATION
@app.route('/api/markets/<id>', methods=['DELETE'])
def DELETE_market(id):
	return 'TODO'

# TODO - AUTHENTICATION
@app.route('/api/markets/<id>', methods=['PUT'])
def PUT_market(id):
	return 'TODO'

# TODO - AUTHENTICATION
@app.route('/api/markets', methods=['POST'])
@requires_auth
def POST_market():
	try:
		market_data = json.loads(request.data)
		market_id = api.create_market(market_data)
		return dumpJSON(data={'_id': market_id})
	except Exception as e:
		return respond500(e)






#- Admin API --------------------------------------------------
#--------------------------------------------------------------








