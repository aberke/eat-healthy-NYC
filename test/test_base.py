#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (github: aberke)
# 	2014
#	NYC
#
# 	Base file for test cases
#
#--------------------------------------------------------------------------------
#********************************************************************************

from base64 import b64encode # for basic auth
import unittest

from app import app
import config
from app.data import database


class BaseTestCase(unittest.TestCase):

	# - Setup/Teardown -----------------------------------------------
	def setUp(self):
		app.config['TESTING'] = True
		self.app = app.test_client()

	def tearDown(self):
		database.drop_all()

	# ----------------------------------------------- Setup/Teardown -

	# - Utility Methods ----------------------------------------------
	def assertDataMatch(self, test_data, response_data, keys=None):
		""" Assert test_data and response_data match across keys or test_data.keys()"""
		keys = keys if keys else test_data.keys()
		for test_key in keys:
			self.assertEqual(test_data[test_key], response_data[test_key])


	def basic_auth_headers(self):
		""" requires_auth decorator in lib/basic_auth verifies that request made with BASIC_AUTH_USERNAME and BASIC_AUTH_PASSWORD
			or sends 401
		"""
		BASIC_AUTH_USERNAME = config.BASIC_AUTH_USERNAME
		BASIC_AUTH_PASSWORD = config.BASIC_AUTH_PASSWORD
		return {
    		'Authorization': 'Basic ' + b64encode("{0}:{1}".format(BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD))
		}

	# ----------------------------------------------- Utility Methods -
