import urllib3
from bs4 import BeautifulSoup
from pdb import set_trace as st
import json

LAMBDA = '426925'
GAME_HISTORY_URL = "https://online-go.com/api/v1/players/%s/games?ordering=-ended"

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class Agent:
  def __init__(self):
    self.http = urllib3.PoolManager()
    self.file = open("./game_history_%s.json" % LAMBDA, "w")
    self.data = self.make_request(LAMBDA)

  def make_request(self, user_stub):
    jsonDec = json.JSONDecoder()
    html = self.http.request('GET', GAME_HISTORY_URL % user_stub)
    page = BeautifulSoup(html.data, features="lxml")
    p_tag = page.body.find_all('p')
    data = jsonDec.decode(p_tag[0].contents[0])
    return data

  def data_writer(self):
    jsonEnc = json.JSONEncoder()
    self.file.write(jsonEnc.encode(self.data))

agent = Agent()
# agent.data_writer()

st()
