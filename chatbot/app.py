# ============================================================
#  app.py  —  AdvocateHub Flask Chatbot Server
#  Folder:  AdvocateHub/chatbot/app.py
#  Run:     python app.py
#  Port:    5001  (server.js uses 5000)
# ============================================================

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from bot import get_response

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"], supports_credentials=True)


# ── Health check ───────────────────────────────────────────────
@app.route("/")
def home():
    return jsonify({"status": "AdvocateHub Chatbot running ✅", "port": 5001})


# ── Main chat endpoint ─────────────────────────────────────────
@app.route("/chat", methods=["POST"])
def chat():
    data    = request.get_json(silent=True) or {}
    message = str(data.get("message", "")).strip()

    if not message:
        return jsonify({
            "text":  "Please type a message.",
            "type":  "text",
        }), 400

    try:
        result = get_response(message)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            "text":  "Sorry, something went wrong. Please try again.",
            "type":  "text",
            "error": str(e),
        }), 500


# ── Advocates list endpoint (optional, for direct queries) ─────
@app.route("/advocates", methods=["GET"])
def advocates():
    from bot import ADVOCATES, format_advocate_card
    city  = request.args.get("city",  "").strip().lower()
    spec  = request.args.get("spec",  "").strip().lower()
    name  = request.args.get("name",  "").strip().lower()
    limit = int(request.args.get("limit", 10))

    results = ADVOCATES
    if city: results = [a for a in results if city in a.get("city", "").lower()]
    if spec: results = [a for a in results if spec in a.get("speciality", "").lower() or spec in a.get("practiceArea", "").lower()]
    if name: results = [a for a in results if name in a.get("name", "").lower()]

    return jsonify({
        "count":     len(results),
        "advocates": [format_advocate_card(a) for a in results[:limit]],
    })


if __name__ == "__main__":
    print("\n🤖 AdvocateHub Chatbot running → http://localhost:5001\n")
    app.run(debug=True, port=5001)