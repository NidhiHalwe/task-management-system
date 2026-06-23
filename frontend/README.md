# Task Manager Frontend

Setup:

1. Install deps:

```bash
cd frontend
npm install
```

2. Start dev server:

```bash
npm start
```

By default the frontend expects backend API at `http://localhost:5000`.

Access from a phone on the same network:

1. Find your computer's local IP (example: `192.168.1.42`).
2. Start the backend: set `PORT=5000` and run `npm start` in the `backend` folder.
3. Start the frontend with the API URL set to your IP:

```bash
cd frontend
REACT_APP_API_URL=http://192.168.1.42:5000/api npm start
```

4. Open `http://192.168.1.42:3000` on your phone browser. Ensure firewall allows incoming connections to the chosen ports.
