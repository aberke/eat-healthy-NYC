#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (aberke)
# 	Written: 2014
#
#
#
# End up returning list of dictionaries of form:
# ----------------------------------------------
# "name": "Union Square Greenmarket",

# "Latitude": "40.73712",
# "Longitude": "-73.99029",
# "location": "Broadway & E 17th St",
# "City": "New York",
# "zipcode": "10003",
# "county": "Manhattan",
# "State": "NY",

# "YR": true,
# "days": {
# 	"1": {
# 		"start": "UTC-date",
# 		"end": "UTC-date"
# 	},
#  	"3": {
# 		"start": "UTC-date",
# 		"end": "UTC-date"
# 	},
# 	"5": {
# 		"start": "UTC-date",
# 		"end": "UTC-date"
# 	}
# },

# "operation-hours": "M/W/F/Sat  8am-6pm",
# "operation-months": "Year-round"

# "Contact": "Chelsea Whittaker",
# "Market Link": "http://www.grownyc.org",
# "Phone": "2127887476",
# "CSWCKs": false,
# "EBT": true,
# "FMNP": true,
# "Stellar": false
#
#--------------------------------------------------------------------------------
#*********************************************************************************


import csv
import re
import sanitizers
import database

DATA_FILES = ['./app/data/state-farmers-markets.csv']



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
	db = database.connect(environment=environment)
	# (1)
	database.drop_markets(database=db)
	# (2)
	data = build_data()
	# (3)
	db.markets.insert(data)

#---------------------------------------------------- Command Line Interface -





