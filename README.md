🛡️ ForensiShield AI

AI-Powered Cyber Forensics and Security Log Analysis Platform

ForensiShield AI is a web-based cyber forensics platform designed to help analyze security log files, identify suspicious authentication activity, and support security investigations.

🚀 Features

- Security Log Upload: Upload supported ".log", ".txt", and ".csv" files.
- Log Analysis: Parse uploaded logs and identify suspicious activity.
- Failed Login Detection: Detect potential failed authentication attempts using predefined patterns.
- Investigation Dashboard: View analysis results through a dashboard.
- AI Assistant: Interact with an AI assistant for security-related analysis.
- Reports: Generate and download investigation reports in PDF format.
- User Authentication: Register and log in to the application.

🧰 Technology Stack

Component| Technology
Frontend| React
Styling| Tailwind CSS
Backend| Python, Django, Django REST Framework
Database| PostgreSQL
AI Integration| Google Gemini
Deployment| Vercel, Render
Database Hosting| Supabase

🏗️ Architecture

1. The user interacts with the React frontend.
2. The frontend sends requests to the Django REST API.
3. The backend validates and processes uploaded log files.
4. The analysis module identifies potential failed login activity.
5. PostgreSQL stores application data.
6. The AI assistant provides AI-powered assistance.
7. Analysis results and reports are presented to the user.

🔗 Live Application

- Frontend: https://forensi-shield-ai.vercel.app
- Backend Health Check: https://forensishield-ai-backend.onrender.com/api/health/

🔐 Security Considerations

- Validate uploaded files before processing.
- Restrict accepted file extensions and file sizes.
- Keep database credentials and API keys in environment variables.
- Configure production settings and allowed frontend origins.
- Treat automated log analysis as investigative assistance, not definitive proof of an attack.

💻 Local Setup

Prerequisites

- Python
- Node.js and npm
- PostgreSQL

Backend

1. Open the backend directory.
2. Create and activate a Python virtual environment.
3. Install the required Python dependencies.
4. Configure the required environment variables.
5. Apply database migrations.
6. Start the Django development server.

Frontend

1. Open the frontend directory.
2. Install dependencies using "npm install".
3. Configure "VITE_API_BASE_URL" to point to the backend API.
4. Start the frontend development server using "npm run dev".

Refer to the project configuration files for the exact environment variables and commands.

🔮 Future Enhancements

- Advanced threat detection and log correlation.
- More investigation and visualization features.
- Expanded security event classification.
- Improved investigation workflows and reporting.

👨‍💻 Author

Developed as a cybersecurity and full-stack development project.

---

Disclaimer: ForensiShield AI is intended to assist security analysis and investigations. Its findings should be verified before taking security or incident-response actions.


## System Architecture
The following diagram illustrates the architecture of ForensiShield AI.

                          USER
                           |
                           v
                +----------------------+
                |    React Frontend    |
                |  Vite + Tailwind CSS |
                |   Deployed on Vercel |
                +----------------------+
                           |
                           | REST API Requests
                           v
                +----------------------+
                |    Django Backend    |
                |   Django REST API    |
                |  Deployed on Render  |
                +----------------------+
                           |
              +------------+------------+
              |            |            |
              v            v            v
       +-------------+ +----------+ +-------------+
       |  Supabase   | | Log File | | Gemini AI   |
       | PostgreSQL  | | Analysis | | Integration |
       +-------------+ +----------+ +-------------+
