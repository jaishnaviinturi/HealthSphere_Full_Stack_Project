import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from datetime import datetime
import schedule
import time
import re
import threading
import logging
from flask import request, jsonify

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Twilio configuration
TWILIO_CONFIG = {
    'account_sid': os.getenv("TWILIO_ACCOUNT_SID"),
    'auth_token': os.getenv("TWILIO_AUTH_TOKEN"),
    'phone_number': os.getenv("TWILIO_PHONE_NUMBER")
}

# Validate Twilio configuration
if not all(TWILIO_CONFIG.values()):
    missing = [key for key, value in TWILIO_CONFIG.items() if not value]
    logger.error("Missing Twilio configuration: %s", missing)
    raise ValueError(f"Missing Twilio configuration: {missing}")

class InputValidator:
    @staticmethod
    def validate_phone(phone):
        pattern = r'^\+\d{10,15}$'
        return bool(re.match(pattern, phone))

    @staticmethod
    def validate_frequency(frequency):
        try:
            freq = int(frequency)
            return 1 <= freq <= 4
        except (ValueError, TypeError):
            return False

    @staticmethod
    def validate_time(time_str):
        try:
            datetime.strptime(time_str, '%H:%M')
            return True
        except ValueError:
            return False

    @staticmethod
    def validate_days(days):
        try:
            return isinstance(days, list) and all(isinstance(day, int) and 1 <= day <= 7 for day in days)
        except (TypeError, ValueError):
            return False

class TwilioClient:
    def __init__(self):
        self.client = Client(TWILIO_CONFIG['account_sid'], TWILIO_CONFIG['auth_token'])
        self.from_number = TWILIO_CONFIG['phone_number']

    def send_sms(self, to_number, message):
        try:
            message = self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=to_number
            )
            logger.info("Successfully sent SMS to %s: %s", to_number, message.sid)
            return True
        except TwilioRestException as e:
            logger.error("Error sending SMS to %s: %s", to_number, str(e))
            return False

class ReminderScheduler:
    def __init__(self, twilio_client):
        self.twilio = twilio_client
        self.reminders = []

    def create_reminder_job(self, reminder_data, phone_number):
        def job():
            current_day = datetime.now().isoweekday()
            current_time = datetime.now().strftime("%H:%M")
            
            if current_day in reminder_data['days'] and current_time in reminder_data['times']:
                message = f"Reminder: Time to take your {reminder_data['pill_name']} pill! ({current_time})"
                success = self.twilio.send_sms(phone_number, message)
                if success:
                    logger.debug("Sent reminder for %s at %s to %s", reminder_data['pill_name'], current_time, phone_number)
                else:
                    logger.error("Failed to send SMS for %s to %s", reminder_data['pill_name'], phone_number)
        return job

    def schedule_reminder(self, reminder_data, phone_number):
        logger.debug("Scheduling reminder for %s: %s", phone_number, reminder_data)
        job = self.create_reminder_job(reminder_data, phone_number)
        schedule.every(1).minutes.do(job)
        self.reminders.append({
            'phone': phone_number,
            'reminder': reminder_data
        })
        logger.info("Reminder scheduled successfully for %s", phone_number)

class PillReminder:
    def __init__(self):
        self.validator = InputValidator()
        self.twilio = TwilioClient()
        self.scheduler = ReminderScheduler(self.twilio)
        self.run()

    def add_reminder(self, phone_number, reminder_data):
        logger.debug("Adding reminder: phone=%s, data=%s", phone_number, reminder_data)
        
        if not self.validator.validate_phone(phone_number):
            return False, "Invalid phone number format. Please use format: +1234567890"
        
        if not reminder_data or not all(
            [
                'pill_name' in reminder_data and isinstance(reminder_data['pill_name'], str) and reminder_data['pill_name'],
                'frequency' in reminder_data and self.validator.validate_frequency(reminder_data['frequency']),
                'times' in reminder_data and isinstance(reminder_data['times'], list) and all(self.validator.validate_time(t) for t in reminder_data['times']),
                'days' in reminder_data and self.validator.validate_days(reminder_data['days'])
            ]
        ):
            return False, "Invalid reminder data format"

        if len(reminder_data['times']) != int(reminder_data['frequency']):
            return False, "Number of times must match frequency"

        self.scheduler.schedule_reminder(reminder_data, phone_number)
        return True, "Reminder created successfully!"

    def run(self):
        logger.info("Reminder system started. Running in background.")
        def run_scheduler():
            while True:
                try:
                    schedule.run_pending()
                    time.sleep(60)
                except Exception as e:
                    logger.error("Scheduler error: %s", str(e))
                    time.sleep(60)  # Prevent tight loop on error
        
        scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        scheduler_thread.start()

# Initialize the reminder system (will be instantiated in app.py)
pill_reminder = PillReminder()

def register_routes(app):
    @app.route('/api/reminders', methods=['POST'])
    def create_reminder():
        data = request.get_json()
        logger.debug("Received POST request with data: %s", data)
        
        if not data or 'phone' not in data or 'reminder' not in data:
            logger.error("Missing required fields: phone and reminder")
            return jsonify({'message': 'Missing required fields: phone and reminder'}), 400

        phone_number = data['phone']
        reminder_data = data['reminder']
        logger.debug("Processing: phone=%s, reminder=%s", phone_number, reminder_data)

        success, message = pill_reminder.add_reminder(phone_number, reminder_data)
        
        if success:
            logger.info("Reminder created: %s", message)
            return jsonify({'message': message}), 201
        else:
            logger.error("Reminder creation failed: %s", message)
            return jsonify({'message': message}), 400