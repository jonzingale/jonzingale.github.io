# import urllib3
# from bs4 import BeautifulSoup
from pdb import set_trace as st
import json
import csv

# urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Parse Amazon purchases, and display books
# in a clever way. Consider using LCC for classification.

class Graph:
  def __init__(self):
    self.json = {}
    self.edges = self.json.values()
    self.nodes = self.json.keys()

  # subgraph :: {user_stub: [user_stubs]}
  def add_subgraph(self, node, edges):
    self.json[node] = edges

class Agent:
  def __init__(self):
    self.http = urllib3.PoolManager()
    self.csvData = self.parseCSV()
    self.graph = Graph()
    self.writeJSON()

  def writeJSON(self):
    encoder = json.JSONEncoder()
    file = open("./opponents_of_%s.json" % self.user, "w")
    file.write(encoder.encode(self.graph.json))
    file.close()

  def parseCSV(self, user): #### Write this correctly.
    file = open("./opponents_of_%s.json" % self.user, "r")
    page = BeautifulSoup(file.data, features="lxml")

    # ordered data rather than csv.reader: data[0]['game_id']
    dictCsv = csv.DictReader(page.p.text.splitlines(), delimiter='\t')
    return dictCsv

  def data_writer(self, file, data):
    jsonEnc = json.JSONEncoder()
    file.write(jsonEnc.encode(data))

agent = Agent()


