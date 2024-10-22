from flask import Flask, request, jsonify
import torch
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
from flask_cors import CORS
import io
import os

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
    
    model.load_state_dict(torch.load('./models/10k-images.pth', map_location=torch.device('cpu'), weights_only=True))
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
                'prediction': pred_label_idx,
                'success': True
            })
            
        except Exception as e:
            print(e)
            return jsonify({
                'error': str(e),
                'success': False
            }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
    