#!/usr/bin/env ruby
require 'mechanize'
require 'byebug'
require 'date'
require 'csv'
require 'json'

DATE = Date.today.strftime('%Y-%m-%d')
TIME = DateTime.now.strftime('%I:%M %p')

DATA_URL = 'https://e7p503ngy5.execute-api.us-west-2.amazonaws.com/prod/GetPublicStatewideData'
COUNTY_URL = 'https://e7p503ngy5.execute-api.us-west-2.amazonaws.com/prod/GetCounties'
DATA_CSV = 'data/data2.csv'.freeze

HEADERS =
  ["date", "time", "cvDataId", "created", "updated", "archived", "cases",
   "tests", "totalHospitalizations", "currentHospitalizations", "deaths",
   "recovered", "male", "female", "genderNR", "0-9", "10-19", "20-29", "30-39",
   "40-49", "50-59", "60-69", "70-79", "80-89", "90+", "ageNR", "amInd",
   "asian", "black", "hawaiian", "unknown", "other", "white", "hispanic"]

COUNTY_HEADERS =
  ["cases", "deaths", "tests", "0-9", "10-19", "20-29", "30-39", "40-49",
   "50-59", "60-69", "70-79", "80-89", "90+", "male", "female"]

COUNTIES =
  ["Bernalillo", "Catron", "Chaves", "Cibola", "Colfax", "Curry", "De_Baca",
   "Dona_Ana", "Eddy", "Grant", "Guadalupe", "Harding", "Hidalgo", "Lea",
   "Lincoln", "Los_Alamos", "Luna", "McKinley", "Mora", "Otero", "Quay",
   "Rio_Arriba", "Roosevelt", "San_Juan", "San_Miguel", "Sandoval", "Santa_Fe",
   "Sierra", "Socorro", "Taos", "Torrance", "Union", "Valencia"]

class User
  attr_accessor :body, :counties, :agent

  def initialize
    @agent = Mechanize.new
    @agent.user_agent_alias = 'Linux Mozilla'
    @agent.redirect_ok = true
    @body = get_data
    @counties = get_counties
  end

  def get_data
    landing_page = @agent.get(DATA_URL)
    JSON.parse(landing_page.body)['data']
  end

  def get_counties
    landing_page = @agent.get(COUNTY_URL)
    JSON.parse(landing_page.body)['data']
  end
end

def clean_string(str)
  str.gsub('ñ','n').gsub(' ','_')
end

def return_covid19_results
  data_csv = CSV.read(DATA_CSV)
  print data_csv
end

def save_data
  user = User.new
  CSV.open(DATA_CSV, 'a') do |csv|
    # csv << HEADERS if csv.count == 0
    csv << [DATE, TIME] + user.body.values
  end

  COUNTIES.each do |county|
    CSV.open("data/counties/#{clean_string(county)}.csv", 'a') do |csv|
      data = user.counties.detect { |cc| clean_string(cc['name']) == county }
      csv << [DATE, TIME] + COUNTY_HEADERS.map { |ch| data[ch] }
    end
  end
end

def process(save_records = true)
  save_records ? save_data : return_covid19_results
end

save_records = true
process(save_records)
