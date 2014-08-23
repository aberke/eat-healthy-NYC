#********************************************************************************
#--------------------------------------------------------------------------------
#
#	Author: Alexandra Berke (aberke)
#
#
#
#	util file
#
#
#--------------------------------------------------------------------------------
#*********************************************************************************

from flask import Response
import json
from bson import ObjectId
from datetime import datetime




class JSONEncoder(json.JSONEncoder):
	# Custom JSONJSONencoder because by default, json cannot handle datetimes or ObjectIds """
	def default(self, o):
		if isinstance(o, datetime):
			return str(o)
		if isinstance(o, ObjectId):
			return str(o)
		return json.JSONEncoder.default(self, o)

	def decode(self, data):
		if not type(data) == dict:
			return data
		if '_id' in data:
			data['_id'] = ObjectId(data['_id'])
		return data

	def load(self, data):
		if not data:
			return None
		return self.decode(json.loads(data))

JSONencoder = JSONEncoder()


def dumpJSON(data):
	if not isinstance(data, str):
		data = JSONencoder.encode(data)
	response_headers = {'Content-Type': 'application/json'}
	return Response(data, 200, response_headers)
