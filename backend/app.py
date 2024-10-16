from flask import Flask, request, jsonify
from flask_cors import CORS
from fastai.vision.all import load_learner
import pickle
from PIL import Image
import io
import os
from flask import request, current_app
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app) 


def get_x(r):
  return f'images/{r["isic_id"]}.jpg'

def get_y(r):
  return r['benign_malignant']

try:
    learn_inf = load_learner('../models/model-2.pkl')
    print('Model loaded successfully!')
except Exception as e:
    print(f'Error loading model: {str(e)}')


@app.route('/predict', methods=['POST'])
def predict():
    image = request.files['image']

    upload_dir = os.path.join(current_app.root_path, 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate a unique filename
    filename = secure_filename(image.filename)
    
    # Save the file
    file_path = os.path.join(upload_dir, filename)
    image.save(file_path)

    print(f'File saved to {file_path}')
    results = learn_inf.predict(file_path)
  
    return {'success': True, 'data': {'classification': results[0]}}

if __name__ == '__main__':
    app.run(debug=True)