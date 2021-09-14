import json
import networkx as nx
import matplotlib.pyplot as plt
from networkx_viewer import Viewer
import rglob

def read_json_file(file):
    with open(file) as f:
      data = json.load(f)
    return data

def from_json_to_graph (data, identification):
    record_trail=data[1]['Record trail']
    #print(data)
    #print (record_trail)
    G = nx.DiGraph()
    record=[]
    #print(len(record_trail['Container_name']))
    color_map=['blue']*len(record_trail['Container_name'])
    color_map[1]='orange'
    for i in range(0,len(record_trail['Container_name'])):
        G.add_node(record_trail[identification][i])
        G.nodes[record_trail[identification][i]]['1--UUID']=record_trail['UUID'][i]
        G.nodes[record_trail[identification][i]]['2--Container_name']=record_trail['Container_name'][i]
        G.nodes[record_trail[identification][i]]['5--Creation_time']=record_trail['Creation_time'][i]
        G.nodes[record_trail[identification][i]]['6--Modification_time']=record_trail['Modification_time'][i]
        record.append('['+record_trail['UUID'][i]+' '+record_trail['Container_name'][i]+']')
        G.nodes[record_trail[identification][i]]['color']=color_map[i]

    G.nodes[data[0]["org.label-schema.build-container_uuid"]]['4--Command_line']=data[-1]['Command_line']
    G.nodes[data[0]["org.label-schema.build-container_uuid"]]['3--Record_trail']=record

    list_G=list(G.nodes)
    #print(list_G)
    for i in range(len(list_G)-2):
        G.add_edge(list_G[i+1],list_G[i])
    G.add_edge(list_G[-1],list_G[1])
    return G

def plot_graph (G, attribute):
    pos = nx.spring_layout(G)
    labels = nx.get_node_attributes(G,attribute)
    color_map=['blue']*len(G)
    color_map[1]='orange'
    nx.draw(G, pos, node_color=color_map, with_labels=True)
    plt.show()

