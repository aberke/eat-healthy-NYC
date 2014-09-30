/*********************************************************************
----------------------------------------------------------------------

 	Author: Alexandra Berke (aberke)
 	2014
	NYC




	Menu Controller

----------------------------------------------------------------------
*********************************************************************/


var mainViewContainer = {
	'element': null,
	'collapsed': false
};

function initMenuController() {
	
	mainViewContainer.element = document.getElementById('main-view-container');
}

function toggleMenu() {

	if (mainViewContainer.collapsed) {
		mainViewContainer.element.className = '';
	} else {
		mainViewContainer.element.className = 'collapsed';

	}
	mainViewContainer.collapsed = !mainViewContainer.collapsed;
}




initMenuController();