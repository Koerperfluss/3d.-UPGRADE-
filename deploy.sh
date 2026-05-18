#!/bin/bash
# ==============================================================================
# 🚀 KÖRPERFLUSS - GOOGLE CLOUD DEPLOYMENT SCRIPT
# ==============================================================================
# Dieses Script nutzt dein $900 Guthaben auf der Google Cloud (GCP/Cloud Run).
# Es baut die Web-App und lädt sie direkt in dein Projekt hoch.
# ==============================================================================

# Abbruch bei Fehler
set -e

echo "🌟 Starte Deployment für Körperfluss Web-App..."

# 1. Projekt-ID auslesen (aus der .firebaserc oder manuell setzen)
PROJECT_ID="gen-lang-client-0285074833"
SERVICE_NAME="koerperfluss-hub"
REGION="europe-west3" # Frankfurt

echo "📦 Baue Docker Container..."
# 2. Nutze Google Cloud Build um den Container zu bauen
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME --project=$PROJECT_ID

echo "🚀 Deploy auf Cloud Run (nutzt dein GCP Guthaben)..."
# 3. Deploye zu Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --project=$PROJECT_ID

echo "✅ BOOM! Deployment abgeschlossen."
echo "🌐 Deine App ist nun live erreichbar über die ausgegebene URL oben!"
