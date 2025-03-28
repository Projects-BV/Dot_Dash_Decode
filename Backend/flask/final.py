from flask import Flask, render_template, Response,jsonify,send_from_directory
import cv2
import numpy as np
import dlib
from imutils import face_utils
from translation_module import convertMorseToText
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import time
from flask_mail import Mail,Message
import os
import logging
#new line 1

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager,create_access_token
from db_setup import db

from flask_bcrypt import Bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity


# till here

app = Flask(__name__)
#CORS(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

#CORS(app, resources=r"/start": {"origins": "http://localhost:3000", "supports_credentials": True},)
#CORS(app, resources={r"/auth/*": {"origins": "http://localhost:3000", "supports_credentials": True}})
#new line 2
#db=SQLAlchemy()
bcrypt=Bcrypt(app)
app.config["SQLALCHEMY_DATABASE_URI"]="sqlite:///yourdatabase.db"
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "fallback_secret_key")

#app.config["JWT_SECRET_KEY"]="Aarti_Anurag_Srivastava"
db.init_app(app)
with app.app_context():
    db.drop_all()
    db.create_all()
jwt=JWTManager(app)

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # For Gmail
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
#app.config['MAIL_USERNAME'] = 'poison.ivy.081102@gmail.com'  
#app.config['MAIL_PASSWORD'] = 'lrbn zzpz pqhv lriy'     # You'll need to change this
#app.config['MAIL_DEFAULT_SENDER'] = 'poison.ivy.081102@gmail.com'  # You'll need to change this
app.config['MAIL_USERNAME'] = 'dotdashdecode@gmail.com'  
app.config['MAIL_PASSWORD'] = 'fpis urax ptmy vhgs'     
app.config['MAIL_DEFAULT_SENDER'] = 'dotdashdecode@gmail.com'  # You'll need to cha
#app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME")
#app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD")
#app.config["MAIL_DEFAULT_SENDER"] = os.environ.get("MAIL_USERNAME")
# Initialize mail with app
#mail.init_app(app)
mail=Mail()
mail.init_app(app)

from auth_routes import auth
app.register_blueprint(auth,url_prefix="/auth")
#debugging
@app.route('/send-test-email')
def send_test_email():
    msg = Message("Test Email", recipients=['your_email@gmail.com'])
    msg.body = "This is a test email from Flask."
    try:
        mail.send(msg)
        return "Email sent successfully!"
    except Exception as e:
        return f"Error: {str(e)}"
#till here

cap=None
camera=None
running=False

@app.route('/start', methods=['POST'])
@jwt_required() #to authenticate user. only start when logged in
def start_decoder():
    #get current user's id from the token
    current_user=get_jwt_identity()
    global cap,running
    try:
        if cap is None or not cap.isOpened():
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                return jsonify({"error": "Failed to open camera"}), 500
        running=True
        return jsonify({"message": "Morse Code Decoder Started!"}), 200
    except Exception as e:
        print(f"Camera error: {str(e)}")
        return jsonify({"error": f"Camera error: {str(e)}"}), 500

@app.route('/stop', methods=['POST'])
def stop_camera():
    global running, camera
    if running:
        running = False  # Mark that the camera should stop
        time.sleep(1)  # Allow time for frame capture to exit

        if camera is not None:
            camera.release()  # Release the camera
            cv2.destroyAllWindows()  # Close any OpenCV windows
            camera = None  # Set to None to avoid reusing a released camera

        return jsonify({"message": "Decoder stopped successfully."})
    else:
        return jsonify({"error": "Decoder is not running."})






socketio = SocketIO(app)


detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(r"E:\Project1\Dot_Dash_Decode\computer_vision\models\shape_predictor_68_face_landmarks.dat")

# Initialize variables for the blink detection
counter = 0
pause = 0
debounce_counter = 0
morse_code = ""
current_word = ""
word_pause_frames = 35
EAR_threshold = 0.25
EAR_dot = 2
EAR_dash = 5
pause_frames = 25
pause_debounce = 3

# Function to calculate Euclidean distance
def distance(pa, pb):
    dist = np.linalg.norm(pa - pb)
    return dist

# Function to calculate EAR (Eye Aspect Ratio)
def eye_aspect_ratio(a, b, c, d, e, f):
    horizontal_dist = distance(b, d) + distance(c, e)
    vertical_dist = distance(a, f)
    ear = horizontal_dist / (2.0 * vertical_dist)
    return ear

'''@app.route('/')
def index():
    return render_template('index.html')'''

@app.route('/')
def index():
    # Initialize camera for any authenticated user accessing the main page
    # This bypasses the need for a separate /start endpoint
    global cap, running
    
    try:
        # Only try to initialize camera if it's not already open
        if cap is None or not cap.isOpened():
            cap = cv2.VideoCapture(0)  # Open the camera
            
        # Set running to True to allow frame generation
        running = True
        
    except Exception as e:
        print(f"Camera initialization error: {str(e)}")
        # Continue to render the template even if camera fails
        
    return render_template('index.html')

# Video streaming function
def generate_frames():
    global morse_code, current_word, counter, pause, debounce_counter
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        face_frame = frame.copy()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = detector(gray)

        for face in faces:
            x1 = face.left()
            y1 = face.top()
            x2 = face.right()
            y2 = face.bottom()

            cv2.rectangle(face_frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            landmarks = predictor(gray, face)
            landmarks = face_utils.shape_to_np(landmarks)

            left_blink = eye_aspect_ratio(landmarks[36], landmarks[37], landmarks[38], landmarks[41], landmarks[40], landmarks[39])
            right_blink = eye_aspect_ratio(landmarks[42], landmarks[43], landmarks[44], landmarks[47], landmarks[46], landmarks[45])
            ear = (left_blink + right_blink) / 2.0

            # Handling Morse code generation based on blink duration
            if ear < EAR_threshold:
                counter += 1
                pause = 0
                debounce_counter = 0
            else:
                if EAR_dot < counter < EAR_dash:
                    morse_code += "."
                elif counter > EAR_dash:
                    morse_code += "-"

                counter = 0
                pause += 1

                if pause >= pause_frames and debounce_counter == 0:
                    if morse_code:
                        char = convertMorseToText(morse_code)
                        current_word += char
                    morse_code = ""
                    debounce_counter = pause_debounce

                if pause >= word_pause_frames:
                    if current_word:
                        current_word += " "
                    pause = 0

            if debounce_counter > 0:
                debounce_counter -= 1

            cv2.putText(frame, f"EAR: {ear:.2f}", (100, 100), cv2.FONT_ITALIC, 1.2, (0, 0, 255), 2)
            cv2.putText(frame, f"Morse: {morse_code}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 0, 255), 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        # Emit the morse code and translated text
        socketio.emit('update', {'morse_code': morse_code, 'translated_text': current_word})
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('images', filename)

@app.route('/reset', methods=['POST'])
def reset_decoder():
    global morse_code, current_word, counter, pause, debounce_counter
    
    # Reset all the tracking variables
    morse_code = ""
    current_word = ""
    counter = 0
    pause = 0
    debounce_counter = 0
    
    # Emit an update with empty values
    socketio.emit('update', {'morse_code': '', 'translated_text': ''})
    
    return jsonify({"message": "Decoder reset successfully."}), 200

# Add better error handling middleware
@app.errorhandler(422)
def handle_unprocessable_entity(error):
    response = jsonify({
        "error": "Invalid request data",
        "message": str(error)
    })
    response.status_code = 422
    return response

if __name__ == '__main__':
    #socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
    socketio.run(app, debug=True)