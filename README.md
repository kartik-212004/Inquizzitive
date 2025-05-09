# Inquizzitive: AI Quiz Generation 🚀

**Inquizzitive** is a browser extension and web app that generates quizzes from educational content using AI. It's designed to support self-learning by turning text, files, or Google Docs into engaging questions.

---

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/AOSSIE-Org/EduAid.git
cd EduAid
```

### 2. Backend Setup

**Option A: Manual**

* [Download Sense2Vec model](https://github.com/explosion/sense2vec/releases/download/v1.0.0/s2v_reddit_2015_md.tar.gz) → Extract to `backend/`
* Install dependencies:

  ```bash
  pip install -r requirements.txt
  ```
* Start the backend:

  ```bash
  cd backend
  python server.py
  ```

**Option B: Script**

```bash
cd backend
chmod +x script.sh
./script.sh
```

### 3. Google API Configuration

* Add credentials to:

  * `service_account_key.json` → Google Docs API
  * `credentials.json` → Google Forms API

Refer to official docs for setup.

---

## 🌐 Web App

```bash
cd eduaid_web
npm install
npm run start
```




