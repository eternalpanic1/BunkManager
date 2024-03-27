import pyrebase
import json


file = open('config.json')
firebaseConfig = json.load(file)

firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()

response = db.child('users').child('panicmonster30').get()

print(response.val()['data'])