# marketing_helper_fe

Frontend Angular del progetto marketing_helper.

## API target

Il frontend comunica con il backend su `environment.apiUrl`.
Per il workflow agent usa il gateway backend:

- `POST /api/agent/invoke`

Non e' previsto accesso diretto FE -> servizio agent in questa fase MVP.

## Run locale

```bash
npm install
npm run start
```

Con Docker Compose l'app e' disponibile su `http://localhost:4200`.
