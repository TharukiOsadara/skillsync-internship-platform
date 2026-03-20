# SkillSync:Internship Matching Platform
SkillSync is an internship matching system designed for IT students, connecting academic skills with real-world industry opportunities.

**Project Component:** Admin Internship Management & Suggestion Module  
**Developer:** Tharuki Osadara  
**Unit:** IT3040 | IT Project Management (ITPM)  
**Milestone:** Progress 1 (35% Functionality Demo)

---

## 📌 Project Overview
SkillSync is a MERN-stack application designed to bridge the gap between IT students and industry opportunities. My specific module focuses on the **Admin ecosystem**, allowing administrators to manage internship postings and leveraging a **Skill-Based Matching Engine** to suggest the best candidates for each role.

## 🚀 Progress 1 Features (35% Completed)
the following backend and structural components are fully functional:

### 1. User Management (Common Module)
- **Role-Based Schema:** Differentiates between `Student` and `Admin`.
- **Registration API:** Full validation for Gmail formats, passwords, and user metadata (Skills, Education, Experience).
- **CRUD Operations:** Ability to Create, Read, Update, and Delete user profiles.

### 2. Admin Internship Module (My Component)
- **Internship Schema:** Includes Title, Company, Location, Duration, and Deadline.
- **Matching Logic:** Implemented Regex-based filtering to suggest internships based on a student's `skills` string.
- **RESTful API:** Endpoints ready for `POST` (Add), `GET` (View All), and `DELETE` (Remove).

### 3. Database & Security
- **MongoDB Atlas:** Cloud database connection established.
- **Input Validation:** Server-side checks using Mongoose built-in validators.

---

## 📂 Folder Structure
```text
SKILLSYNC-INTERNSHIP-PLATFORM/
├── Backend/
│   ├── Controllers/      # Logical functions for Users & Internships
│   ├── Models/           # Mongoose Schemas (Data Structure)
│   ├── Routes/           # API Endpoint definitions
│   └── App.js            # Server entry point & Middleware
├── Froentend/            # React Application (UI Implementation)
└── .gitignore            # Excludes node_modules for clean version control
