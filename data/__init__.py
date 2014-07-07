#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (aberke)
# 	Written: Summer 2014
#
#
#--------------------------------------------------------------------------------
#*********************************************************************************


import csv


DATA_FILES = ['./data/farmers-markets-2014.csv', './data/state-farmers-markets.csv']
# keynames that are the compromise of multiple keynames
KEYNAMES = ["county", "name", "location", "hours", "EBT"]

KEYNAME_CONVERTER_DICT = {
	# a bough has the same boundaries as a county of the state
	"Borough": "county",
	"County": "county",

	"Market Name": "name",

	"Location": "location",
	"Street Address": "location",

	"Hours of operation": "hours",
	"Operation Hours": "hours",

	"Accept EBT": "EBT",
	"EBT/SNAP": "EBT",
}
VALUE_CONVERTER_DICT = {
	"Yes": "Y",
	"No": "No",
}

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
			if keyname in KEYNAME_CONVERTER_DICT:
				keyname = KEYNAME_CONVERTER_DICT[keyname]

			value = data_row[i]
			if value in VALUE_CONVERTER_DICT:
				value = VALUE_CONVERTER_DICT[value]

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
			if not ('name' in datum and datum['name']):
				raise Exception("There is a farmers-market data_set without key 'name' or 'Market Name'")
			
			market_name = datum['name']
			if market_name in master_data:
				master_data[market_name].update(datum)
			else:
				master_data[market_name] = datum
	return [master_data[market_name] for market_name in master_data.keys()]


def get_data():
	datasets = []
	for filename in DATA_FILES:
		(keyname_list, data_rows) = get_csv_data(filename)
		data = csv_data_to_dict(keyname_list, data_rows)
		datasets.append(data)
	return combine_data(datasets)



