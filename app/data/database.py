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


from pymongo import MongoClient
import os



# - MONGO CONFIG----------------------------------
# if development : host is "mongodb://localhost:27017"
# if production or staging: db is set in host URI, host is in "MONGOHQ_URL" env variable found in '$ heroku config' command
# if TESTING: db is testing specific db

# environment options are: DEVELOPMENT, STAGING, PRODUCTION
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'DEVELOPMENT')

# separate configuration for each environment
mongo_config = {
	'DEVELOPMENT': {},
	'STAGING': {},
	'PRODUCTION': {},
}

# DEVELOPMENT configuration
mongo_config['DEVELOPMENT']['MONGO_HOST']	= "mongodb://localhost:27017"
mongo_config['DEVELOPMENT']['MONGO_DB'] 	= "eat-healthy-NYC"

# STAGING configuration
mongo_config['STAGING']['MONGO_HOST'] 		= "TODO"
mongo_config['STAGING']['MONGO_DB'] 		= "TODO"

# PRODUCTION configuration
mongo_config['PRODUCTION']['MONGO_HOST'] 	= os.environ.get('PRODUCTION_MONGO_HOST', None)
mongo_config['PRODUCTION']['MONGO_DB'] 		= os.environ.get('PRODUCTION_MONGO_DB', None)

# ---------------------------------- MONGO CONFIG-



# -----------------------------------------------------

def connect(environment=ENVIRONMENT):
	HOST = mongo_config[environment]['MONGO_HOST']
	DB 	 = mongo_config[environment]['MONGO_DB']
	
	try:
		client = MongoClient(HOST)
		database =  client[DB]
		print('connected to database {0} on {1}'.format(DB, HOST))
		return (client, database)
	
	except Exception as e:
		msg = 'Error connecting to database: {0}'.format(str(e))
		print '------ERROR--------\n' + msg + '\n------ERROR-------'
		raise Exception(msg)

(client, db) = connect()
def get_db():
	return db

# -----------------------------------------------------


