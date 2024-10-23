from flask import Flask, request, jsonify
import torch
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
from flask_cors import CORS
import io
import os
import requests

app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None
transform = None

# todo: process .webp images
def load_model():
    global model, transform
    
    # Load model architecture
    weights = ResNet50_Weights.DEFAULT
    model = resnet50(weights=weights)
    
    # Freeze parameters
    for param in model.parameters():
        param.requires_grad = False
        
    # Replace final layer
    model.fc = torch.nn.Linear(2048, 4)
    
    model.load_state_dict(torch.load('./models/100k-images.pth', map_location=torch.device('cpu'), weights_only=True))
    model.to(device)
    model.eval()
    
    transform = weights.transforms()

load_model()

@app.route('/health')
def health():
    return "OK", 200
 
@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        print("0")

        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        try:
            # Read image
            image_file = request.files['image']
            image_bytes = image_file.read()
            image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

            # Preprocess
            image_tensor = transform(image).unsqueeze(0).to(device)
            
            # Get prediction
            with torch.no_grad():
                outputs = model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                
            pred_label_idx = torch.argmax(probabilities, dim=1).item()    
            
            return jsonify({
                'classification': pred_label_idx,
                'confidence': probabilities[0][pred_label_idx].item(),
                'success': True
            })
            
        except Exception as e:
            print(e)
            return jsonify({
                'error': str(e),
                'success': False
            }), 500


@app.route('/predict-url', methods=['POST'])
def predict_url():
    if request.method == 'POST':

        if "url" not in request.json:
            return jsonify({'error': 'No image URL provided', 'success': False}), 400
        
        
        url = request.json['url']

        try:
            # Download image from URL
            response = requests.get(url, timeout=10)
            response.raise_for_status()  # Raises an HTTPError for bad responses (4xx, 5xx)

            image = Image.open(io.BytesIO(response.content)).convert('RGB')
            
            # Preprocess
            image_tensor = transform(image).unsqueeze(0).to(device)
            
            # Get prediction
            with torch.no_grad():
                outputs = model(image_tensor)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                
            pred_label_idx = torch.argmax(probabilities, dim=1).item()    
            
            return jsonify({
                'classification': pred_label_idx,
                'confidence': probabilities[0][pred_label_idx].item(),
                'success': True
            })
            

        except:
            return jsonify({'error': 'Could not download image from URL', 'success': False}), 400


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
    