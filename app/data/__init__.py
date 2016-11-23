#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (aberke)
# 	Written: 2014
#
#
# Command Line Interface
# ------------------------------------------------
#
# To [re]initialize markets data:
# initialize_markets(environment=ENVIRONMENT)
#
# Example:
# initialize all markets in production:
# initialize_markets(environment=PRODUCTION)
#
# -------------------------------------------------
#
# Builds list of dictionaries of form:
# {"name": "Union Square Greenmarket",

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
# "Stellar": false}
#--------------------------------------------------------------------------------
#*********************************************************************************

import csv
import re

from config import FARMERS_MARKETS_DATA_FILEPATH
import database
import sanitizers


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
	database.drop_all(db=db)
	# (2)
	data = build_data()
	# (3)
	db.markets.insert(data)

#---------------------------------------------------- Command Line Interface -


def build_data():
	(keyname_list, data_rows) = get_csv_data(FARMERS_MARKETS_DATA_FILEPATH)
	data = csv_data_to_dict(keyname_list, data_rows)
	return sanitizers.clean(data)


def get_csv_data(filename):
	""" 
	Reads csv data from filename; assumes first row of csv file is
	list of keynames.

	Returns tuple (keyname_list, data_rows) 		
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
