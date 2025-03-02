# from openai import OpenAI

# 

# completion = client.chat.completions.create(
#   model="gpt-4o-mini",
#   store=True,
#   messages=[
#     {"role": "user", "content": "write a haiku about ai"}
#   ]
# )

# print(completion.choices[0].message);
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS  # Import CORS
import os
import json
import uuid
from datetime import datetime
from openai import OpenAI  # Import OpenAI
from zipfile import ZipFile
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['PROJECTS_FOLDER'] = 'projects'
app.config['SECRET_KEY'] = 'ui_designer_secret_key'

# Initialize OpenAI client
client = OpenAI(
    api_key="" #enter the OPen API key here
)

# Ensure directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROJECTS_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/save', methods=['POST'])
def save_project():
    """Save the project as a zip file with improved HTML and CSS"""
    data = request.json

    # Extract HTML and CSS from the request
    html_content = data.get('html', '')
    css_content = data.get('css', '')

    # Send code to OpenAI for improvements
    improved_html, improved_css = improve_code_with_openai(html_content, css_content)

    # Create a unique save ID
    save_id = str(uuid.uuid4())
    save_dir = os.path.join(app.config['UPLOAD_FOLDER'], save_id)
    os.makedirs(save_dir, exist_ok=True)

    # Save improved files
    with open(os.path.join(save_dir, 'index.html'), 'w') as html_file:
        html_file.write(improved_html)

    with open(os.path.join(save_dir, 'styles.css'), 'w') as css_file:
        css_file.write(improved_css)

    # Create a zip file of the saved project
    zip_filename = f"{save_id}.zip"
    zip_path = os.path.join(app.config['UPLOAD_FOLDER'], zip_filename)

    with ZipFile(zip_path, 'w') as zipf:
        for root, dirs, files in os.walk(save_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, save_dir)
                zipf.write(file_path, arcname)

    return jsonify({
        'success': True,
        'message': 'Project saved successfully with OpenAI improvements',
        'save_id': save_id,
        'download_url': f'/api/download/{zip_filename}'
    })

@app.route('/api/improve-code', methods=['POST'])
def improve_code():
    """Improve HTML and CSS code using OpenAI"""
    data = request.json

    # Extract HTML and CSS from the request
    html_content = data.get('html', '')
    css_content = data.get('css', '')

    # Send code to OpenAI for improvements
    improved_html, improved_css = improve_code_with_openai(html_content, css_content)

    return jsonify({
        'success': True,
        'html': improved_html,
        'css': improved_css,
        'message': 'Code improved successfully'
    })

def improve_code_with_openai(html_content, css_content):
    """Send HTML and CSS to OpenAI for improvements"""
    try:
        # Combine HTML and CSS into a single prompt
        prompt = f"Improve the following HTML and CSS code to make it more modern, responsive, and visually appealing:\n\nHTML:\n{html_content}\n\nCSS:\n{css_content}\n\nProvide the improved HTML and CSS in the same format."

        # Call OpenAI API
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Use GPT-4 or another suitable model
            messages=[
                {"role": "system", "content": "You are a helpful assistant that improves HTML and CSS code."},
                {"role": "user", "content": prompt}
            ]
        )

        # Extract the improved code from the response
        improved_code = completion.choices[0].message.content

        # Split the improved code into HTML and CSS
        improved_html = improved_code.split("HTML:")[1].split("CSS:")[0].strip()
        improved_css = improved_code.split("CSS:")[1].strip()

        return improved_html, improved_css

    except Exception as e:
        print(f"Error improving code with OpenAI: {e}")
        # If OpenAI fails, return the original code
        return html_content, css_content

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download a file from the uploads folder"""
    return send_from_directory(
        directory=app.config['UPLOAD_FOLDER'],
        path=filename,
        as_attachment=True
    )

if __name__ == '__main__':
    app.run(debug=True)