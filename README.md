eat-healthy-NYC
==============

New York City Department of Health BigApps challenge

It's alive: <http://eat-healthy-nyc.herokuapp.com>


Functionality
---

- Every farmers' market in New York State is on this map
- As the key indicates, from a quick glance users can see which markets accept EBT and which don't
- Markets that are open today are opaque and highlighted, vs markets that are closed today are less opaque
	- So the markets that are open today are easy to see!
- On click of a market you can view its hours and more info
- You can get directions (walking/biking/transit/car) from your current location to a market


Running Locally
---

**Setting up/Running for the first time**

* Clone/fork repo 

```
$ git clone https://github.com/aberke/eat-healthy-NYC.git
$ cd /eat-healthy-NYC
```

* Create a virutual environment so that the following installations do not cause conflicts.  Make sure to reactivate this virtual environment each time you want to run the server locally.  All the following installations will be isolated in this environment.

```
$ sudo pip install virtualenv
$ virtualenv venv
$ source venv/bin/activate
```

* Install dependencies: ```$ pip install -r requirements.txt```

* Install mongo and run locally with ```$ mongod```

* Run server ```python run.py``` and visit <http://127.0.0.1:5000>


**Running again**

* Start virtual environment ```$ source venv/bin/activate```
* Run server ```python run.py``` and visit <http://127.0.0.1:5000>


**Development Mode**

- In ```/static/map.js``` uncomment ```DEVELOPMENT = true;```
	- Centers map on Union Square farmer's market
	- Useful when developing in remote location, say Cambridge MA


data
---

- state-farmers-markets.csv 
	- from https://data.ny.gov/Economic-Development/Farmers-Markets-in-New-York-State/qq4h-8p86
- farmers-markets-2014.csv
	- from eat healthy NYC

Data built from csv files and stored in Mongo DB database

**Data Commands**

Interface in ```/data/__init__.py```

- ```build_data()```
	- builds market data object from csv files
	- does not interact with database
- ```get_markets()```
	- RESTful GET - pulls all markets from database
- ```clear_markets(environment=None)```
	- clears all markets from database in environment
	- environment defaults to ```DEVELOPMENT```


TODO
---

- do better with open/closed status
	- check for open-date/close-date
	- better date parsing
	- Market.prototype.setOpenClosedStatus
		- uncomment and use h2 id='open-closed-title' OPEN | CLOSED /h2

- refactor javascript

- on get directions:
	- center map to where you are location
	- zoom out to show both destination and current location

- do better job sanitizing hours data
- on creation of market, give open boolean
- limit API use to just my IPs
- /admin page for creating new competitions


DESIGN TODO
---

- Nicer loading screen
- design for directions

































