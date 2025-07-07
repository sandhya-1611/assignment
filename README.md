🦷 DentalFlow - Dental Center Management Dashboard
DentalFlow is a fully functional dental clinic management system built entirely from scratch using React. It offers role-based dashboards for Admins (Dentists) and Patients, with full capabilities for managing appointments, treatments, patients, and files — all simulated with localStorage.

🚀 Features
🔐 Authentication & Authorization
Role-based login system (Admin / Patient)

User sessions stored in localStorage

Automatic redirection to dashboards based on role

Built-in route protection via context

🧑‍⚕️ Admin Dashboard
Overview Panel: Total patients, revenue, and upcoming appointments

Patient Management: Add, edit, delete, and view patients

Appointments: Schedule, update, cancel or delete appointments

Treatments: Manage treatments with file uploads (PDFs, images)

Calendar View: Visualize appointments by date

Analytics: Top patients, revenue, treatment frequency

Settings: Reload sample data

🧑 Patient Dashboard
View upcoming appointments

Book appointments with treatment type and date

See medical history and uploaded files

Profile info access

🛠️ Tech Stack
Layer	Tools Used
Frontend	React (Functional Components)
Routing	React Router DOM
State Management	React Context API
Styling	TailwindCSS, Material-UI (MUI)
File Handling	File upload (base64), preview & download
Form Handling	Native validation + controlled inputs
Storage	localStorage (Simulated Backend)
Language	TypeScript

📁 Folder Structure
python
Copy
Edit
dental-dashboard/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Table/               # Patient & Appointment Tables
│   │   │   ├── Calendar.tsx        # Custom calendar view
│   │   │   ├── FileUpload.tsx      # Drag-drop file upload UI
│   │   │   ├── FileViewer.tsx      # Preview/download treatment files
│   │   │   └── Login.tsx           # Login form
│   │   ├── context/
│   │   │   ├── AuthContext.tsx     # Handles login/logout + role context
│   │   │   └── DataContext.tsx     # Central data store for patients/appointments
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Login Page
│   │   │   ├── AdminDashboard.tsx  # Main admin dashboard (multi-tabbed)
│   │   │   └── PatientDashboard.tsx# Patient dashboard
│   │   ├── utils/
│   │   │   └── globals.css         # Global styles
│   ├── config/
│   │   ├── constants.js
│   │   ├── usersData.js
│   │   ├── patientsData.js
│   │   └── incidentData.js
├── App.tsx                          # Routes + Providers
├── main.tsx                         # Entry point
├── .gitignore
└── README.md
📦 Installation & Setup
✅ Prerequisites
Node.js 18+

npm or yarn

⚙️ Steps
bash
Copy
Edit
git clone <your-repo-url>
cd dental-dashboard
npm install  # or yarn
npm run dev  # start dev server
Visit: http://localhost:5173

🔐 Demo Credentials
Admin (Dentist)
Email: admin@dentalflow.com

Password: admin123

Patient
Email: john.doe@example.com

Password: patient123

🔄 Data Flow & Simulation
This project uses localStorage to simulate database functionality:

Key	Description
dentalflow_users	User auth info (role, email)
dentalflow_patients	Patient records
dentalflow_incidents	Appointments + attached files
dentalflow_initialized	Prevents reloading seed data

🧠 Technical Decisions
React Context API: Lightweight global state for auth/data — no Redux overhead

MUI + TailwindCSS: Tailwind for layout utility, MUI for components

Modular File Uploads: Drag-drop, preview, file limit, MIME type checks

Responsive UI: Dashboards and forms are mobile-friendly

Dynamic KPIs: All dashboard stats calculated from localStorage data

Reusable Dialogs & Tables: Encapsulated treatment/patient forms

⚠️ Known Issues
Files stored as base64 → can grow localStorage size quickly

No real backend — all data lost on clearing browser storage

Simulated authentication only — not production secure

Not SSR-compatible (React only)

🛠️ Scripts
bash
Copy
Edit
npm run dev        # Start development
npm run build      # Build for production
npm run start      # Serve built app
npm run lint       # Code linting
🌐 Deployment Recommendations
Platform	Notes
Vercel	Best for React projects
Netlify	Free, simple setup
GitHub Pages	Works if static export is used

🔮 Future Enhancements
Real backend with Express or Firebase

JWT authentication

Encrypted file storage

Appointment reminders via email

Payment integration

Mobile app with React Native

Multi-user roles (Receptionist, Assistant)
