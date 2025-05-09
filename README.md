
# 📱 Εφαρμογή Κράτησης Θέσεων σε Εστιατόριο

Η εφαρμογή επιτρέπει σε χρήστες να εγγραφούν, να συνδεθούν και να κάνουν κρατήσεις σε εστιατόρια από το κινητό τους. Αναπτύχθηκε στο πλαίσιο του μαθήματος Mobile & Distributed Systems (CN6035).

## ⚙ Τεχνολογίες
- Frontend: React Native με Expo Router
- Backend: Node.js + Express
- Database: MariaDB
- Authentication: JSON Web Tokens (JWT)

## 🚀 Εκκίνηση Backend
```bash
cd backend
npm install
npm start
```

## 📱 Εκκίνηση Frontend (Expo)
```bash
cd frontend
npm install
npx expo start
```

## 🔐 .env αρχείο (Backend)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=restaurant_app
JWT_SECRET=secret123
```

## 🗂️ Δομή φακέλων
```
.
├── backend/
│   ├── routes/
│   ├── services/
│   ├── server.js
├── frontend/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── index.js
```

## 👥 Λειτουργίες Χρήστη
- Εγγραφή & Σύνδεση
- Προβολή λίστας εστιατορίων
- Δημιουργία κράτησης
- Προβολή / τροποποίηση / διαγραφή κρατήσεων
- Αποσύνδεση
