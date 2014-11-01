from flask import Flask, render_template
app = Flask(__name__)
@app.route("/")
def layout():
	tabs = [
		{"name":"about", "link_text":"about"},
		{"name":"chatbot", "link_text":"chatbot", "demo":True, "description": "A Prolog project"},
		{"name":"pong", "link_text":"pong", "demo":True, "description": "A simple JavaScript-game"},
		{"name":"genetic-elevators", "link_text":"genetics", "description": "Computer Science Bachelor's project"},
		{"name":"soundcloud", "link_text":"soundcloud"},
		{"name":"youtube", "link_text":"youtube"},
	]
	context = {"tabs":tabs}
	return render_template('layout.html', tabs=tabs)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
