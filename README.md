# Wildguard-ai
🚀 Project Summary – WildGuard AI

WildGuard AI is an AI-powered wildlife threat detection system that analyzes images, identifies potential threats, and updates a live dashboard for real-time monitoring.

🧠 What We Built
📸 Image upload system (frontend → backend)
🤖 AI-based detection using Google Vision API
🧠 Intelligent threat classification (LOW / MEDIUM / HIGH)
🗺️ Live map showing detected incidents
⚡ Real-time updates using Supabase
📩 SMS alerts using Twilio (for high threats)

⚙️ Backend Development
Built using FastAPI
Created /detect API for image processing
Integrated:
Google Vision API (object + label detection)
Supabase (database + realtime)
Twilio (alerts)
Added:
Error handling (no crashes even if AI fails)
Fallback detection (ensures system always responds)
Debug logging for reliability


⚙️ Backend Development
Built using FastAPI
Created /detect API for image processing
Integrated:
Google Vision API (object + label detection)
Supabase (database + realtime)
Twilio (alerts)
Added:
Error handling (no crashes even if AI fails)
Fallback detection (ensures system always responds)
Debug logging for reliability



 Key Challenges & Fixes
1. API Integration Issues
Fixed CORS errors between frontend and backend
2. Backend Crashes (500 Errors)
Added try-catch and fallback logic
3. Google Vision Billing Error
Implemented fallback detection to keep system functional
4. Poor Detection Accuracy
Combined:
Label detection
Object detection
Improved keyword logic for better threat classification
5. Empty UI Results
Handled null/empty responses in frontend


⚡ Features
Real-time incident tracking
AI-powered detection
Live map visualization
SMS alert system
Fault-tolerant backend (works even if AI fails)



⚡ Features
Real-time incident tracking
AI-powered detection
Live map visualization
SMS alert system
Fault-tolerant backend (works even if AI fails)



 Future Improvements
Replace Google Vision with YOLO / custom model
Improve wildlife detection accuracy
Add image preview with bounding boxes
Deploy full system online
