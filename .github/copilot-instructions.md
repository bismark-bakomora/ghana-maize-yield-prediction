# GitHub Copilot Instructions for this Repository

This file gives actionable, repository-specific guidance for AI coding agents working on the Ghana Maize Yield Prediction project.

Overview
- **Architecture:** Backend is a FastAPI app under [api/](api/) (entry: [api/main.py](api/main.py)). Frontend is a Vite + React TypeScript app under [frontend/](frontend/) (see [frontend/README.md](frontend/README.md)). Trained ML artifacts live in [models/trained/](models/trained).
- **Data & models:** Data lives in [data/processed/](data/processed/). Trained model files follow the pattern `best_model_*.pkl`, with `scaler.pkl` and `model_metadata_*.json` in the same folder; the code expects these exact names (see [api/services/model_service.py](api/services/model_service.py)).

What to know about the backend
- App startup: the model is loaded at FastAPI startup via `ModelService` and stored on `app.state.model_service` (see [api/main.py](api/main.py#L1)). Use the `get_model_service` dependency in routes to access it.
- Routes: prediction endpoints live in [api/routes/prediction.py](api/routes/prediction.py). Follow the existing request/response Pydantic schemas in [api/schemas/](api/schemas/) when returning or consuming JSON.
- DB: minimal SQLAlchemy setup exists under [api/db/](api/db/) and `Base.metadata.create_all(bind=engine)` is called at startup to ensure tables exist.
- Error handling: global exception handlers are defined in [api/main.py](api/main.py) — prefer raising HTTPException with clear `detail` strings for API errors.

Model & prediction conventions
- The `ModelService` performs feature engineering, expects metadata key `features_used` in `model_metadata_*.json`, and will raise when required features are missing. When changing models, update `model_metadata_*.json` accordingly.
- Prediction outputs are schema-aligned: keys such as `prediction`, `confidence_interval`, `risk_factors`, `recommendations`, and `model_version` are expected by the API response models (see [api/schemas/prediction_schema.py](api/schemas/prediction_schema.py)).
- To add or replace a model: drop `best_model_*.pkl`, `scaler.pkl` and matching `model_metadata_*.json` into [models/trained/](models/trained/) and restart the API (or reinitialize `ModelService`).

Developer workflows (commands)
- Backend local dev: activate the Python venv then run:

```powershell
& venv\Scripts\Activate.ps1
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

- Frontend local dev:

```bash
cd frontend
npm install
npm run dev
```

- Docker: repository includes `Dockerfile` and `docker-compose.yml` for containerized runs. Inspect [Dockerfile](Dockerfile) for entrypoint and environment variable conventions.

Project-specific patterns & gotchas
- Feature mapping: input JSON keys (lower_snake) are mapped to model feature columns (TitleCase) inside `ModelService._prepare_features`. When adding new fields, update this mapping.
- Engineering steps: `ModelService._engineer_features` contains handcrafted feature transforms used in production — keep changes backward-compatible or add versioned metadata.
- Tests: a lightweight test exists at `test_prediction.py`. Use it to sanity-check prediction outputs after model updates.

Integration points
- Frontend communicates with backend under `/api/v1` (see routers in [api/main.py](api/main.py)). CORS is permissive in dev (`allow_origins=['*']`) — be cautious when preparing production changes.
- Model artifacts are file-based; there is no model registry or remote storage in the codebase. CI/CD that deploys a new model must copy artifacts into `models/trained/` in the deployed image.

When editing code, follow these rules
- Preserve public route contracts: do not change response keys without updating Pydantic schemas in [api/schemas/].
- Keep `ModelService` initialization cheap; heavy retraining or long operations should be offloaded to offline jobs, not startup.
- If adding new model artifact names, also update `_load_model/_load_metadata` to keep discovery deterministic.

Quick references
- App entry: [api/main.py](api/main.py)
- Prediction routes: [api/routes/prediction.py](api/routes/prediction.py)
- Model service: [api/services/model_service.py](api/services/model_service.py)
- Trained models folder: [models/trained/](models/trained)
- Frontend: [frontend/](frontend)

If anything here is unclear or you want the instructions to include more examples (unit tests, CI steps, or common PR tasks), tell me which areas to expand.
