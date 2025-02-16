import os
import requests
import smtplib
import ssl
from email.message import EmailMessage

from flask import Flask, request, Response
from twilio.twiml.voice_response import VoiceResponse, Dial

app = Flask(__name__)

@app.route("/incoming_call", methods=["POST"])
def incoming_call():
    """
    Gère l'appel entrant depuis Twilio.
    - Utilise <Dial record="record-from-ringing"> pour enregistrer la conversation.
    - Twilio enverra un webhook vers /recording_done une fois l'enregistrement terminé.
    """
    resp = VoiceResponse()
    resp.say("Bonjour, nous allons enregistrer cette conversation.")

    # On active l'enregistrement avant même la connexion
    with resp.dial(
        record="record-from-ringing",
        recordingStatusCallback="/recording_done",
        recordingStatusCallbackMethod="POST"
    ) as dial:
        dial.number("+33612345678")  # Remplace par le numéro de destination

    return Response(str(resp), mimetype="application/xml")


@app.route("/recording_done", methods=["POST"])
def recording_done():
    """
    Webhook que Twilio appelle lorsque l'enregistrement est terminé.
    - Récupère l'URL de l'enregistrement
    - Télécharge le MP3
    - Le sauvegarde sous le nom audio.mp3
    - Puis envoie le fichier audio par e-mail en pièce jointe.
    """
    call_sid = request.form.get("CallSid")
    recording_url = request.form.get("RecordingUrl")  # ex: https://api.twilio.com/2010-04-01/Accounts/XXX/Recordings/REXXX

    if not recording_url:
        return "No recording URL", 400

    # Construction de l'URL du MP3 (Twilio donne l'URL de base sans extension)
    mp3_url = recording_url + ".mp3"

    # Téléchargement du MP3 depuis Twilio (protégé par Account SID / Auth Token)
    try:
        r = requests.get(
            mp3_url,
            auth=(os.environ.get("TWILIO_ACCOUNT_SID"), os.environ.get("TWILIO_AUTH_TOKEN"))
        )
        r.raise_for_status()
    except Exception as e:
        print(f"[ERROR] Impossible de télécharger le fichier MP3 : {e}")
        return "Error downloading recording", 500

    mp3_data = r.content

    # 1) Sauvegarder localement sous le nom audio.mp3
    try:
        with open("audio.mp3", "wb") as f:
            f.write(mp3_data)
        print("[INFO] Fichier audio.mp3 sauvegardé avec succès.")
    except Exception as e:
        print(f"[ERROR] Impossible de sauvegarder le fichier localement : {e}")
        return "Error saving file locally", 500

    # 2) Envoyer le MP3 par e-mail
    # Configure ici ton SMTP et les adresses
    sender_email = "[email protected]"
    receiver_email = "[email protected]"
    subject = f"Enregistrement d'appel Twilio (CallSid={call_sid})"

    # Création du message e-mail
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

    # Ajouter le MP3 en pièce jointe (nommé ici "audio.mp3")
    msg.add_attachment(
        mp3_data,
        maintype="audio",
        subtype="mpeg",
        filename="audio.mp3"
    )

    # Envoi via SMTP (exemple : localhost:25)
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP("localhost", 25) as server:
            # Au besoin : server.starttls(context=context), server.login("user", "password")
            server.send_message(msg)
        print("[INFO] E-mail envoyé avec succès.")
    except Exception as e:
        print(f"[ERROR] Impossible d'envoyer l'e-mail : {e}")
        return "Error sending email", 500

    return "OK", 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
