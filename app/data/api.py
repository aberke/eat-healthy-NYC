#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (github: aberke)
# 	2014
#	NYC
#
#
#--------------------------------------------------------------------------------
#********************************************************************************


from bson import ObjectId
from datetime import datetime 

import database
db = database.get_db()



#---------------------------------------------------------------------
#- Interface ---------------------------------------------------------

def find_markets(id=None):
	""" TODO: test coverage 
	"""
	query = {}
	if id:
		query['_id'] = sanitize_id(id)
	markets = db.markets.find(query)
	return [m for m in markets]

def find_one_market(**kwargs):
	""" No test coverage TODO """
	m = find_markets(**kwargs)
	return m[0] if m else None



def create_market(market_data):
	"""
	Returns _id of newly inserted document
	"""
	if not market_data:
		raise Exception("Tried to create market with invalid market data")

	if '_id' in market_data:
		raise Exception("Tried to create market with _id")

	market_data = sanitize_market_data(market_data)
	market_data = stamp_last_modified(market_data)
	return db.markets.insert(market_data)





#--------------------------------------------------------- Interface -
#---------------------------------------------------------------------




def sanitize_id(id):
	return ObjectId(id)


def sanitize_market_data(data):
	"""
	Assert only certain types make it into database and are queried for 
	"""
	if '_id' in data:
		data['_id'] = sanitize_id(data['_id'])
	return data


def date_now():
	return str(datetime.utcnow())


def stamp_last_modified(data):
	"""
	@param {dict} data  -- data with which to add key/value pair ('last_modified', UTC now date)
	Returns original data with extra key/value pair ('last_modified', UTC now date)
	"""
	data['last_modified'] = date_now()
	return data


