#********************************************************************************
#--------------------------------------------------------------------------------
#
#
# 	Author: Alexandra Berke (aberke)
# 	Written: Summer 2014
#
#
# 	/data/sanitizers.py 
#
# 	state-farmers-markets IS not (verified) a complete superset of farmers-markets-2014
#
#--------------------------------------------------------------------------------
#*********************************************************************************

import re
import calendar
from datetime import date

# this is what's returned
KEYNAME_VALUE_DICTIONARY = {
	"Address Line 1": str,
	"address-line-1": str,
	"CSWCKs": bool,
	"City": str,
	"Contact": str,
	"EBT": bool,
	"FMNP": bool,
	"Latitude": str,
	"Longitude": str,
	"Market Link": str,
	"Phone": str,
	"State": str,
	"Stellar": bool,
	"zipcode": str,
	"county": str,
	"location": str,
	"name": str,

	"days": dict,
	"operation-hours": str,
	"operation-months": str,
	"YR": bool,
	"open-date": bool,
	"close-date": bool,
	"bad-hours-data": bool,
	"bad-date-data": bool,
}

KEYNAME_CONVERTER_DICT = {
	"Market Name": "name",
	"Address Line 1": "address-line-1",
	"Zip": "zipcode",

	# a bough has the same boundaries as a county of the state
	"Borough": "county",
	"County": "county",

	"Location": "location",
	"Street Address": "location",

	"Accept EBT": "EBT",
	"EBT/SNAP": "EBT",
}
VALUE_CONVERTER_DICT = {
	"Yes": True,
	"Y": True,

	"No": False,
	"N": False,
}


# for date normalizing
YEAR = date.today().year
MONTHS_LIST = ['January','February','March','April','May','June','July','August','September','October','November','December']
DAYS_LIST = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]



def normalize_datetime(datum):
	"""
	@param {dictionary} of datum
		Disorganized, redundant keys like Day(s),Hours of operation,Operation Hours,Operation Season,Operating Months,

	Give datum key/values:
		Human Readable Text [string]:
			operation-hours: 	Operation Hours | (Day(s) + Hours of operation)
			operation-months: 	Operation Season
		Code Readable:
			days: {				// sparse dictionary: {day [int]: time-open [string]} <- Sunday=0, Monday=1,..
				0: 11am-6pm,
				i: str, for each i where market is open 
			}
			bad-days-data: boolean, // if couldn't extract hours - use operation-hours instead
			open-date: { // : null if YR==True
				month: 	int,
				date:	int,
			}
			close-date: { // : null if YR==True
				month: 	int,
				date:	int,
			}
			YR: boolean
			bad-date-data: boolean -- use operation-months instead


	Day(s),Hours of operation,
	Wed & Sat,9am - 5pm ,
	Fri,8am - 4pm,
	"Mon, Wed, Fri & Sat",8am - 6pm,

	Operation Hours,Operation Season,Operating Months,
	Fri 11am-12:15pm,Year-round,YR,
	Thu - Tue 11am-6pm Sat/Sun 10am-2pm,July 1 - September 1,M,
	Saturday  9am-1pm,May 3 - October 25,P/M,
	Tue/Fri  8am-4pm,June 3 - October 31,M,
	"""
	# Human Readable Text first
	# add operation-hours
	datum["operation-hours"] = None
	if "Operation Hours" in datum:
		datum["operation-hours"] = datum["Operation Hours"]
	elif ('Day(s)' in datum and 'Hours of operation' in datum):
		datum["operation-hours"] = datum["Day(s)"] + datum["Hours of operation"]

	# add operation-months
	datum["operation-months"] = None
	if "Operating Months" in datum:
		datum["operation-months"] = datum["Operation Season"]

	# Code Readable:
	# add days
	datum = add_days(datum)
	datum = add_open_close_date(datum)
	return datum

def add_open_close_date(datum):
	# if Year-round then say so and return early
	if "Operation Season" in datum and datum["Operation Season"] == "Year-round":
		datum["YR"] = True
		return datum
	elif "Operating Months" in datum and datum["Operating Months"] == "YR":
		datum["YR"] = True
		return datum
	# otherwise determine bad datum or extra out open-date and close-date
	elif not "Operation Season" in datum:
		datum["bad-date-data"] = True
		return datum 

	# goal: parse date of format "May 3 - October 25" into open-date, close-date dictionaries

	season = datum["Operation Season"]
	season_split = season.split('-')
	if len(season_split) != 2:
		datum["bad-date-data"] = True
		return datum 
	open_string = season_split[0]
	close_string = season_split[1]

	# set open-date dictionary
	datum["open-date"] = get_date_object(open_string)
	datum["close-date"]= get_date_object(close_string)
	# if either objects returned are empty dictionaries, mark as bad data
	if not (datum["open-date"] and datum["close-date"]):
		datum["bad-date-data"] = True	

	return datum

def get_date_object(string):
	"""
	Helper method to add_open_close_date
	parse date of format "May 3 " into date object
	Defaults day to last day of the specified month

	@param {str} of form "May 3 " or "October"
	Returns {dictionary} date_object of form {month: int, date: int}
			None if couldn't parse out Month
	"""
	for i in range(len(MONTHS_LIST)):
		if MONTHS_LIST[i] in string:
			date = ''.join(x for x in string if x.isdigit())
			if not date:
				# default to the last day of the month
				date = calendar.monthrange(YEAR, i + 1)[1] # since my months are zero-indexed but monthrange not zero-indexed
			
			return {
				"month": i,
				"date": int(date),
			}
	return None



def add_days(datum):
	# extract hours
	if not "Hours of operation" in datum:
		datum['bad-hours-data'] = True
		return datum
	hours_string = datum["Hours of operation"]

	if "Day(s)" in datum:
		days_string = datum["Day(s)"]
	elif "Operation Hours" in datum:
		days_string = datum["Operation Hours"]
	else:
		datum['bad-hours-data'] = True
		return datum

	# initialize days
	datum["days"] = {} # { day[int]: hours[string] }

	# map each day[int] to hours_string
	for i in range(len(DAYS_LIST)):
		day = DAYS_LIST[i]
		if day in days_string:
			datum["days"][i] = hours_string

	return datum


def clean(data_set):
	"""
	Main function for the sanitizers.py file

	1) combine redundant keys & standardize key/value pair names
	2) Add key/value pairs for better datetime data
			"days": dict,
			"operation-hours": str,
			"operation-months": str,
			"YR": bool,
			"open-date": bool,
			"close-date": bool,
			"bad-hours-data": bool,
			"bad-date-data": bool,
	3) Remove unnecessary key/value pairs 
	"""
	for datum in data_set:
		for (keyname, value) in datum.items():
			datum.pop(keyname)
			
			if keyname in KEYNAME_CONVERTER_DICT:
				keyname = KEYNAME_CONVERTER_DICT[keyname]
			
			if value in VALUE_CONVERTER_DICT:
				value = VALUE_CONVERTER_DICT[value]
			datum[keyname] = value
		
		datum = normalize_datetime(datum)

		# last thing is to remove the keynames don't need
		for keyname in datum.keys():
			if not keyname in KEYNAME_VALUE_DICTIONARY:
				datum.pop(keyname)
	return data_set




def get_market_name(datum):
	"""
	@param: {dictionary} datum from which to extract market name value
	Returns: {str} market name
	Datasets have different keys mapping to market name 
	Extract the market name (presumably unique across all markets)
	"""
	if not 'Market Name' in datum and datum('Market Name'):
		raise Exception("There is a farmers-market data_set without key 'name' or 'Market Name'")

	return datum['Market Name']








