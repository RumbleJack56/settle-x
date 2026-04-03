Got it. Here's the complete unified document:

---

# MSME Financial Intelligence Platform — Full Implementation Plan

## Vision

A Paytm-style web app with an agentic AI backbone giving MSMEs a unified dashboard for payments, bond-backed treasury simulation, GST compliance via OCR, and real-time cash flow intelligence.

---

## Tech Stack

**Frontend:** Next.js 14 (App Router) + Tailwind CSS — Paytm-style UI, blue/navy palette, card-based layout

**Backend:** FastAPI (Python) — all business logic, AI orchestration, ledger, bond engine

**AI Backbone:** Claude Sonnet 4 via Anthropic API — agentic, multi-tool

**OCR:** GLM-OCR via local Flask server (decoupled, port 5003 proxy over 5002)

**Virtualized Bond System:** In-memory bond registry seeded with real NSE/BSE bond data

**Database:** PostgreSQL (primary ledger) + Redis (cache, real-time NAV, session)

**Message Queue:** Kafka (async compliance events, audit logging)

**Auth:** JWT via FastAPI + NextAuth on frontend

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS FRONTEND                         │
│         Dashboard │ Treasury │ Payments │ Compliance │ Intel     │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS REST + SSE
┌────────────────────────▼────────────────────────────────────────┐
│                      FASTAPI BACKEND                            │
│  /auth  /ledger  /treasury  /payments  /compliance  /ai  /ocr  │
└──┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
   │          │          │          │          │
 PostgreSQL  Redis    Anthropic   Kafka    GLM Proxy
 (ledger)   (NAV/    Claude API  (events)  localhost:5003
            cache)
```

---

## Port Map

| Service | Port | Description |
|---|---|---|
| Next.js frontend | 3000 | Main app |
| FastAPI backend | 8000 | All API routes |
| GLM model (vLLM) | 8080 | Raw model inference |
| glmocr Flask server | 5002 | GLM SDK pipeline |
| GLM CORS proxy | 5003 | What backend calls |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache + NAV store |
| Kafka | 9092 | Event streaming |

---

## API Contract

> This is the full contract between frontend and backend. Both sides can be built independently against this spec. All routes are prefixed `/api/v1`. All requests use `Content-Type: application/json`. Auth routes excluded from JWT requirement.

---

### Authentication

#### `POST /api/v1/auth/register`

**Request**
```json
{
  "business_name": "string",
  "gstin": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Response `201`**
```json
{
  "user_id": "uuid",
  "business_name": "string",
  "gstin": "string",
  "access_token": "jwt_string",
  "refresh_token": "jwt_string"
}
```

---

#### `POST /api/v1/auth/login`

**Request**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response `200`**
```json
{
  "access_token": "jwt_string",
  "refresh_token": "jwt_string",
  "user": {
    "user_id": "uuid",
    "business_name": "string",
    "gstin": "string"
  }
}
```

---

#### `POST /api/v1/auth/refresh`

**Request**
```json
{ "refresh_token": "jwt_string" }
```

**Response `200`**
```json
{ "access_token": "jwt_string" }
```

---

### Wallet & Treasury

#### `GET /api/v1/treasury/wallet`

**Headers:** `Authorization: Bearer <token>`

**Response `200`**
```json
{
  "wallet_id": "uuid",
  "cash_balance": 125000.00,
  "total_nav": 487500.00,
  "accrued_yield_today": 312.50,
  "accrued_yield_total": 4821.00,
  "currency": "INR",
  "last_updated": "ISO8601"
}
```

---

#### `POST /api/v1/treasury/add-money`

**Request**
```json
{
  "amount": 50000.00,
  "source": "upi | bank_transfer | manual"
}
```

**Response `200`**
```json
{
  "transaction_id": "uuid",
  "amount_added": 50000.00,
  "allocation_triggered": true,
  "new_cash_balance": 175000.00,
  "bonds_allocated": [
    {
      "isin": "IN0020210073",
      "name": "7.26% GS 2032",
      "units_bought": 12.5,
      "amount_allocated": 32500.00
    }
  ]
}
```

---

#### `GET /api/v1/treasury/portfolio`

**Response `200`**
```json
{
  "holdings": [
    {
      "isin": "string",
      "bond_name": "string",
      "bond_type": "government | corporate | aaa",
      "face_value": 1000.00,
      "units": 50.0,
      "current_nav": 1045.20,
      "total_value": 52260.00,
      "yield_percent": 7.26,
      "duration_years": 8.4,
      "daily_accrual": 104.25,
      "maturity_date": "ISO8601"
    }
  ],
  "summary": {
    "total_invested": 480000.00,
    "total_nav": 487500.00,
    "weighted_avg_yield": 7.14,
    "total_accrual_today": 312.50
  }
}
```

---

#### `GET /api/v1/treasury/nav-history?days=30`

**Response `200`**
```json
{
  "data_points": [
    { "date": "ISO8601", "nav": 485000.00, "yield": 310.20 }
  ]
}
```

---

#### `POST /api/v1/treasury/redeem`

**Request**
```json
{
  "amount": 20000.00,
  "reason": "payment | withdrawal | emergency"
}
```

**Response `200`**
```json
{
  "redemption_id": "uuid",
  "amount_requested": 20000.00,
  "bonds_liquidated": [...],
  "settlement_time": "T+1 | instant",
  "cash_credited": 20000.00
}
```

---

### Ledger & Payments

#### `GET /api/v1/ledger/entries?page=1&limit=20&from=ISO8601&to=ISO8601&type=debit|credit`

**Response `200`**
```json
{
  "entries": [
    {
      "entry_id": "uuid",
      "timestamp": "ISO8601",
      "type": "debit | credit",
      "amount": 15000.00,
      "counterparty_name": "string",
      "counterparty_vpa": "string",
      "category": "vendor_payment | salary | utility | tax | other",
      "gst_applicable": true,
      "gstin": "string",
      "invoice_ref": "string",
      "status": "completed | pending | failed",
      "ai_category_confidence": 0.94
    }
  ],
  "pagination": {
    "total": 245,
    "page": 1,
    "limit": 20
  }
}
```

---

#### `POST /api/v1/ledger/entries`

**Request**
```json
{
  "type": "debit | credit",
  "amount": 15000.00,
  "counterparty_name": "string",
  "counterparty_vpa": "string",
  "category": "string | null",
  "gst_applicable": true,
  "gstin": "string | null",
  "invoice_ref": "string | null",
  "notes": "string | null"
}
```

**Response `201`**
```json
{
  "entry_id": "uuid",
  "timestamp": "ISO8601",
  "ai_assigned_category": "vendor_payment",
  "ai_category_confidence": 0.94,
  "gst_flag": "valid | missing_gstin | mismatch | not_applicable",
  "double_entry": {
    "debit_account": "accounts_payable",
    "credit_account": "cash"
  }
}
```

---

#### `POST /api/v1/payments/send`

**Request**
```json
{
  "recipient_vpa": "string",
  "amount": 5000.00,
  "note": "string",
  "source": "wallet | bond_redemption"
}
```

**Response `200`**
```json
{
  "payment_id": "uuid",
  "status": "success | pending | failed",
  "utr": "string",
  "timestamp": "ISO8601",
  "balance_after": 120000.00
}
```

---

### Compliance & OCR

#### `POST /api/v1/compliance/ocr/upload`

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `file` | `File` | Invoice image or PDF |
| `document_type` | `string` | `invoice \| receipt \| gst_return \| contract` |

**Response `200`**
```json
{
  "ocr_job_id": "uuid",
  "status": "processing | complete | failed",
  "raw_text": "string",
  "extracted": {
    "vendor_name": "string",
    "vendor_gstin": "string",
    "invoice_number": "string",
    "invoice_date": "ISO8601",
    "line_items": [
      {
        "description": "string",
        "quantity": 10,
        "unit_price": 500.00,
        "amount": 5000.00,
        "hsn_code": "string",
        "gst_rate": 18
      }
    ],
    "subtotal": 5000.00,
    "gst_amount": 900.00,
    "total": 5900.00,
    "currency": "INR"
  },
  "compliance_flags": [
    {
      "flag_type": "missing_gstin | gstin_mismatch | amount_mismatch | invalid_hsn",
      "severity": "error | warning | info",
      "message": "string"
    }
  ],
  "auto_ledger_entry_created": true,
  "ledger_entry_id": "uuid | null"
}
```

---

#### `GET /api/v1/compliance/audit-log?page=1&limit=20`

**Response `200`**
```json
{
  "entries": [
    {
      "audit_id": "uuid",
      "timestamp": "ISO8601",
      "event_type": "ocr_upload | gst_flag | manual_review | ledger_auto_entry",
      "document_ref": "string",
      "flags": [...],
      "resolved": false,
      "resolution_note": "string | null"
    }
  ]
}
```

---

#### `GET /api/v1/compliance/score`

**Response `200`**
```json
{
  "score": 84,
  "max_score": 100,
  "breakdown": {
    "gstin_coverage": 92,
    "invoice_reconciliation": 78,
    "gst_filing_timeliness": 88,
    "fraud_risk": "low | medium | high"
  },
  "open_flags": 3,
  "last_computed": "ISO8601"
}
```

---

### AI Intelligence

#### `POST /api/v1/ai/chat`

**Request**
```json
{
  "message": "string",
  "conversation_history": [
    { "role": "user | assistant", "content": "string" }
  ],
  "context_include": ["ledger", "treasury", "compliance"]
}
```

**Response `200` (SSE stream)**
```
data: {"type": "text_delta", "content": "Based on your ledger..."}
data: {"type": "tool_use", "tool": "analyze_cash_flow", "status": "running"}
data: {"type": "tool_result", "tool": "analyze_cash_flow", "data": {...}}
data: {"type": "text_delta", "content": "Your cash flow shows..."}
data: {"type": "done"}
```

---

#### `GET /api/v1/ai/insights`

**Response `200`**
```json
{
  "generated_at": "ISO8601",
  "insights": [
    {
      "type": "cash_flow_forecast | yield_summary | compliance_alert | spending_anomaly",
      "title": "string",
      "summary": "string",
      "severity": "info | warning | critical",
      "data": {},
      "action_label": "string | null",
      "action_route": "string | null"
    }
  ]
}
```

---

#### `GET /api/v1/ai/cash-flow-forecast`

**Response `200`**
```json
{
  "forecast_generated_at": "ISO8601",
  "horizon_hours": 48,
  "current_balance": 125000.00,
  "predicted_outflows": [
    { "timestamp": "ISO8601", "amount": 15000.00, "category": "vendor_payment", "confidence": 0.87 }
  ],
  "predicted_inflows": [
    { "timestamp": "ISO8601", "amount": 45000.00, "category": "receivable", "confidence": 0.72 }
  ],
  "net_position_48h": 155000.00,
  "liquidity_risk": "low | medium | high",
  "pre_liquidation_recommended": false
}
```

---

### Health & Config

#### `GET /api/v1/health`

**Response `200`**
```json
{
  "status": "ok",
  "services": {
    "database": "ok | degraded | down",
    "redis": "ok | degraded | down",
    "glm_ocr": "ok | degraded | down",
    "anthropic": "ok | degraded | down",
    "kafka": "ok | degraded | down"
  },
  "version": "1.0.0"
}
```

---

## Error Contract

All errors follow this shape across every endpoint:

```json
{
  "error": {
    "code": "INSUFFICIENT_FUNDS | OCR_FAILED | INVALID_GSTIN | AUTH_EXPIRED | ...",
    "message": "Human readable string",
    "field": "field_name | null",
    "request_id": "uuid"
  }
}
```

| HTTP Code | When |
|---|---|
| `400` | Validation error, bad input |
| `401` | Missing or expired JWT |
| `403` | Forbidden (wrong user resource) |
| `404` | Resource not found |
| `422` | Unprocessable entity (semantic error) |
| `429` | Rate limited |
| `500` | Internal server error |
| `503` | Downstream service down (GLM, Anthropic) |

---

## GLM-OCR Service Setup

### Choosing a Backend

**Option A — Zhipu Cloud (no GPU, fastest to start)**

Get a key from `open.bigmodel.cn`, set in `config.yaml`:
```yaml
pipeline:
  ocr_api:
    api_host: open.bigmodel.cn
    api_port: 443
    api_scheme: https
    api_key: YOUR_KEY
```

**Option B — Self-host with vLLM (GPU required)**
```bash
pip install -U vllm --extra-index-url https://wheels.vllm.ai/nightly
pip install git+https://github.com/huggingface/transformers.git
vllm serve zai-org/GLM-OCR --allowed-local-media-path / --port 8080
```

### Install & Start Flask Server
```bash
pip install glmocr
python -m glmocr.server   # starts on port 5002
```

### CORS Proxy Wrapper

The FastAPI backend calls this proxy, not GLM directly:

```python
# glm_proxy.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

GLM_SERVER = "http://localhost:5002"

@app.route("/ocr/parse", methods=["POST"])
def parse():
    data = request.json
    resp = requests.post(f"{GLM_SERVER}/glmocr/parse", json=data)
    return jsonify(resp.json())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)
```

```bash
pip install flask flask-cors requests
python glm_proxy.py   # starts on port 5003
```

To move GLM to a separate machine later, change only `GLM_SERVER` in `glm_proxy.py`.

---

## Module Build Order

### Module 1 — Shell & Navigation
Next.js App Router scaffold, Paytm-style layout: top nav, sidebar, bottom tab bar. Pages: Dashboard, Treasury, Payments, Compliance, Intelligence. Global auth context + API client wrapper with JWT auto-refresh.

### Module 2 — Auth (FastAPI + NextAuth)
Register/login endpoints, JWT issue + refresh, PostgreSQL `users` table with GSTIN, NextAuth session on frontend.

### Module 3 — Ledger & Payments (FastAPI)
Double-entry PostgreSQL ledger. Every transaction creates two rows (debit + credit). AI auto-categorization via Claude on every insert. Feed into Kafka topic `ledger.events` for async compliance processing.

### Module 4 — Virtualized Bond Treasury (FastAPI)
Seeded bond registry (10 real NSE/GOI bonds with ISIN, yield, duration). On `add-money`, RL-style allocation heuristic (maximize yield, constrain duration < 3yr for liquidity). NAV computed on every fetch using accrual math. Redis caches NAV, recomputes every 60s. No real trades.

### Module 5 — AI Agentic Backbone (FastAPI + Claude)
Single Claude Sonnet 4 agent with four tools exposed via FastAPI SSE stream:
- `analyze_cash_flow` — reads last 90 days of ledger, returns LSTM-style trend + 48h forecast
- `suggest_bond_allocation` — given balance, returns allocation plan
- `flag_compliance_risk` — scans transactions for GST anomalies
- `generate_financial_summary` — weekly P&L narrative in plain language

Agent runs silently on login to populate insight cards. Also powers the chat widget.

### Module 6 — OCR Compliance Engine (FastAPI + GLM)
`POST /api/v1/compliance/ocr/upload` → multipart file → base64 → `POST localhost:5003/ocr/parse` → raw text → Claude structures into invoice schema → compliance flags computed → auto-ledger entry created → audit log written to Kafka.

### Module 7 — Intelligence Dashboard (Next.js)
Four insight cards hydrated from `GET /ai/insights` on page load. Cash flow sparkline from `GET /ai/cash-flow-forecast`. Compliance score ring chart. Co-pilot chat bubble (SSE-connected to `/ai/chat`).

---

## UI Design Spec

- **Primary color:** `#00B9F1` (Paytm cyan)
- **Secondary:** `#002970` (navy)
- **Background:** `#F5F7FA`
- **Cards:** white, `rounded-2xl`, `shadow-sm`
- **Top bar:** logo + nav links + "Add Money" CTA (cyan, prominent)
- **Dashboard hero:** large dark navy balance card showing wallet + accrued yield
- **Quick actions row:** Send Money, Add Money, View Returns, Upload Invoice — icon grid
- **Cards grid:** 2×2 desktop, stacked mobile
- **Chat bubble:** fixed bottom-right, opens SSE-connected AI co-pilot panel

---

## Data Flow Summary

```
User uploads invoice
  → Next.js sends multipart to FastAPI /compliance/ocr/upload
  → FastAPI base64-encodes → calls GLM proxy :5003
  → GLM extracts raw text
  → FastAPI sends text to Claude with extraction prompt
  → Claude returns structured invoice JSON
  → FastAPI runs compliance checks (GSTIN, HSN, amount)
  → Flags written to Kafka → audit log persisted
  → Auto ledger entry created
  → Response returned to frontend with full extraction + flags

User asks AI co-pilot "Will I have enough cash next week?"
  → Next.js SSE connection to FastAPI /ai/chat
  → FastAPI instantiates Claude agent with ledger + treasury context
  → Agent calls analyze_cash_flow tool
  → Tool queries PostgreSQL, returns 48h forecast
  → Agent streams response tokens back via SSE
  → Frontend renders progressively
```

---

## Environment Variables

### FastAPI `.env`
```
DATABASE_URL=postgresql://user:pass@localhost:5432/msme_platform
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
GLM_OCR_URL=http://localhost:5003
KAFKA_BOOTSTRAP=localhost:9092
JWT_SECRET=...
JWT_EXPIRE_MINUTES=60
```

### Next.js `.env.local`
```
NEXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

---

## What's Virtualized vs Real

| Feature | Approach |
|---|---|
| Bond purchases | Simulated — seeded portfolio, math-accurate NAV accrual |
| Yield accrual | Real formula, real bond data, virtual time |
| UPI payments | Logged to ledger only, no actual transfer |
| GST filing | Extracted + flagged, no GSTN API submission |
| Bond market prices | Seeded from public NSE data, static |
| AI analysis | 100% real — live Claude agent on actual ledger data |
| OCR | 100% real — GLM-OCR on actual uploaded documents |
| Cash flow forecast | Real LSTM-style trend from actual ledger history |