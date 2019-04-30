import urllib3
from bs4 import BeautifulSoup
from pdb import set_trace as st
import json

LAMBDA = '426925'
HOST_URL = 'https://online-go.com'
GAME_HISTORY_URL = HOST_URL + "/api/v1/players/%s/games?ordering=-ended"
GAME_DETAIL = HOST_URL + '/api/v1/games/%s'
PLAYER_DETAIL = HOST_URL + '/api/v1/players/%s'

EXAMPLE_GAME = HOST_URL + '/api/v1/games/17648937'
EXAMPLE_PLAYER = HOST_URL + '/api/v1/players/426925'

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

res = agent.data['results'][0] # pages?

st()

game = {'related': {'detail': '/api/v1/games/17648937'}, 
 'players': 
    {'white': {'id': 411607, 'username': 'orcaminer.usa', 
               'country': 'un', 'icon': 'https://secure.gravatar.com/avatar/403738dd6a63578820212b2a86aba9b5?s=32&d=retro',
               'ratings': {'overall': {'deviation': 91.7285403615859, 
               'rating': 2088.1909699271955, 'volatility': 0.05854619590012114, 
               'games_played': 729}}, 'ranking': 21, 'professional': False, 
               'ui_class': 'timeout'},
      
      'black': {'id': 426925, 'username': 'λx.Sx', 'country': '_GoT_Targaryen',
      'icon': 'https://b0c2ddc39d13e1c0ddad-93a52a5bc9e7cc06050c1a999beb3694.ssl.cf1.rackcdn.com/38923c479d6c277e26825a19459d0e13-32.png',
      'ratings': {'overall': {'deviation': 83.53317818205974, 
      'rating': 1896.354714747458, 'volatility': 0.06740009487316265,
      'games_played': 7239}}, 'ranking': 20, 'professional': False,
      'ui_class': 'timeout'}},

      'id': 17648937, 'name': 'Friendly Match',
      'creator': 426925, 'mode': 'game', 'source': 'play', 'black': 426925,
      'white': 411607, 'width': 13, 'height': 13, 'rules': 'aga', 'ranked': True,
      'handicap': 0, 'komi': '5.50', 'time_control': 'simple',
      'black_player_rank': 17, 'black_player_rating': '858.685',
      'white_player_rank': 18, 'white_player_rating': '940.412',
      'time_per_move': 15,

      'time_control_parameters': '{"time_control": "simple", "speed": "live", "system": "simple", "pause_on_weekends": false, "per_move": 15}', 'disable_analysis': False, 'tournament': None, 'tournament_round': 0, 'ladder': None, 'pause_on_weekends': False,
      'outcome': 'Resignation', 'black_lost': True, 'white_lost': False, 
      'annulled': False, 'started': '2019-04-29T23:02:46.277030Z', 
      'ended': '2019-04-29T23:11:45.070933Z', 
      'sgf_filename': None, 
      'historical_ratings': 

      {'white': {'username': 'orcaminer.usa', 
      'ratings': {'overall': {'deviation': 85.50547790527344, 
      'rating': 2061.86669921875, 'volatility': 0.05865965411067009}}, 
      'ranking': 21, 'country': 'orcaminer.usa', 'professional': False, 
      'ui_class': 'timeout', 'id': 411607, 
      'icon': 'https://secure.gravatar.com/avatar/403738dd6a63578820212b2a86aba9b5?s=32&d=retro'}, 

      'black': {'username': 'λx.Sx', 
      'ratings': {'overall': {'deviation': 86.05702209472656, 
      'rating': 1896.7703857421875, 'volatility': 0.06741587072610855}}, 
      'ranking': 20, 'country': 'λx.Sx', 'professional': False,
      'ui_class': 'timeout', 'id': 426925,
      'icon': 'https://b0c2ddc39d13e1c0ddad-93a52a5bc9e7cc06050c1a999beb3694.ssl.cf1.rackcdn.com/38923c479d6c277e26825a19459d0e13-32.png'}}}

