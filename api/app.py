from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/save-attendance', methods=['POST'])
def save_attendance():
    data = request.json
    #print(data)

    return jsonify({'message': 'Attendance saved successfully GG!'})