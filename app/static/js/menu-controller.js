/*********************************************************************
----------------------------------------------------------------------

 	Author: Alexandra Berke (aberke)
 	2014
	NYC




	Menu Controller

----------------------------------------------------------------------
*********************************************************************/


function sayHi() {
	console.log("hi")
}

var mainViewContainer = {
	'element': null,
	'collapsed': false
};

function initMenuController() {
	console.log('menu-controller initialize')
	
	mainViewContainer.element = document.getElementById('main-view-container');
}

function toggleMenu() {
	console.log('toggleMenu')

	if (mainViewContainer.collapsed) {
		mainViewContainer.element.className = '';
	} else {
		mainViewContainer.element.className = 'collapsed';

	}
	mainViewContainer.collapsed = !mainViewContainer.collapsed;
}




initMenuController();