from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import base64
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Mock AI models - Replace with actual models
class ProductRecognizer:
    def recognize(self, image_base64):
        # Mock recognition
        return {
            'product_name': 'Product Name',
            'category': 'Category',
            'confidence': 0.95
        }

class DemandAnalyzer:
    def analyze(self, demands):
        # Mock analysis
        return {
            'top_products': demands[:5],
            'trend': 'increasing',
            'recommendation': 'Stock these items'
        }

product_recognizer = ProductRecognizer()
demand_analyzer = DemandAnalyzer()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'RetailYou AI Service',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/ai/recognize-product', methods=['POST'])
def recognize_product():
    try:
        data = request.get_json()
        image_base64 = data.get('image')
        
        result = product_recognizer.recognize(image_base64)
        
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/ai/analyze-demands', methods=['POST'])
def analyze_demands():
    try:
        data = request.get_json()
        demands = data.get('demands', [])
        
        result = demand_analyzer.analyze(demands)
        
        return jsonify({
            'success': True,
            'data': result
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/ai/calculate-calories', methods=['POST'])
def calculate_calories():
    try:
        data = request.get_json()
        distance = data.get('distance', 0)  # in km
        weight = data.get('weight', 70)  # in kg
        
        # Calorie calculation: distance * weight * 0.8
        calories = distance * weight * 0.8
        steps = distance * 1312  # approx 1312 steps per km
        
        return jsonify({
            'success': True,
            'data': {
                'calories_burned': round(calories, 2),
                'steps': int(steps),
                'distance_km': distance
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/ai/predict-stock', methods=['POST'])
def predict_stock():
    try:
        data = request.get_json()
        product_demands = data.get('demands', [])
        
        # Mock prediction
        prediction = {
            'should_stock': len(product_demands) > 5,
            'demand_level': 'high' if len(product_demands) > 5 else 'medium',
            'recommendation': f'Stock this item based on {len(product_demands)} customer requests'
        }
        
        return jsonify({
            'success': True,
            'data': prediction
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    print('🚀 RetailYou AI Service running on http://localhost:5001')
    app.run(host='0.0.0.0', port=5001, debug=True)