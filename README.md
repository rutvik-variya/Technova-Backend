# Technova-Backend

## Deploy to Render

1. Push this repository to GitHub and create a new Blueprint in Render for it. Render will read [`render.yaml`](./render.yaml).
2. Create a PostgreSQL database in Render. Set `DATABASE_URL` on the web service to the database's **internal** connection URL (keep the database and service in the same region).
3. Set the prompted environment variables in the Render dashboard:
   - `CORS_ORIGIN`: the exact origin of the deployed frontend, including `https://` and without a trailing slash.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `ADMIN_PASSWORD`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` (use Razorpay test credentials until ready for live payments).
4. Deploy. The build generates the Prisma client and compiles TypeScript. The start command applies committed Prisma migrations before starting the API. Render supplies `PORT`; do not set it manually.
5. Verify the service is healthy by opening `https://<your-service>.onrender.com/api/health`. It should return `{"message":"TechNova API Running"}`.

The free web-service plan may sleep when idle, so the first health-check request after inactivity can take longer. Do not commit production secrets or a local `.env` file.

## Local checks

```sh
npm ci
npx prisma generate
npm run build
```

The project currently has no automated test script. A successful build checks TypeScript compilation; the deployed `/api/health` endpoint is the basic runtime smoke check.
