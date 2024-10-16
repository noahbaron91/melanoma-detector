from flask import Flask, request, jsonify
from flask_cors import CORS
from fastai.vision.all import load_learner
import pickle

app = Flask(__name__)
CORS(app) 


def get_x(r):
  return f'images/{r["isic_id"]}.jpg'

def get_y(r):
  return r['benign_malignant']

try:
    learn_inf = load_learner('../models/model-1.pkl')
    print('Model loaded successfully!')
except Exception as e:
    print(f'Error loading model: {str(e)}')


@app.route('/predict', methods=['POST'])
def predict():
    results = learn_inf.predict('../images/ISIC_0085644.jpg')
    print(results)
    # Add your prediction logic here
    # For example:
    # image = request.files['image']
    # prediction = learner.predict(image)
    # return jsonify({'prediction': prediction})
    return {'success': True, 'data': {'classification': results[0]}}

if __name__ == '__main__':
    app.run(debug=True)