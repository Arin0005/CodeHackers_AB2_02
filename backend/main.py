from flask import Flask, request, jsonify
import openai

# Initialize Flask app
app = Flask(__name__)

# Set your OpenAI API key
API_KEY = ""
openai.api_key = API_KEY


@app.route("/chat", methods=["POST"])
def chat_with_gpt():
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_input}
            ]
        )
        ai_response = response["choices"][0]["message"]["content"]
        return jsonify({"response": ai_response})

    except openai.error.OpenAIError as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)