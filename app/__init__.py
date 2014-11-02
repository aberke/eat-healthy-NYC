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
from util import respond500, respond200
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

@app.route('/admin')
@requires_auth
def admin():
	return send_file('static/admin/admin-base.html')


#--------------------------------------------- User Interface -
#--------------------------------------------------------------




#--------------------------------------------------------------
#- Admin API --------------------------------------------------


@app.route('/api/markets', methods=['GET'])
def GET_markets_all():
	""" Returns list of markets """
	return respond200(data=api.find_markets())


@app.route('/api/markets/<id>', methods=['GET'])
def GET_market(id):
	market = api.find_one_market(id=id)
	return respond200(data=market)


@app.route('/api/markets/<id>', methods=['DELETE'])
@requires_auth
def DELETE_market(id):
	try:
		market_id = api.delete_market(id)
		return respond200()
	except Exception as e:
		return respond500(e)


@app.route('/api/markets/<id>', methods=['PUT'])
@requires_auth
def PUT_market(id):
	try:
		market_data = json.loads(request.data)
		ret = api.update_market(id, market_data)
		return respond200()
	except Exception as e:
		return respond500(e)

@app.route('/api/markets', methods=['POST'])
@requires_auth
def POST_market():
	try:
		market_data = json.loads(request.data)
		market_id = api.create_market(market_data)
		return respond200(data={'_id': market_id})
	except Exception as e:
		return respond500(e)


#- Admin API --------------------------------------------------
#--------------------------------------------------------------








