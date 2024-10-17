import bentoml
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
import pandas as pd
from PIL import Image
import os
from flask_cors import CORS
from flask import Flask, request, current_app
from werkzeug.utils import secure_filename
import tempfile
import gdown


def load_model():
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pth') as temp_file:
        temp_path = temp_file.name

        model = models.resnet18(pretrained=True)
        num_ftrs = model.fc.in_features
        model.fc = nn.Linear(num_ftrs, 4)

        # Download the model from Google Drive
        file_id = '1--vYcqyH-WSJl52gd-8NHFBq7l-VxM7C'
        url = f'https://drive.google.com/uc?id={file_id}'
        gdown.download(url, temp_path, quiet=False)

        model.load_state_dict(torch.load(temp_path))
   
        return model

transform = transforms.Compose([
    transforms.RandomResizedCrop(128, scale=(0.35, 1.0)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict(model, image_path):
    model.eval()
    image = Image.open(image_path).convert('RGB')
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output, 1)

    label_map_inverse = {
        0: 'benign',
        1: 'malignant',
        2: 'indeterminate/benign',
        3: 'indeterminate/malignant'
    }
    return label_map_inverse[predicted.item()]

loaded_model = load_model()

app = Flask(__name__)
CORS(app) 

@app.route('/predict', methods=['POST'])
def predictRoute():
    print('Request received')
    image = request.files['upload_file']

    upload_dir = os.path.join(current_app.root_path, 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate a unique filename
    filename = secure_filename(image.filename)
    
    # Save the file
    file_path = os.path.join(upload_dir, filename)
    image.save(file_path)

    print(f'File saved to {file_path}')
    prediction = predict(loaded_model, file_path)
    print(f"Prediction: {prediction}")
    
    return {'success': True, 'data': {'prediction': prediction}}

@app.route('/health', methods=['GET'])
def health():
    return 'OK', 200


if __name__ == '__main__':
    app.run(debug=True)

