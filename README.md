eat-healthy-NYC
==============

New York City Department of Health BigApps challenge

It's alive: <http://eat-healthy-nyc.herokuapp.com>

Running Locally
---

* Clone repo 

```
$ git clone https://github.com/aberke/eat-healthy-NYC.git
$ cd /eat-healthy-NYC
```

* Create a virutual environment so that the following installations do not cause conflicts.  Make sure to reactivate this virtual environment each time you want to run the server locally.  All the following installations will be isolated in this environment.

```
$ pip install virtualenv
$ virtualenv venv
$ source venv/bin/activate
```

* Install dependencies: ```$ pip install -r requirements.txt``` (may need to run with sudo)

* Run server ```python run.py``` and visit <http://127.0.0.1:5000>




data
---
state-farmers-markets.csv from https://data.ny.gov/Economic-Development/Farmers-Markets-in-New-York-State/qq4h-8p86


TODO
---

- normalize date/time data
	- IMPLEMENT normalize_datetime

- make markers that represent markets not open today a lower opacity
	- on creation of market, give open boolean

- limit API use to just my IPs

- /admin page for creating new competitions



































