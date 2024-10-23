import torch
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
import io
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get('/health')
def health():
    return "OK", 200

class PredictionResponse(BaseModel):
    success: bool
    classification: int
    confidence: float
    error_message: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str
    success: bool = False

 
@app.post('/predict')
async def predict(image: UploadFile = File(...)):
    if not image.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File uploaded is not an image"
        )
        
    try:
        # Read image
        image_bytes = await image.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

        # Preprocess
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Get prediction
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            
        pred_label_idx = torch.argmax(probabilities, dim=1).item()    
        
        return PredictionResponse(
            classification=pred_label_idx,
            confidence=float(probabilities[0][pred_label_idx].item()),
            success=True
        )
        
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

class ImageURL(BaseModel):
    url: str

@app.post('/predict-url')
async def predict_url(image_data: ImageURL):
    try:
        # Download image from URL
        response = requests.get(image_data.url, timeout=10)
        response.raise_for_status()

        # Open and convert image
        image = Image.open(io.BytesIO(response.content)).convert('RGB')
        
        # Preprocess
        image_tensor = transform(image).unsqueeze(0).to(device)
        
        # Get prediction
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            
        pred_label_idx = torch.argmax(probabilities, dim=1).item()
        
        return PredictionResponse(
            classification=pred_label_idx,
            confidence=probabilities[0][pred_label_idx].item(),
            success=True
        )

    except requests.RequestException:
        raise HTTPException(
            status_code=400,
            detail="Could not download image from URL"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )