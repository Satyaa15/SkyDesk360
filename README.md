
### `README.md`

```markdown
# 🚀 SkyDesk360: The Future of Workspace

SkyDesk360 is a high-end, full-stack premium coworking space management platform. It features an immersive 3D-parallax user interface, real-time seat booking, automated email notifications, and a comprehensive administrative command center.

---

## 🛠️ Tech Stack

### Frontend (User Experience)
* **React.js** (Vite)
* **Tailwind CSS** (Styling & Glassmorphism)
* **Framer Motion** (Parallax & Cinematic Transitions)
* **React Leaflet** (Interactive Maps)
* **Lucide React** (Iconography)

### Backend (Core Logic)
* **FastAPI** (Python)
* **PostgreSQL** (Database)
* **SQLAlchemy** (ORM)
* **Pydantic v2** (Data Validation)
* **FastAPI-Mail** (Real SMTP Email Service)
* **Uvicorn** (ASGI Server)

---

## ✨ Key Features

- **Cinematic Hero Section**: Immersive perspective-tilt scroll effects with kinetic typography.
- **Interactive Floor Plan**: Live seat selection synced with a PostgreSQL database.
- **Virtual Office Tour**: Vertical mobile-view walkthrough with a custom-engineered glass video player.
- **Admin Command Center**: Manage occupancy, view revenue analytics, and deploy sub-admins.
- **Automated Communication**: Real email dispatch for signups, admin credentials, and booking confirmations.
- **Master Admin Recovery**: Automated "Master Admin" generation on server startup.

---

## 🚀 Getting Started

### 1. Prerequisites
* Python 3.10+
* Node.js 18+
* PostgreSQL Database

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend

```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

```


3. Install dependencies:
```bash
pip install -r requirements.txt

```


4. Configure your `.env` file:
```env
DATABASE_URL=postgresql://postgres:password@localhost/skydesk360
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-google-app-password

```


5. Run the server:
```bash
uvicorn main:app --reload

```



### 3. Frontend Setup

1. Navigate to the root/frontend directory:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Start the development server:
```bash
npm run dev

```



---

## 🔐 Administrative Access

Upon initial startup, the system automatically generates a **Master Admin**:

* **Email**: `admin@skydesk.com`
* **Password**: `SkyControl@2026`

---

