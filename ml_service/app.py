from flask import Flask, request, jsonify
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch
import io

app = Flask(__name__)

# Load model and processor
processor = AutoImageProcessor.from_pretrained("linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")
model = AutoModelForImageClassification.from_pretrained("linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    image_file = request.files['image']
    image = Image.open(image_file.stream).convert('RGB')
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class_idx = logits.argmax(-1).item()
        predicted_class = model.config.id2label[predicted_class_idx]
        confidence_score = float(torch.softmax(logits, dim=-1)[0][predicted_class_idx])
        if confidence_score >= 0.85:
            severity = 'High'
        elif confidence_score >= 0.6:
            severity = 'Moderate'
        else:
            severity = 'Low'
        if predicted_class.lower() == "healthy":
            result = {
                'status': 'Healthy',
                'disease': None
            }
        else:
            result = {
                'status': 'Unhealthy',
                'disease': predicted_class,
                'severity': severity
            }
        return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
