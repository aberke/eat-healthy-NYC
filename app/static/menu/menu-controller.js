/*********************************************************************
----------------------------------------------------------------------

 	Author: Alexandra Berke (aberke)
 	2014
	NYC

	Menu Controller

----------------------------------------------------------------------
*********************************************************************/

MenuController = function($scope) {

	var mainViewContainer = {
		'element': null,
		'collapsed': false
	};

	function initMenuController() {
		
		mainViewContainer.element = document.getElementById('main-view-container');
	}

	$scope.toggleMenu = function() {

		if (mainViewContainer.collapsed) {
			mainViewContainer.element.className = '';
		} else {
			mainViewContainer.element.className = 'collapsed';

		}
		mainViewContainer.collapsed = !mainViewContainer.collapsed;
	}

	initMenuController();
}