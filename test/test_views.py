#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (github: aberke)
# 	2014
#	NYC
#
# 	Tests for views
#
#--------------------------------------------------------------------------------
#********************************************************************************

from test_base import BaseTestCase


class ViewsTestCase(BaseTestCase):

	# - Utility Methods ----------------------------------------------
	
	def expect_view_200(self, endpoint):
		""" Helper that gets the page and expects 200 status and content """
		rv = self.app.get(endpoint)
		self.assertEqual(rv.status_code, 200)
		self.assertTrue(int(rv.headers['Content-Length']) > 500)
	
	# ----------------------------------------------- Utility Methods -

	def test_base_view(self):
		self.expect_view_200('/')

	def test_robots_view(self):
		rv = self.app.get('/robots.txt')
		self.assertEqual(rv.status_code, 200)
		self.assertTrue(int(rv.headers['Content-Length']) > 50)

	def test_admin_view(self):
		# admin view is protected with basic auth
		rv = self.app.get('/admin')
		self.assertEqual(rv.status_code, 401)
		rv = self.app.get('/admin', headers=self.basic_auth_headers())
		self.assertEqual(rv.status_code, 200)
		self.assertTrue(int(rv.headers['Content-Length']) > 500)
