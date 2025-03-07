# 📌 Attendify - Simple Attendance Tracker  

**Attendify** is a minimalistic **attendance tracking app** that allows users to load data from **Google Sheets**, select columns to keep, and track attendance dynamically.  

---

## ✨ Features  

✅ Import data via a **Google Sheets CSV link**  
✅ Select whether names are in a **single column** or **separate (First/Last Name)**  
✅ Choose additional columns to keep  
✅ Display & manage attendance status with a **checklist**  
✅ Save & retrieve data from **localStorage** for persistence  

---

## 🛠 Tech Stack  

- **React** (Vite)  
- **React Router** (for navigation)  
- **Tailwind CSS** (for styling)  

---

## 🚀 Installation & Setup  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/yourusername/attendify.git
cd attendify
```

### 2️⃣ Install dependencies  
```bash
npm install
```

### 3️⃣ Start the development server  
```bash
npm run dev
```

---

## 📖 Usage Guide  

### **Step 1: Load Google Sheets Data**  
1. Open a **Google Sheets** document.  
2. Click on **"File"** in the navbar/menu, then **"Share"**, then **"Publish to web"**.  
3. Choose to publish either the **entire document** or a **specific sheet**.  
4. Select **.csv format**, then click **"Publish"**.  
5. Copy the **generated link** and use it in the app.  
6. Paste the link in the **Load Page** and submit.  
7. The app **fetches and processes** the data automatically.

### **Step 2: Select Columns**  
- Choose between **single-column names** or **separate First/Last Name columns**.  
- Select **additional columns** to keep in the dataset.  
- Click **"Preload Data"** to proceed.

### **Step 3: Manage Attendance**  
- The **List Page** displays imported data.  
- Click a **name** to mark attendance (check/uncheck).  
- Changes are saved in **localStorage**, keeping data persistent.
