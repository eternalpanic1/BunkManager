from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import pyrebase
import json


app = Flask(__name__)
app.secret_key = '\xfd{H\xe5<\x95\xf9\xe3\x96.5\xd1\x01O<!\xd5\xa2\xa0\x9fR"\xa1\xa8'

file = open('static\config.json')
firebaseConfig = json.load(file)

firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()


#attendance management routes
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/loadAttendance', methods=['GET', 'POST'])
def load_attendance():
    username = session['user']
    try:
        response = db.child('users').child(username).get().val()['data']
    except Exception as e:
        print(e.json().get('error', {}).get('message'))
    return jsonify(response)

@app.route('/saveAttendance', methods=['POST'])
def save_attendance():
    data = request.json
    username = session['user']
    try:
        db.child('users').child(username).update({'data': data})
    except Exception as e:
        print(e.json().get('error', {}).get('message'))
    return jsonify({'message': 'Attendance saved successfully GG!'})


@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        username = request.form['username']
        try:
            response = auth.create_user_with_email_and_password(email, password)
            user = response['localId']
            new_user = {
                'email': email,
                'username': username,
                'data': {
                    'attended': 0,
                    'skipped': 0,
                    'goal': 75
                }
            }
            db.child('users').child(user).set(new_user)
        except Exception as e:
            message = "Invalid Credentials!"
            return render_template('signup.html', message=message)

        return render_template("signin.html")
    return render_template("signup.html")


@app.route('/signin', methods=['GET','POST'])
def signin():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        user, username = '', ''
        try:
            response = auth.sign_in_with_email_and_password(email, password)
            user = response['localId']
            session['user'] = user
            
        except Exception as e:
            message = "Invalid Credentials!"
            return render_template('signin.html', message=message)
        else:
            username = db.child('users').child(user).get().val()['username']    
        
        return render_template("dashboard.html", username = username)
    return render_template("signin.html")


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('user', default=None)
    return redirect(url_for('index'))
