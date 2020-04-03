# https://www.kaggle.com/sudalairajkumar/novel-corona-virus-2019-dataset
require 'mechanize'
require 'csv'

DATA_CSV = 'covid_kaggle.csv'
URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQU0SIALScXx8VXDX7yKNKWWPKE1YjFlWc6VTEVSN45CklWWf-uWmprQIyLtoPDA18tX9cFDr-aQ9S6/pubhtml'
HEADERS = %w[NA 00s 10s 20s 30s 40s 50s 60s 70s 80s 90s 100s]

agent = Mechanize.new
agent.redirect_ok = true
page = agent.get(URL)

data = HEADERS.inject({}) {|accum, header| accum.merge!(header => 1) }

[5, 6, 0].each do |i|
  column = i == 0 ? 10 : 8
  rows = page.search('table')[i].search('tr').drop(2)

  rows.each do |tr|
    next if tr.text.nil?
    val = tr.at("td[#{column}]").text.to_i

    case val
    when 0
      data['NA'] += 1
    when 1..10
      data['00s'] += 1
    when 11..20
      data['10s'] += 1
    when 21..30
      data['20s'] += 1
    when 31..40
      data['30s'] += 1
    when 41..50
      data['40s'] += 1
    when 51..60
      data['50s'] += 1
    when 61..70
      data['60s'] += 1
    when 71..80
      data['70s'] += 1
    when 81..90
      data['80s'] += 1
    when 91..100
      data['90s'] += 1
    when 101..110
      data['100s'] += 1
    end
  end
end

CSV.open(DATA_CSV, 'a+') do |csv|
  csv << HEADERS if csv.count == 0
  csv << data.values
end

