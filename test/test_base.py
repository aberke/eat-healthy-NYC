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

import unittest

from app import app
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

	# ----------------------------------------------- Utility Methods -

