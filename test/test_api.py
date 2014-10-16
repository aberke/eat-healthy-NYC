#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (github: aberke)
# 	2014
#	NYC
#
# 	Tests for API endpoints
#
#--------------------------------------------------------------------------------
#********************************************************************************

import json
from base64 import b64encode # for basic auth

from test_base import BaseTestCase


# the test data that will be injected
TEST_MARKET_DATA = {
	"county": "Brooklyn",
	"name": "Saratoga Farm Stand",
	"Stellar": False,
	"CSWCKs": False,
	"days": {
		"6": "10am - 2pm"
	},
	"bad-date-data": True,
	"EBT": True,
	"operation-months": None,
	"location": "Saratoga Ave & Fulton St",
	"operation-hours": "Sat10am - 2pm"
}



class APItestCase(BaseTestCase):

	"""
	GET_market is implicitly tested by other tests
	"""

	# - Utility Methods ----------------------------------------------

	def response_data(self, rv):
		json_data = json.loads(rv.data)
		self.assertIn('data', json_data)
		return json_data['data']


	def GET_data(self, endpoint):
		rv = self.app.get(endpoint)
		self.assertEqual(rv.status_code, 200)
		return self.response_data(rv)

	def POST_data(self, endpoint, data=None):
		data = data if data else {}
		rv = self.app.post(endpoint, data=json.dumps(data), headers=self.basic_auth_headers())
		self.assertEqual(rv.status_code, 200)
		return self.response_data(rv)
	
	# ----------------------------------------------- Utility Methods -

	def test_no_data(self):
		# get all market should return empty list
		all_markets = self.GET_data('/api/markets')
		self.assertEqual([], all_markets)


class PUTtestCase(APItestCase):

	def test_put_bad_data(self):
		print 'TODO'


	


class POSTtestCase(APItestCase):

	def test_requires_auth(self):
		# post good data with no auth headers and expect 401
		rv = self.app.post('/api/markets', data=json.dumps(TEST_MARKET_DATA))
		self.assertEqual(rv.status_code, 401)

		# post good data with bad auth headers and expect 401
		bad_auth_headers = {
    		'Authorization': 'Basic ' + b64encode("{0}:{1}".format('im', 'bad'))
		}
		rv = self.app.post('/api/markets', data=json.dumps(TEST_MARKET_DATA), headers=bad_auth_headers)
		self.assertEqual(rv.status_code, 401)


	def test_post_bad_data(self):

		# post with empty data should return error and not post
		rv = self.app.post('/api/markets', data=json.dumps({}), headers=self.basic_auth_headers())
		self.assertEqual(rv.status_code, 500)
		get_all = self.GET_data('/api/markets')
		self.assertEqual(0, len(get_all))

		# post with an _id should return error
		posted_id = self.POST_data('/api/markets', data=TEST_MARKET_DATA)['_id']
		BAD_TEST_DATA = TEST_MARKET_DATA.copy()
		BAD_TEST_DATA['_id'] = posted_id
		rv = self.app.post('/api/markets', data=json.dumps(BAD_TEST_DATA), headers=self.basic_auth_headers())
		self.assertEqual(rv.status_code, 500)


	def test_post_data_x_3(self):
		# post, keep posted_1_id
		# expect get all returns 1
		# expect get(posted_1_id) will return list where only element=posted value
		posted_1 = self.POST_data('/api/markets', data=TEST_MARKET_DATA)
		self.assertIn('_id', posted_1)
		posted_1_id = posted_1['_id']

		get_1 = self.GET_data('/api/markets/' + posted_1_id)
		self.assertDataMatch(TEST_MARKET_DATA, get_1)
		
		get_all_1 = self.GET_data('/api/markets')
		self.assertEqual(1, len(get_all_1))
		self.assertEqual(get_1, get_all_1[0])

		# post data twice more and expect to be able to get it
		posted_2 = self.POST_data('/api/markets', data=TEST_MARKET_DATA)
		self.assertIn('_id', posted_2)
		posted_2_id = posted_2['_id']

		get_2 = self.GET_data('/api/markets/' + posted_2_id)
		self.assertDataMatch(TEST_MARKET_DATA, get_2)

		posted_3 = self.POST_data('/api/markets', data=TEST_MARKET_DATA)
		
		get_all_3 = self.GET_data('/api/markets')
		self.assertEqual(3, len(get_all_3))


























