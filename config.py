#********************************************************************************
#--------------------------------------------------------------------------------
#
# 	Author: Alexandra Berke (aberke)
# 	Written: Summer 2014
#
#
#--------------------------------------------------------------------------------
#*********************************************************************************

import os

# test.py sets environment to TESTING, heroku has environment as PRODUCTION
ENVIRONMENT = os.environ.get('ENVIRONMENT', 'DEVELOPMENT')

HOST = os.getenv('HOST', '127.0.0.1')
PORT = os.getenv('PORT', 5000)
DEBUG = False if ENVIRONMENT == 'PRODUCTION' else True

SECRET_KEY = os.getenv('SESSION_SECRET', 'eat-healthy')

GOOGLE_API_KEY = "AIzaSyBFuETDB8Qj8Du3fU7NR6RkRwIOx4_KmdY"

BASIC_AUTH_USERNAME	= os.getenv('BASIC_AUTH_USERNAME', 'user')
BASIC_AUTH_PASSWORD	= os.getenv('BASIC_AUTH_PASSWORD', 'password')

# separate configuration for each environment
MONGO_CONFIG = {
	# If TESTING: db is testing specific db
	'TESTING': {
		'MONGO_HOST': 'mongodb://localhost:27017',
		'MONGO_DB': 'TESTING-eat-healthy-NYC',
	},
	'DEVELOPMENT': {
		'MONGO_HOST': 'mongodb://localhost:27017',
		'MONGO_DB': 'eat-healthy-NYC',
	},
	# If production or staging: db is set in host URI, is in "MONGOHQ_URL" env
	# variable found in '$ heroku config' command
	'STAGING': {
		'MONGO_HOST': 'TODO',
		'MONGO_DB': 'TODO',
	},
	'PRODUCTION': {
		'MONGO_HOST': os.environ.get('MONGOHQ_URL', None),
		'MONGO_DB': 'app27181822',
	},
}
