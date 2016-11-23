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

import os

from pymongo import MongoClient

from config import MONGO_CONFIG


def connect(environment=None):
	if not environment:
		environment = os.environ.get('ENVIRONMENT', 'DEVELOPMENT')

	HOST = MONGO_CONFIG[environment]['MONGO_HOST']
	DB = MONGO_CONFIG[environment]['MONGO_DB']
	
	try:
		client = MongoClient(HOST)
		database =  client[DB]
		print('connected to database {0} on {1}'.format(DB, HOST))
		return database
	
	except Exception as e:
		msg = 'Error connecting to database: {0}'.format(str(e))
		print '------ERROR--------\n' + msg + '\n------ERROR-------'
		raise Exception(msg)


db = connect()


def get_db():
	return db


def drop_all(db=None, environment=None, **kwargs):
	db = db if db else connect(environment=environment)
	db.markets.remove()
