# ireland_jobhunt
Check for Appointments and get notification on IFTTT app and Discord channel

# This whole project was made out of frustation and to bypass bots. TBH no appointments were found as bots auto-booked it within a minute of notifications, but this was a great learning experience. Now since the system has changes to phone booking, hopefully things will get better. 

This project extends work done by ricardodantas to add features like:
- Cron job to trigger the API at intervals, to check for appointments.
- Parses the response to check for slots and logs it.
- Webhook integration for Discord channel and IFTTT push notifications.
- Also a local server, exposed using `ngrok`. This opens up a chrome tab and pre-fills the appointment form when webhook is triggered.
- Every request is made via TOR http agent in order to bypass rate-limiting.
- CRON task and Tor docker container is running in an AWS EC2.
