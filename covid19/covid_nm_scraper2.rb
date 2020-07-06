#!/usr/bin/env ruby
require 'mechanize'
require 'byebug'
require 'date'
require 'csv'
require 'json'

DATE = Date.today.strftime('%Y-%m-%d')
TIME = DateTime.now.strftime('%I:%M %p')

URL = 'https://e7p503ngy5.execute-api.us-west-2.amazonaws.com/prod/GetPublicStatewideData'
DATA_CSV = 'data/data2.csv'.freeze

HEADERS =
  ["date", "time", "cvDataId", "created", "updated", "archived", "cases",
   "tests", "totalHospitalizations", "currentHospitalizations", "deaths",
   "recovered", "male", "female", "genderNR", "0-9", "10-19", "20-29", "30-39",
   "40-49", "50-59", "60-69", "70-79", "80-89", "90+", "ageNR", "amInd",
   "asian", "black", "hawaiian", "unknown", "other", "white", "hispanic"]

class User
  attr_accessor :body, :agent

  def initialize
    @agent = Mechanize.new
    @agent.user_agent_alias = 'Linux Mozilla'
    @agent.redirect_ok = true
    @body = get_data
  end

  def get_data
    landing_page = @agent.get(URL)
    JSON.parse(landing_page.body)['data']
  end
end

def return_covid19_results
  data_csv = CSV.read(DATA_CSV)
  print data_csv
end

def save_data
  user = User.new
  CSV.open(DATA_CSV, 'w+') do |csv|
    csv << HEADERS if csv.count == 0
    csv << [DATE, TIME] + user.body.values
  end
end

def process(save_records = true)
  save_records ? save_data : return_covid19_results
end

save_records = true
process(save_records)
