from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import pyrebase
import os


app = Flask(__name__)
app.secret_key = os.urandom(36)

firebaseConfig = {
    "apiKey": os.environ.get('apiKey'),
    "authDomain": os.environ.get('authDomain'),
    "storageBucket": os.environ.get('storageBucket'),
    "databaseURL": os.environ.get('databaseURL') 
}

firebase = pyrebase.initialize_app(firebaseConfig)
db = firebase.database()
auth = firebase.auth()


#error handling
@app.errorhandler(404)
def not_found(e):
    return render_template('404.html')


#attendance management routes
@app.route('/')
def index():
    logout()
    return render_template('index.html')


@app.route('/dashboard', methods=['GET','POST'])
def dashboard():
    try:
        username = session['username']
        return render_template('dashboard.html', username=username)
    except Exception as e:
        return "<h1>first login brother</h1>"


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
            
        except Exception as e:
            message = "Invalid Credentials!"
            return render_template('signin.html', message=message)
        else:
            username = db.child('users').child(user).get().val()['username']
            session['user'] = user
            session['username'] = username 
        
        return redirect(url_for('dashboard'))
    return render_template("signin.html")


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('user', default=None)
    session.pop('username', default=None)
    return redirect(url_for('index'))