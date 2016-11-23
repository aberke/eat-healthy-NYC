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

from datetime import datetime 

from bson import ObjectId

import database


db = database.get_db()


def find_markets(id=None):
	""" TODO: test coverage 
	"""
	query = {}
	if id:
		query['_id'] = _sanitize_id(id)
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

	market_data = _sanitize_market_data(market_data)
	market_data = _stamp_last_modified(market_data)
	return db.markets.insert(market_data)


def delete_market(market_id):
	market_id = _sanitize_id(market_id)
	db.markets.remove({"_id": market_id})


def update_market(market_id, data):
	"""
	Only allowed to update list info 
	"""
	data = _sanitize_market_data(data)
	data = _stamp_last_modified(data)

	ret = db.markets.update({"_id": _sanitize_id(market_id)}, {"$set": data})
	
	if not ret['updatedExisting']:
		raise Exception("update_market failed to update an existing market")
	return ret


def _sanitize_id(id):
	return ObjectId(id)


def _sanitize_market_data(data):
	"""
	Assert only certain types make it into database and are queried for 
	"""
	if '_id' in data:
		data['_id'] = _sanitize_id(data['_id'])
	return data


def _stamp_last_modified(data):
	"""
	@param {dict} data  -- data with which to add key/value pair ('last_modified', UTC now date)
	Returns original data with extra key/value pair ('last_modified', UTC now date)
	"""
	data['last_modified'] = str(datetime.utcnow())
	return data
