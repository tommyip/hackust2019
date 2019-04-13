from flask import Flask, render_template

app = Flask(__name__)

# Install flask:
# pip install flask
#
# Run locally by:
# $ export FLASK_ENV=development
# $ export FLASK_APP=server.py
# $ flask run


@app.route("/")
def index():
    return render_template('index.html', test="Hi")
