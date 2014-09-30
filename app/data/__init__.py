#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (aberke)
# 	Written: Summer 2014
#
#
#
# End up returning list of dictionaries of form:
# ----------------------------------------------
# "City": "New York",
# "Contact": "Chelsea Whittaker",
# "CSWCKs": false,
# "EBT": true,
# "FMNP": true,
# "Latitude": "40.73712",
# "Longitude": "-73.99029",
# "Market Link": "http://www.grownyc.org",
# "Phone": "2127887476",
# "State": "NY",
# "Stellar": false,
# "YR": true,
# "zipcode": "10003",
# "county": "Manhattan",
# "days": {
# 	"1": "8am - 6pm",
# 	"3": "8am - 6pm",
# 	"5": "8am - 6pm",
# 	"6": "8am - 6pm"
# },
# "location": "Broadway & E 17th St",
# "name": "Union Square Greenmarket",
# "operation-hours": "M/W/F/Sat  8am-6pm",
# "operation-months": "Year-round"
#
#
# state-farmers-markets IS NOT a complete superset of farmers-markets-2014
#
#--------------------------------------------------------------------------------
#*********************************************************************************


import csv
import re
import sanitizers
import database

DATA_FILES = ['./app/data/farmers-markets-2014.csv', './app/data/state-farmers-markets.csv']



def get_csv_data(filename):
	""" 
	Read csv data from filename.  Return tuple (keyname_list, data_rows) 
		assumes first row of csv file is list of keynames.
	"""
	keyname_list = []
	data_rows = []
	with open(filename,'r') as f:
		reader = csv.reader(f)
		keyname_list = reader.next()
		for row in reader:
			data_rows.append(row)
	return (keyname_list, data_rows)


def csv_data_to_dict(keyname_list, data_rows):
	data = []
	for data_row in data_rows:
		d = {}
		for i in range(len(keyname_list)):
			keyname = keyname_list[i]
			value = data_row[i]
			d[keyname] = value
		data.append(d)
	return data


def combine_data(data_sets):
	""" 
	Takes list of datasets, where each dataset is a dict such as that returned by csv_data_to_dict
	Combines on 'Market Name' key - assumes Market Name is unique and exists in each data_set
	"""
	master_data = {} # {name: data_set}
	for data_set in data_sets:
		for datum in data_set:
			market_name = sanitizers.get_market_name(datum)
			if market_name in master_data:
				master_data[market_name].update(datum)
			else:
				master_data[market_name] = datum
	return [master_data[market_name] for market_name in master_data.keys()]


def build_data():
	datasets = []
	for filename in DATA_FILES:
		(keyname_list, data_rows) = get_csv_data(filename)
		data = csv_data_to_dict(keyname_list, data_rows)
		datasets.append(data)

	# must combine data before cleaning to properly normalize date data
	data = combine_data(datasets)
	data = sanitizers.clean(data)
	return data



#- RESTful Interface ---------------------------------------------------------

def get_markets():
	db = database.get_db()
	markets = db.markets.find()
	return [m for m in markets]

#--------------------------------------------------------- RESTful Interface -


#- Command Line Interface ----------------------------------------------------

# To clear all data from a given environment:
# clear_markets(environment=ENVIRONMENT)

# To [re]initialize markets data:
# initialize_markets(environment=ENVIRONMENT)

# Example:
# initialize all markets in production:
# initialize_markets(environment=PRODUCTION)



def clear_markets(environment=None):
	""" Delete all documents in markets collection """
	(client, db) = database.connect(environment=environment)
	db.markets.remove()
	client.disconnect()


def initialize_markets(environment=None):
	"""
	Build up data from the csv files and initialize the markets 
	collection in the mongo database to match the csv files data
	
	(1). Clear markets collection in database
	(2). Build data
	(3). Insert data into markets collection
	"""
	# (1)
	clear_markets(environment=environment)
	# (2)
	data = build_data()
	# (3)
	(client, db) = database.connect(environment=environment)
	ret = db.markets.insert(data)
	client.disconnect()

#---------------------------------------------------- Command Line Interface -





