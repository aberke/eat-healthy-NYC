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

	def DELETE_data(self, endpoint):
		rv = self.app.delete(endpoint, headers=self.basic_auth_headers())
		self.assertEqual(rv.status_code, 200)

	def POST_data(self, endpoint, data=None):
		rv = self.app.post(endpoint, data=json.dumps(data), headers=self.basic_auth_headers())
		self.assertEqual(rv.status_code, 200)
		return self.response_data(rv)

	def PUT_data(self, endpoint, data=None):
		rv = self.app.put(endpoint, data=json.dumps(data), headers=self.basic_auth_headers())
		self.assertEqual(rv.status_code, 200)
		return self.response_data(rv)
	
	# ----------------------------------------------- Utility Methods -

	def test_no_data(self):
		# get all market should return empty list
		all_markets = self.GET_data('/api/markets')
		self.assertEqual([], all_markets)

	


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



class DELETEtestCase(APItestCase):

	def test_requires_auth(self):
		# delete with no auth headers and expect 401
		rv = self.app.delete('/api/markets/0')
		self.assertEqual(rv.status_code, 401)

		# delete with bad auth headers and expect 401
		bad_auth_headers = {
    		'Authorization': 'Basic ' + b64encode("{0}:{1}".format('im', 'bad'))
		}
		rv = self.app.delete('/api/markets/0')
		self.assertEqual(rv.status_code, 401)


	def test_post_then_delete_x_2(self):
		"""
		1. POST good data 2 times, verify 2 markets in db
		2. for each posted market:
			verify can get it
			delete it
			verify can't get it
		3. get all and verify 0 markets in db
		"""
		# 1.
		id_1 = self.POST_data('/api/markets', data=TEST_MARKET_DATA)['_id']
		id_2 = self.POST_data('/api/markets', data=TEST_MARKET_DATA)['_id']
		get_all = self.GET_data('/api/markets')
		self.assertEqual(2, len(get_all))

		# 2.
		get_1 = self.GET_data('/api/markets/' + id_1)
		self.assertDataMatch(TEST_MARKET_DATA, get_1)
		self.DELETE_data('/api/markets/' + id_1)
		get_1 = self.GET_data('/api/markets/' + id_1)
		self.assertEqual(None, get_1)

		get_2 = self.GET_data('/api/markets/' + id_2)
		self.assertDataMatch(TEST_MARKET_DATA, get_2)
		self.DELETE_data('/api/markets/' + id_2)
		get_2 = self.GET_data('/api/markets/' + id_2)
		self.assertEqual(None, get_2)

		# 3.
		get_all = self.GET_data('/api/markets')
		self.assertEqual(0, len(get_all))



class PUTtestCase(APItestCase):

	def test_requires_auth(self):
		# post good data with no auth headers and expect 401
		rv = self.app.put('/api/markets/0', data=json.dumps(TEST_MARKET_DATA))
		self.assertEqual(rv.status_code, 401)

		# post good data with bad auth headers and expect 401
		bad_auth_headers = {
    		'Authorization': 'Basic ' + b64encode("{0}:{1}".format('im', 'bad'))
		}
		rv = self.app.put('/api/markets/0', data=json.dumps(TEST_MARKET_DATA), headers=bad_auth_headers)
		self.assertEqual(rv.status_code, 401)


	def test_good_put(self):
		print 'TODO'
		"""
		0. 
		PUT_TEST_MARKET_DATA = TEST_MARKET_DATA.copy()
		POST TEST_MARKET_DATA
		1.
		PUT {'name': 'new-name-1'}
		PUT_TEST_MARKET_DATA['name'] = 'new-name-1'
		GET and verify response matches PUT_TEST_MARKET_DATA
		2.
		PUT {'name': 'new-name-2', 'contact': 'new-contact-2'}
		PUT_TEST_MARKET_DATA['name'] = 'new-name-2'
		PUT_TEST_MARKET_DATA['contact'] = 'new-contact-2'
		GET and verify response matches PUT_TEST_MARKET_DATA
		"""
		PUT_TEST_MARKET_DATA = TEST_MARKET_DATA.copy()
		id = self.POST_data('/api/markets', data=PUT_TEST_MARKET_DATA)['_id']
		
		self.PUT_data('/api/markets/' + id, data={'name': 'new-name-1'})
		PUT_TEST_MARKET_DATA['name'] = 'new-name-1'
		get_data = self.GET_data('/api/markets/' + id)
		self.assertDataMatch(PUT_TEST_MARKET_DATA, get_data)

		self.PUT_data('/api/markets/' + id, data={'name': 'new-name-2', 'contact': 'new-contact-2'})
		PUT_TEST_MARKET_DATA['name'] = 'new-name-2'
		PUT_TEST_MARKET_DATA['contact'] = 'new-contact-2'
		get_data = self.GET_data('/api/markets/' + id)
		self.assertDataMatch(PUT_TEST_MARKET_DATA, get_data)


	def test_trivial_put(self):
		"""
		POST TEST_MARKET_DATA
		PUT {} to posted data
		GET and verify response matches TEST_MARKET_DATA (data not modified)
		"""
		id = self.POST_data('/api/markets', data=TEST_MARKET_DATA)['_id']
		self.PUT_data('/api/markets/' + id, data={})
		get_data = self.GET_data('/api/markets/' + id)
		self.assertDataMatch(TEST_MARKET_DATA, get_data)


	def test_put_bad_data(self):
		"""
		PUT with an id that shouldn't exist -> expect error
		"""
		rv = self.app.put('/api/markets/543f2de2eb27ac4510135ba5', data=json.dumps({}), headers=self.basic_auth_headers())
		json_data = json.loads(rv.data)
		self.assertEqual(rv.status_code, 500)
		self.assertIn('error', json_data)
		
		






















