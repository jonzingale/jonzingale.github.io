import urllib3
from bs4 import BeautifulSoup
from pdb import set_trace as st
import json
import csv

LAMBDA = '426925'

# Are These the same guy?
POPEY31 = '579859'
KAPAHULU = '635266'

# likely a moderator smurf
LAMKARFAI = 334676, 633088

# Does this guy Smurf?
INCE = 241720

# A truely rude player:
# https://online-go.com/game/17504419
HOTANDUP: '17486746' # ALSO AN INTENTIONAL ELO BALANCER. 

# These are the same guy. Need to unblock to read game toxicity
SAME_PLAYERS = {'rudeGuy': [596941, 600314, 586319, 633088], 
                619007: [609138],
                'AX.SN': [609242, 609459, 611043, 619005, 619007],
                }

# Why Bans
WHYBAN1 = 617300
WHYBAN2 = 618248
WHYBAN3 = 618772

HOST_URL = 'https://online-go.com'
GAME_HISTORY_URL = HOST_URL + "/api/v1/players/%s/games?ordering=-ended"
GAME_DETAIL = HOST_URL + '/api/v1/games/%s'
PLAYER_DETAIL = HOST_URL + '/api/v1/players/%s'

RATING_HISTORY = "https://online-go.com/termination-api/player/%s/rating-history?speed=overall&size=0"
BLOCKS = "https://online-go.com/api/v1/me/blocks"

EXAMPLE_GAME = HOST_URL + '/api/v1/games/17648937'
EXAMPLE_PLAYER = HOST_URL + '/api/v1/players/426925'

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class Graph:
  def __init__(self):
    self.json = {}
    self.edges = self.json.values()
    self.nodes = self.json.keys()

  # subgraph :: {user_stub: [user_stubs]}
  def add_subgraph(self, node, edges):
    self.json[node] = edges

class Agent:
  def __init__(self, user):
    self.user = user
    self.http = urllib3.PoolManager()
    self.ratings = self.rating_history(user)
    self.graph = Graph()
    self.walk_network(user, 2)
    self.writeJSON()

  def writeJSON(self):
    encoder = json.JSONEncoder()
    file = open("./opponents_of_%s.json" % self.user, "w")
    file.write(encoder.encode(self.graph.json))
    file.close()

  def get_opponents(self, user, ops={}):
    ratings = self.rating_history(user) # unique ids
    for row in ratings: ops[row['opponent_id']] = None
    return(list(ops.keys()))

  def walk_network(self, node, radius): # write hard limit somehow
    # time.sleep(2) # find an appropriate throttle
    if (radius > 0):
      ops = self.get_opponents(node)
      # limit leaves for a node
      if (radius <= 1): ops = ops[0:5]
      self.graph.add_subgraph(node, ops)
      for opponent in ops:
        self.walk_network(opponent, radius-1)

  def rating_history(self, user):
    html = self.http.request('GET', RATING_HISTORY % user)
    page = BeautifulSoup(html.data, features="lxml")

    # ordered data rather than csv.reader: data[0]['game_id']
    dictCsv = csv.DictReader(page.p.text.splitlines(), delimiter='\t')
    return dictCsv

  def game_history(self, user):
    jsonDec = json.JSONDecoder()
    file = open("./game_history_%s.json" % user, "w")
    html = self.http.request('GET', GAME_HISTORY_URL % user)
    page = BeautifulSoup(html.data, features="lxml")
    p_tag = page.body.find_all('p')
    data = jsonDec.decode(p_tag[0].contents[0])
    # res = data['results'][0] # pages
    data_writer(file, data)
    return data

  def data_writer(self, file, data):
    jsonEnc = json.JSONEncoder()
    file.write(jsonEnc.encode(data))

agent = Agent(POPEY31)
# st()


