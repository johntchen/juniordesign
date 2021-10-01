from flask import Flask
from os import listdir
from os.path import isfile, join
import json

app = Flask(__name__)

@app.route("/")
def hello_world ():
	return "<p>Hello, World!</p>"

@app.route("/applications")
@app.route("/applications/<name>")
def list_applications (name=None):
	mypath = "examples/Application_containers/"
	if name is not None:
		f = open (mypath + name, "r")
		data = f.read ()
		return data
	onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
	ret = { "type" : "application",
                 "containers" : onlyfiles
        }
	return json.dumps (ret)

@app.route("/input")
@app.route("/input/<name>")
def list_input (name=None):
	mypath = "examples/Input_containers/"
	if name is not None:
		f = open (mypath + name, "r")
		data = f.read ()
		return data
	onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
	ret = { "type" : "input",
                 "containers" : onlyfiles
        }
	return json.dumps (ret)

@app.route("/output")
@app.route("/output/<name>")
def list_output (name=None):
	mypath = "examples/Output_containers/"
	if name is not None:
		f = open (mypath + name, "r")
		data = f.read ()
		return data
	onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]
	ret = { "type" : "output",
                 "containers" : onlyfiles
        }
	return json.dumps (ret)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
