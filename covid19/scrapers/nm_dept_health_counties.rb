require 'mechanize'
require 'csv'

DATA_CSV = './../data/nm_dept_health_counties.csv'
LANDING_URL = 'https://cv.nmhealth.org/newsroom/'
UPDATE_URL_SEL = 'div[@id="recent-posts-2"]//li/a[@href]'
COUNTY_SEL = '//div[@class="entry-content"]/ul[1]/li'
COUNTY_REGEX = /(\d+).* in (\w+ ?\w*) County/

COUNTIES = [
  'Bernalillo','Catron','Chaves','Cibola','Colfax','Curry','De Baca','Doña Ana',
  'Eddy','Grant','Guadalupe','Harding','Hidalgo','Lea','Lincoln','Los Alamos',
  'Luna','McKinley','Mora','Otero','Quay','Rio Arriba','Roosevelt','San Juan',
  'San Miguel','Sandoval','Santa Fe','Sierra','Socorro','Taos','Torrance',
  'Union','Valencia'
]

# initialize county_data buckets
county_data = COUNTIES.inject({}) { |accum, county| accum.merge!(county => 0) }

agent = Mechanize.new # initialize crawler
page = agent.get(LANDING_URL) # get landing page with update links

link_url = page.at(UPDATE_URL_SEL).values[0] # Get newest update link
page = agent.get(link_url) # visit newest update page

county_text = page.search(COUNTY_SEL).map(&:text) # get new county numbers

# place scraped data into correct buckets
county_text.each do |county|
  mt = COUNTY_REGEX.match(county)
  key = COUNTIES.find { |cc| cc.include?(mt[2])}
  county_data[key] = mt[1]
end

# save data to csv
CSV.open(DATA_CSV, 'a+') do |csv|
  csv << COUNTIES if csv.count == 0
  csv << county_data.values
end
