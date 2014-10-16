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
DEBUG= False if ENVIRONMENT == 'PRODUCTION' else True



SECRET_KEY 		= os.getenv('SESSION_SECRET', 'eat-healthy')

GOOGLE_API_KEY  = "AIzaSyBFuETDB8Qj8Du3fU7NR6RkRwIOx4_KmdY"

BASIC_AUTH_USERNAME			= os.getenv('BASIC_AUTH_USERNAME', 'user')
BASIC_AUTH_PASSWORD			= os.getenv('BASIC_AUTH_PASSWORD', 'password')




del os