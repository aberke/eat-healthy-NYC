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

	def test_admin_view(self):
		self.expect_view_200('/admin')










