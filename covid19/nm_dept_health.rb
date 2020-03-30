require 'mechanize'
require 'csv'

URL = 'https://cv.nmhealth.org/'
DATA_CSV = 'nm_dept_health.csv'
HEADERS = %w[positive negative total_tests deaths]
DATA_ROW_SEL = '//div[@class="et_pb_text_inner"]//table/tbody/tr/td[2]'

agent = Mechanize.new
agent.redirect_ok = true
page = agent.get(URL)

data = page.search(DATA_ROW_SEL)
clean_data = data.map { |val| val.text.gsub(',','').to_i }

CSV.open(DATA_CSV, 'a+') do |csv|
  csv << HEADERS if csv.count == 0
  csv << clean_data
end
