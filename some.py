import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import requests
from datetime import datetime, timedelta

import random


# Example usage:
def generate_mock_data(num_items):
    data = []
    current_time = datetime.now()
    for _ in range(num_items):
        # Generate a random time within the last 24 hours
        timestamp = current_time - timedelta(hours=random.randint(0, 24), minutes=random.randint(0, 59), seconds=random.randint(0, 59))
        
        # Generate a random value
        value = round(random.uniform(0, 100), 2)
        
        # Generate a random description
        descriptions = ["Normal reading", "Warning: High value detected", "Warning: Low value detected"]
        description = random.choice(descriptions)
        
        data.append({
            'time': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'value': value,
            'description': description
        })
    
    return data
mock_data = generate_mock_data(5)
def lambda_handler(event, context):
    # Define the REST API URL to query
    api_url = "https://example.com/api/data"
    
    # Define the email content
    email_subject = "Data from API"
    sender_email = "iamhackeralok31@gmail.com"
    receiver_email = "iamhackeralok31@gmail.com"
    
    try:
        # Make a GET request to the REST API
        # response = requests.get(api_url)
        data = mock_data
        
        # Process the data from the API
        # For example, check if the time is matched or past the mentioned time
        current_time = datetime.now().time()
        # Assuming the API returns data in a specific format containing a time field
        for item in data:
            print(item)
            # api_time = datetime.strptime(item['time'], '%H:%M:%S').time()
            # if api_time <= current_time:
                # Prepare the email body
            email_body = json.dumps(item, indent=4)
                
                # Send the email using Gmail SMTP
            send_email(sender_email, receiver_email, email_subject, email_body)
                
                # Break the loop after sending the first email
            break
                
    except Exception as e:
        print(f"Error: {e}")
        # Handle any errors
        
    return {
        'statusCode': 200,
        'body': json.dumps('Email sent successfully')
    }

def send_email(sender_email, receiver_email, subject, body):
    try:
        # Set up the SMTP server
        smtp_server = "smtp.gmail.com"
        port = 587  # For SSL
        sender_email = sender_email
        password = "zoiw zizl vlnl dkcd"
        
        # Create a multipart message and set headers
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = receiver_email
        message["Subject"] = subject
        
        # Add body to email
        message.attach(MIMEText(body, "plain"))
        
        # Create SMTP session for sending the mail
        session = smtplib.SMTP(smtp_server, port)
        session.starttls()  # Enable encryption
        session.login(sender_email, password)  # Login
        
        # Send the message via the server
        session.sendmail(sender_email, receiver_email, message.as_string())
        
        # Close SMTP session
        session.quit()
        
        print("Email sent successfully")
        
    except Exception as e:
        print(f"Error sending email: {e}")
lambda_handler('a,','b')