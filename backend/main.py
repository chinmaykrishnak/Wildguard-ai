from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import vision
from google.oauth2 import service_account
from supabase import create_client
from twilio.rest import Client

# Explicitly load Google Vision credentials
json_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not json_path:
    raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS not set in .env")

credentials = service_account.Credentials.from_service_account_file(json_path)
vision_client = vision.ImageAnnotatorClient(credentials=credentials)

# Supabase + Twilio setup
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
twilio_client = Client(os.getenv("TWILIO_SID"), os.getenv("TWILIO_TOKEN"))

# FastAPI app setup
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Threat and wildlife keywords
THREATS = ["person", "human", "weapon", "gun", "knife", "vehicle"]
WILDLIFE = ["elephant", "rhino", "leopard", "tiger", "lion", "pangolin", "bear"]

@app.post("/detect")
async def detect(file: UploadFile = File(...), lat: float = 17.45, lng: float = 78.30):
    content = await file.read()
    image = vision.Image(content=content)

    labels = vision_client.label_detection(image=image).label_annotations
    detected = [l.description.lower() for l in labels]

    threat = "HIGH" if any(t in detected for t in THREATS) else "LOW"
    species = [l for l in detected if l in WILDLIFE]

    supabase.table("incidents").insert({
        "threat_level": threat,
        "species": species,
        "labels": detected[:8],
        "lat": lat,
        "lng": lng
    }).execute()

    if threat == "HIGH":
        ranger = supabase.table("rangers").select("*").limit(1).execute().data[0]
        twilio_client.messages.create(
            body=f"ALERT: Threat at {lat},{lng}. Detected: {detected[:3]}",
            from_=os.getenv("TWILIO_FROM"),
            to=ranger["phone"]
        )

    return {"threat_level": threat, "species": species, "labels": detected[:8]}

@app.get("/incidents")
def get_incidents():
    return supabase.table("incidents").select("*").order("created_at", desc=True).execute().data