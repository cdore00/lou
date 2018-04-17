#!/usr/bin/env python
#C:\Users\cdore\AppData\Local\Programs\Python\Python36-32
#   python3 basehttprequesthandler post save file


#import pdb; pdb.set_trace()
import sys, os, time, re, cgi, urllib.parse, urllib.request
import smtplib

from http.server import BaseHTTPRequestHandler, HTTPServer
from cgi import parse_header, parse_multipart
from socket import gethostname, gethostbyname 
from urllib.parse import urlparse, parse_qs
from sys import argv
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
MAIL_USER = 'charles.dore@nexio.com' 

from io import BytesIO

#HOSTserv = 'http://127.0.0.1:3000/'
HOSTclient = "https://loupop.ddns.net/";

#Log file
LOG_DIR =os.getcwd() + '/log'
if not os.path.exists(LOG_DIR):
	os.makedirs(LOG_DIR)
LOG_FILE = 'log/' + str(int(time.time())) + '.log'
print(os.getcwd())
print("LOg file: " + LOG_DIR)
IMG_DIR = LOG_DIR + "/"
IMG_URL = "file:///" + IMG_DIR
global logPass 
logPass = ""
if os.getenv('PINFO') is not None:
	logPass = os.environ['PINFO']

# MongoDB
import pymongo
from pymongo import MongoClient

if os.environ.get('MONGODB_USER'):
	port = int(os.environ['MONGODB_PORT'])
	user = urllib.parse.quote_plus(os.environ['MONGODB_USER'])
	passw = urllib.parse.quote_plus(os.environ['MONGODB_PASSWORD'])
	domain = urllib.parse.quote_plus(os.environ['MONGODB_SERVICE'])
	dbase = urllib.parse.quote_plus(os.environ['MONGODB_DATABASE'])
	uri = "mongodb://%s:%s@%s/%s?authMechanism=SCRAM-SHA-1" % (user, passw, domain, dbase)
	IMG_DIR = "/data/lou/photos/"
	IMG_URL = HOSTclient + "/photos/"
else:
	port = 27017
	uri = "mongodb://localhost"

client = MongoClient(uri, port)
data = client['resto']
#if "user" in locals():
#	data.authenticate(user, passw)

print(str(data))
from bson import ObjectId
from bson.json_util import dumps
from bson.json_util import loads
import json


# HTTPRequestHandler class
class golfHTTPServer(BaseHTTPRequestHandler):
	
	@staticmethod
	def call_Func(strURL):
		pos = strURL.find("?")
		if pos == -1:
		  func = strURL[0:]
		else:
		  func = strURL[0:pos]
		fpart = os.path.split(func)
		func = fpart[len(fpart)-1]
		print("Funct=" + func + "\n")
		return func
	
	@staticmethod
	def return_Res(self,mess):
		if isinstance(mess, (int)) and mess == False:
			return
		else:
			#pdb.set_trace()
			# Send response status code
			self.send_response(200)
			# Send headers
			self.send_header('Content-type','text/html')
			self.send_header('Access-Control-Allow-Origin', '*')
			#  Set cookie
			#self.send_header('Set-Cookie','superBig=zag;max-age=31536000')
			self.end_headers()
			# Write content as utf-8 data
			self.wfile.write(bytes(mess, "utf8"))
			
			return

	# GET
	def do_GET(self):
		"""Manage GET request received"""

		# Send message back to client
		query_components = parse_qs(urlparse(self.path).query)
		url = self.path
		print("GET " + url)
		message = case_Func(self.call_Func(url), query_components, self)
		self.return_Res(self,message)
		return

		
	# POST	
	def do_POST(self):
		"""Manage POST request received"""
		
		#pdb.set_trace()

		content_length = int(self.headers['Content-Length'])
		if content_length != 0:
			form = cgi.FieldStorage(
					 fp=self.rfile,
					 headers=self.headers,
					 environ={"REQUEST_METHOD": "POST","CONTENT_TYPE": self.headers['Content-Type']})
			if 'file' in form:
				message = addFile(form, self)
				self.return_Res(self,message)
				return

		#content_length = int(self.headers['Content-Length']) # <--- Gets the size of data
		#post_data = self.rfile.read(content_length) # <--- Gets the data itself

		# Send message back to client
		query_components = parse_qs(urlparse(self.path).query)
		if not query_components:
			query_components = ""
			#urllib.parse.parse_qsl(str(post_data.decode('utf-8')))
		url = self.path
		print("POST " + url)
		message = case_Func(self.call_Func(url), query_components, self)
		self.return_Res(self,message)
		
		return		

#End class

def case_Func(fName, param, self):
	if fName == "ose":
		return(ose(self))
	elif fName == "listLog":
		return(listLog(param))
	elif fName == "app.js":
		return(writeCom(param))
	elif fName == "showLog":
		return(showLog(param))
	elif fName == "getNews":
		return(getNews(param))		
	elif fName == "writeNews":
		return(writeNews(param))
	elif fName == "listNews":
		return(listNews(param))	
	elif fName == "addFile":
		return(addFile(param, self))			
	else:
		return("DB servCom" + str(param))


# Requests
def ose(self):
	print(logPass)
	ostxt = (os.environ)
	#print(str(ostxt))
	
	#f = open('workfile.txt', 'w')
	#f.write("testtt\n")
	#f.close()
	#f = open(LOG_DIR + '/myScore.csv','r')
	# Autre techique
	#x = json.dumps([1, 'simple', 'list'])
	#json.dump(x, f)
			
	log_Info('oseFunct')

	return(logPass)
	
def getID(strID):
	if len(strID) < 5:
		return int(strID)
	else:	
		return ObjectId(strID)
		
def cursorTOdict(doc):
	strCur = dumps(doc)
	jsonCur = loads(strCur)
	return dict(jsonCur[0])
	
def listNews(param):
	""" Return news list """
	coll = data['news']
	docs = coll.find({})
	return dumps(docs)

def getNews(param):
	""" Return news data for ID provided """
	if param:
		if param.get("id"):
			coll = data['news']
			o_id = ObjectId(param['id'][0])
			doc = coll.find({'_id': o_id})
			return dumps(doc[0])
		else:
			return dumps({'resp': {"result": 0} })	# No ID
	else:
		return dumps({'resp': {"result": 0} })	# No param
		
def addFile(form, self):
	""" Save file and Return URL """

	if 'type' in form:
		filename = form['file'].filename
		data = form['file'].file.read()
		typ = form['type'].file.read()
		print("Save image " + filename)
		if typ == "image":
			f = open(IMG_DIR + filename,'wb')
			print(IMG_DIR + filename)
		f.write(data)
		f.close()
	
	return dumps({"ok": 1, "url": IMG_URL + filename})

	
def writeNews(param):
	""" To add news to BD """
	if param:
		#print("Params= " + str(param))
		#pdb.set_trace()
		coll = data['news']
		if param.get("id") is None:
			docr = coll.insert({"title": param['title'][0] , "active": int(param['active'][0]), "date": param['date'][0] , "dateC": int(time.time()), "dateM": int(time.time()), "contentL": param['contentL'][0], "contentR": param['contentR'][0]}, {"new":True})
			o_id = str(ObjectId(docr))
			return dumps({"ok": 1, "id": o_id})
		else:
			o_id = ObjectId(param['id'][0])
			docr = coll.update_one({ '_id': o_id}, { '$set': {"title": param['title'][0] , "active": int(param['active'][0]), "date": param['date'][0], "dateM": int(time.time()) , "contentL": param['contentL'][0], "contentR": param['contentR'][0]}},  upsert=True )
			
			#doc=coll.update_one({"title": "tit3"}, {"$set": {"title": "tit4"}}, upsert=True)

			return dumps(docr.raw_result)
		#id_elem + "&title=" + f_title + "&active=" + ((f_active) ? "1":"0" ) + "&date=" + f_img_name + + "&content=" + htmlContent
		
	else:
		return dumps({'resp': {"result": 0} })	# No param

def writeCom(param):
	""" To add new user account """
	if param:
		#email = param["email"][0]
		print("GET " + str(param))
		#cur = dict(param)
		tmp = (readCommandQuery(param))
		#pdb.set_trace()
		
		writeToSheet(tmp)
		col = data['command']
		docs = col.find({})
		res = dumps(param)
		return res

	else:
		return dumps({'resp': {"result": 0} })	# No param

def readCommandQuery(query):
	""" Parse query data to insert in BD and email """
	param = dict(query)
	InfoArr = []
	M1 = []
	M3 = []
	
	def mailInfo(M1, M3, jour, valInfo):
		if len(valInfo) > 0:
			if jour == 1:
				M1.append(valInfo)
			if jour == 3:
				M3.append(valInfo)
	
	if 'L1' in param:
		M1info = param['L1'][0].split("$")
		M3info = param['L3'][0].split("$")
		M1.append(M1info[0])
		M3.append(M3info[0])
	
	InfoArr.append(int(time.time()))									#0 Time in second
	InfoArr.append(str(datetime.now().strftime('%Y-%m-%d %H:%M:%S')))	#1 Time label
	InfoArr.append(gethostbyname(gethostname()))						#2 IP address
	InfoArr.append(param['nam'][0] if 'nam' in param else "")			#3 Name
	InfoArr.append(param['adr'][0] if 'adr' in param else "")			#4 Address
	InfoArr.append(param['em'][0] if 'em' in param else "")				#5 email
	InfoArr.append(param['range'][0] if 'range' in param else "")		#6 ID for modification
	
	j = "1"
	#ind = 1
	for ind in range(10):
		i = str(ind)
		tmpVal = param[('J' + j + i)][0] if ('J' + j + i) in param else ""
		if len(tmpVal) > 0:
			InfoArr.append(tmpVal)
			mailInfo(M1, M3, int(j), tmpVal)
	
	return { "InfoArr": InfoArr, "m1": M1, "m3": M3, "m1info": param['L1'], "m3info": param['L3'] }


def writeToSheet(infoG3):
	InfoArr = infoG3['InfoArr']
	m1Info = infoG3['m1info']
	m3Info = infoG3['m3info']
	idInfo = infoG3['InfoArr'][6];

	infoVal = dumps(infoG3['InfoArr'])

	coll = data['command']
	
	choix=[x for x in InfoArr[7:]]
	info = { "1": m1Info, "3": m3Info }
  #try { 
	#// "IDBD" = ObjectID
	if len(idInfo) > 0:  # Update
		Mdata = formatMailData(HOSTclient, InfoArr[1], InfoArr[3], InfoArr[5], idInfo, infoG3['m1'], infoG3['m3'], m1Info[0], m3Info[0])
		confirmMail('Modification de la commande de ', InfoArr, Mdata);
		print('writeToSheet1')
	else:		# Append new
		doc = coll.insert_one({"Time": InfoArr[0] , "Date": InfoArr[1], "IP": InfoArr[2] , "Name": InfoArr[3], "Address": InfoArr[4], "email": InfoArr[5], "ID": idInfo, "Choix": choix, "info": info}, {"new":True}).inserted_id
		o_id = str(ObjectId(doc))
		Mdata = formatMailData(HOSTclient, InfoArr[1], InfoArr[3], InfoArr[5], o_id, infoG3['m1'], infoG3['m3'], m1Info[0], m3Info[0])
		confirmMail('Commande de ', InfoArr, Mdata);
		print('writeToSheet2')

	#catch (err) {
	 # console.log('Error writeToSheet End Node' + err.message);
	return str(ObjectId(doc))	# No param	# No param temporairement


def confirmMail(subject, InfoArr, Mdata):
	""" // Manage sheet update and send confirm email """
	send_email(InfoArr[3], InfoArr[5], subject, "", Mdata['Mbody'])
	#Mailer.sendMessage( res, InfoArr[3], InfoArr[5], Mdata.Mbody, '<h4 style="margin: 0;"><a target="_parent" href="' + Mdata.url + '">Courriel envoy&eacute;</a></h4>');	


# Manage logs

def log_Info(mess):
	ip = gethostbyname(gethostname()) 
	t = str(datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
	strMess = t + "\t" + ip + "\t" + mess + "\n"
	with open(LOG_FILE,'a') as f:
		f.write(strMess)

def listLog(param):

	if param:
		#print("call=" + str(param))
		#print("type=" + str(type(param)))
		res = dict(param)
		passw = ""
		if "pass" in res:
			passw = res["pass"]
		if logPass == passw:
			return(listLogs())
		else:
			log_Info('listLog Unauthorized: ' + passw)
			return('<h2>Unauthorized</h2>')
	else:
		htmlCode = '<!DOCTYPE html><html lang="en-CA"><head><meta name="viewport" content="width=device-width" /></head><body><form action="/listLog" method="post"><input type="password" name="pass"><input type="submit" name="submit"></form></body></html>'
		return(htmlCode)

def listLogs():

	fileList = os.listdir(LOG_DIR)
	cont = '<h2>Log files</h2>'
	for line in fileList:
		f = os.stat(LOG_DIR + '/' + line)
		t = time.ctime(f.st_ctime)
		s = f.st_size
		cont = cont + '<a target="_blank" href="./showLog?nam=' + line + '">' + line + "\t" + t + "\t" + str(int(s/1024) + 1) + " ko" '</a></br>'
	#print(fileList)
	return(str(cont))
	
def showLog(param):
	print(str(param))
	if param.get("nam"):
		fileName = param["nam"][0]
	lines = [line.rstrip('\n') for line in open(LOG_DIR + "/" + fileName)]
	f = os.stat(LOG_DIR + '/' + fileName)
	cont = '<h2>' + fileName + "  " + time.ctime(f.st_ctime) + '</h2>'
	for line in lines:
		cont = cont + line + '</br>'
	return(str(cont))

	

# Send mail
def sendRecupPassMail(eMail, name, passw):
	text = ''
	name = name if name != '' else eMail
	html = """\
	<html><body><div style="text-align: center;"><div style="background-color: #3A9D23;height: 34px;"><div style="margin: 3px;float:left;"><img alt="Image Golf du Québec" width="25" height="25" src="https://cdore00.github.io/golf/images/golf.png" /></div><div style="font-size: 22px;font-weight: bold;color: #ccf;padding-top: 5px;">Golfs du Qu&eacute;bec</div></div></br><p style="width: 100; text-align: left;">Bonjour %s,</p><p></p><p style="width: 100; text-align: left;">Votre mot de passe est : %s </p><p></p><p><div id="copyright">Copyright &copy; 2005-2017</div></p></div></body></html>
	"""  % (name, passw)
	fromuser = "Golf du Québec"
	subject = "Golf du Québec - Récupérer mot de passe de " + name 
	log_Info("Récupérer mot de passe de " + name + " : " + eMail)
	send_email(fromuser, eMail, subject, text, html)

def sendConfMail(link, email, name):

	recipient = email
	subject = "Golf du Québec - Confirmer l'inscription de cdore00@yahoo.com"
	
	fromuser = "Golf du Québec"

	# Create the body of the message (a plain-text and an HTML version).
	text = "Hi %s!\nCliquer ce lien pour confirmer l\'inscription de votre compte:\n%s\n\nGolf du Québec" % (name, link)
	print(text)
	html = """\
	<html><body><div style="text-align: center;"><div style="background-color: #3A9D23;height: 34px;"><div style="margin: 3px;float:left;"><img alt="Image Golf du Québec" width="25" height="25" src="https://cdore00.github.io/golf/images/golf.png" /></div><div style="font-size: 22px;font-weight: bold;color: #ccf;padding-top: 5px;">Golfs du Qu&eacute;bec</div></div></br><a href="%s" style="font-size: 20px;font-weight: bold;">Cliquer ce lien pour confirmer l\'inscription de votre compte:<p>%s</p> </a></br></br></br><p><div id="copyright">Copyright &copy; 2005-2018</div></p></div></body></html>
	""" % (link, email)
	send_email(fromuser, recipient, subject, text, html)

def formatMailData(HOST, laDate, userName, userMail, updRange, m1arr, m3arr, m1Info, m3Info):
	""" Format email to comfirm command or command modification"""
	#pdb.set_trace()
	formattedBody = "<p>Bonjour,</p><p>&nbsp;</p><p></br>Voici ma commande.</p><p>&nbsp;</p>"
	if len(m1arr) > 1:
		formattedBody += "<p>" + m1arr[0] + "</p><ul>"
		#for (var i=1; i < m1arr.length; i++)
		for i in range(len(m1arr)):
			formattedBody += "<li>" + m1arr[i] + "</li>"
		formattedBody += "</ul>";
		pos = m1Info.find("$")
		m1Info = m1Info[pos:]
	else:
		m1Info = ""

	if len(m3arr) > 1:
		formattedBody += "<p>" + m3arr[0] + "</p><ul>"
		for i in range(len(m3arr)):
			formattedBody += "<li>" + m3arr[i] + "</li>"
		formattedBody += "</ul>"
		#m3Info = m3Info.substring(m3Info.indexOf("$"))
		pos = m3Info.find("$")
		m3Info = m3Info[pos:]
	else:
		m3Info = ""

	formattedBody += "<p>&nbsp;</p><p>Merci,</p><p>" + userName + "</p><p>&nbsp;</p>"
	modURL = HOST + 'menu.html?rang=' + updRange + '$' + userMail + '$' + laDate + m1Info + m3Info 
	formattedBody += '<a href="' + modURL + '">Modifier ma commande</a>'

	return { "url": modURL, "Mbody": formattedBody }
	
	
def send_email(fromuser, recipient, subject, text, html):

	# Create message container - the correct MIME type is multipart/alternative.
	msg = MIMEMultipart('alternative')
	msg['Subject'] = subject
	msg['From'] = fromuser
	msg['To'] = recipient 

	# Record the MIME types of both parts - text/plain and text/html.
	part1 = MIMEText(text, 'plain')
	part2 = MIMEText(html, 'html')

	# Attach parts into message container.
	# According to RFC 2046, the last part of a multipart message, in this case
	# the HTML message, is best and preferred.
	msg.attach(part1)
	msg.attach(part2)

	mail = smtplib.SMTP('smtp.gmail.com', 587)
	mail.ehlo()
	mail.starttls()
	mail.login(MAIL_USER, logPass)
	mail.sendmail(fromuser, recipient, msg.as_string())
	mail.quit()


# Start server listening request
def run(server_class=HTTPServer, handler_class=golfHTTPServer, port=8080, domain = ''):
	# Server settings
	print(str(port))
	server_address = (domain, port)
	httpd = HTTPServer(server_address, handler_class)
	print('running server...(' + domain + ":" + str(port) + ')')
	httpd.serve_forever()
	return

def build_arg_dict(arg):
	argd = dict()
	def add_dict(item):
		i = 0
		for x in arg:
			if x == item:
			  argd[x] = arg[i+1]
			else:
			  i+= 1

	if "port" in arg:
		add_dict("port")
	if "domain" in arg:
		add_dict("domain")
	if "pass" in arg:
		add_dict("pass")
		
	#print("DIC=" + str(argd) + str(len(arg)) + str(len(argd)))
	if (len(arg) / 2) != len(argd):
		return False
	else:
		return argd

if __name__ == "__main__":
	print(argv[0])
	if len(argv) > 1:
		arg = [x for x in argv]
		del arg[0]
		param = build_arg_dict(arg)
		#print(str(param))
		if param:
			if "pass" in param:
				#global logPass 
				logPass = param["pass"]
			if len(argv) == 3 and "pass" in param:
				run()
			if "domain" in param and "port" in param:
				run(domain=(param["domain"]), port=int(param["port"]))
			elif "domain" in param:
				run(domain=(param["domain"]))
			elif "port" in param:
				run(port=int(param["port"]))
		else:
			print("[domain VALUE] [port VALUE] [pass VALUE]")
	else:
		run()


    
