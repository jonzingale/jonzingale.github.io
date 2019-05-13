from pdb import set_trace as st
import json

class Clusters:
  def __init__(self, file, data={}):
    with open(file) as json_file:  
      data = json.load(json_file)

    self.values = self.getClusters(data)

  def reducedData(self, data, clusters=[]):
    for value in data['clusters'].values():
      clusters.append(
        {'hex': value['hex'][0], 'rgb': value['rgb'], 
         'hsv': value['hsv'], 'percent': value['f']}
      )
    return(clusters)

  def getClusters(self, data, clusters=[]):
    clusters = self.reducedData(data)
    sortedClusters = sorted(clusters, reverse=True,
      key=lambda item: item['percent'])
    return(sortedClusters)


clusters = Clusters('umeboshiSummary.json')
print(clusters.values)
st()