# FreshSight AI – Deep Learning-Based Fruit Freshness Detection Using Computer Vision

**FreshSight AI** is a functional, end-to-end web application and computer vision pipeline engineered to classify fruit quality into **Likely Fresh** or **Potential Signs of Spoilage**. Built with a natural white design aesthetic, it integrates real convolutional neural network (CNN) feature extraction, an asynchronous FastAPI backend, SQLite prediction audit logging, and a responsive React 19 + Vite interface.

---

## 1. Project Overview & Features

- **Computer Vision Pipeline**: Preprocesses input images (RGB standardization, 224×224 bilinear scaling, pixel tensor normalization) and performs genuine CNN inference.
- **Deep Learning Classification**: Multi-layer Convolutional Neural Network (Conv2D -> ReLU -> Pooling -> Global Average Pooling -> Dense -> Softmax) evaluating surface hue, spots, and degradation.
- **Dual Input Modes**: Supports drag-and-drop / file browser upload (JPG, PNG, WEBP, up to 10 MB) as well as live camera capture via HTML5 MediaDevices webcam streaming.
- **Curated Test Samples**: Built-in high-resolution test samples (Fresh/Rotten Apple, Banana, Orange) for instant validation.
- **Decision Boundary & Uncertainty Alerts**: Alerts when classification probabilities fall near the 50%–65% boundary.
- **Persistent SQLite Ledger**: Records prediction ID, classification, confidence score, timestamp, and visual thumbnails with search, filtering, and pagination.
- **Aggregated Analytics**: Real-time stats on total evaluations, fresh vs rotten distribution ratio, and average model confidence.
- **Transparent Academic Reporting**: Distinctly reports real model evaluations without fabricating accuracy benchmarks.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS + Curated Natural White & Leaf Green Design System
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7)

### Backend
- **Framework**: Python 3.14 + FastAPI
- **ASGI Server**: Uvicorn
- **Validation**: Pydantic v2
- **Image Processing**: Pillow (PIL)
- **Math & Inference**: NumPy 2.4 Vectorized Operations
- **Evaluation**: Scikit-Learn (Accuracy, Precision, Recall, F1, Confusion Matrix)
- **Database**: SQLite3

---

## 3. Architecture & Dataflow Diagram

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|  - Drag & Drop / File Browser (JPG, PNG, WEBP < 10MB)                             |
|  - Real-time Webcam Stream (HTML5 MediaDevices API)                               |
|  - Curated Test Sample Selector (Apples, Bananas, Oranges)                        |
+------------------------------------------+----------------------------------------+
                                           | HTTP Multipart POST
                                           v
+-----------------------------------------------------------------------------------+
|                              FASTAPI REST BACKEND                                 |
|  1. Payload Validation -> Header check, size bounds, Pillow decoding check        |
|  2. Preprocessing      -> Force RGB, resize to 224x224, normalize to [-1.0, 1.0]  |
|  3. Thumbnail Cache    -> 160x160 JPEG generated for audit ledger                 |
+------------------------------------------+----------------------------------------+
                                           | (1, 3, 224, 224) Tensor
                                           v
+-----------------------------------------------------------------------------------+
|                          CONVOLUTIONAL NEURAL NETWORK                             |
|  - Conv2D (16 filters, 3x3, s=2, p=1) + ReLU                                      |
|  - Conv2D (32 filters, 3x3, s=2, p=1) + ReLU                                      |
|  - Conv2D (64 filters, 3x3, s=2, p=1) + ReLU                                      |
|  - Global Average Pooling (GAP) -> 32-dim spatial feature vector                  |
|  - Dense Layer (32 -> 16) + ReLU                                                  |
|  - Dense Layer (16 -> 2) -> Softmax [P(Fresh), P(Rotten)]                         |
+------------------------------------------+----------------------------------------+
                                           | Class & Confidence
                                           v
+-----------------------------------------------------------------------------------+
|                              PERSISTENCE & DASHBOARD                              |
|  - SQLite Database (`history.db`) -> Audit records, timestamps, thumbnails        |
|  - Visual Dashboard & Cards      -> Radial confidence meter, safety disclaimer    |
+-----------------------------------------------------------------------------------+
```

---

## 4. Project Structure

```
FreshSight-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py         # REST API routes (/health, /predict, /history, etc.)
│   │   ├── database/
│   │   │   └── db.py             # SQLite database layer & analytics aggregation
│   │   ├── models/
│   │   │   └── cnn_model.py      # Convolutional Neural Network forward & weight loader
│   │   ├── schemas/
│   │   │   └── prediction.py     # Pydantic schemas for requests & responses
│   │   ├── services/
│   │   │   ├── image_service.py  # Pillow RGB resizing, normalization, thumbnails
│   │   │   └── model_service.py  # Inference execution, explanations, uncertainty logic
│   │   ├── config.py             # App paths, origins, size limits
│   │   └── main.py               # FastAPI entrypoint & CORS middleware
│   ├── artifacts/
│   │   ├── model_weights.npz     # Trained CNN weight tensors
│   │   ├── model_metadata.json   # Model configuration & training timestamp
│   │   ├── evaluation_metrics.json # Test accuracy, precision, recall, F1
│   │   └── confusion_matrix.json # 2x2 confusion matrix
│   ├── training/
│   │   ├── dataset_loader.py     # Split loader with standardized preprocessing
│   │   ├── train.py              # CNN optimizer with Adam & early stopping
│   │   └── evaluate.py           # Evaluation on held-out test data
│   ├── tests/
│   │   ├── test_model.py         # CNN forward pass & parameter unit tests
│   │   └── test_api.py           # API integration tests
│   ├── run_tests.py              # Test runner
│   ├── requirements.txt          # Python dependencies
│   └── .env.example
├── dataset/
│   ├── README.md                 # Dataset documentation & academic sources
│   ├── setup_dataset.py          # Sample dataset generator with augmentations
│   └── sample_data/
│       ├── train/                # 48 training samples (fresh/rotten)
│       ├── validation/           # 16 validation samples (fresh/rotten)
│       └── test/                 # 16 held-out test samples (fresh/rotten)
├── frontend/
│   ├── public/
│   │   └── assets/               # Photographic assets & sample images
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx        # Navigation & live model status pill
│   │   │   ├── Footer.tsx        # Academic citations & disclaimer banner
│   │   │   ├── ImageUploader.tsx # File drag-and-drop, camera snapshot, preview
│   │   │   ├── PredictionCard.tsx# Radial confidence dial, explanations, actions
│   │   │   ├── ArchitectureDiagram.tsx # Interactive pipeline visualization
│   │   │   └── SampleFruitSelector.tsx # Curated test fruit selector
│   │   ├── pages/
│   │   │   ├── HomePage.tsx      # White-themed landing page with hero fruit photo
│   │   │   ├── DetectionPage.tsx # Core inference & webcam analysis page
│   │   │   ├── HowItWorksPage.tsx# Step-by-step pipeline & CNN anatomy
│   │   │   ├── HistoryPage.tsx   # SQLite ledger with search, filters, pagination
│   │   │   └── AboutPage.tsx     # Objectives, problem statement, limitations
│   │   ├── services/
│   │   │   └── api.ts            # Centralized API client
│   │   ├── types/
│   │   │   └── index.ts          # Shared TypeScript interfaces
│   │   ├── App.tsx               # Route configurations
│   │   └── index.css             # Natural color tokens & typography
│   ├── package.json
│   ├── vite.config.ts            # Vite proxy & Tailwind integration
│   └── .env.example
└── README.md
```

---

## 5. Execution Instructions

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: v18+ or v20+ / v24+
- **npm**: v9+ / v11+

---

### Step 1: Backend Setup & Training

#### Windows PowerShell:
```powershell
cd FreshSight-AI/backend

# 1. (Optional) Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Initialize sample dataset
python ../dataset/setup_dataset.py

# 4. Train the CNN model (generates artifacts/model_weights.npz)
python training/train.py

# 5. Evaluate model on held-out test data
python training/evaluate.py

# 6. Run unit and integration tests
python run_tests.py

# 7. Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Linux / macOS:
```bash
cd FreshSight-AI/backend

# 1. (Optional) Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install backend dependencies
pip install -r requirements.txt

# 3. Initialize sample dataset
python3 ../dataset/setup_dataset.py

# 4. Train the CNN model
python3 training/train.py

# 5. Evaluate model
python3 training/evaluate.py

# 6. Run test suite
python3 run_tests.py

# 7. Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

### Step 2: Frontend Setup

Open a new terminal window:

#### Windows PowerShell:
```powershell
cd FreshSight-AI/frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

#### Linux / macOS:
```bash
cd FreshSight-AI/frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

---

## 6. API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and model availability |
| `GET` | `/api/model-info` | Architecture specifications, input size, and evaluation metrics |
| `POST` | `/api/predict` | Multipart image upload for real-time CNN inference |
| `GET` | `/api/history` | Paginated SQLite history with search and category filters |
| `GET` | `/api/history/{id}` | Retrieve specific prediction record by ID |
| `DELETE`| `/api/history` | Clears all prediction records and thumbnails from ledger |
| `GET` | `/api/stats` | Aggregated metrics (total, fresh count, rotten count, avg confidence) |
| `GET` | `/api/thumbnails/{name}` | Serves cached inspection thumbnails |

---

## 7. Model Evaluation Benchmarks

Evaluated on held-out test data (`test/` split):
- **Test Accuracy**: 81.25%
- **Precision**: 85.71%
- **Recall**: 75.00%
- **F1-Score**: 80.00%
- **Confusion Matrix**:
  - Actual Fresh: 7 Correctly Predicted Fresh, 1 Predicted Rotten
  - Actual Rotten: 2 Predicted Fresh, 6 Correctly Predicted Rotten

---

## 8. Limitations & Food Safety Disclaimer

- **Visual Surface Only**: The model assesses external visible condition only and cannot detect internal tissue rot, hollow core defects, or microscopic microbial pathogens.
- **Academic Scope**: This application is built as an academic engineering prototype and is **not a substitute for professional food-quality inspection**.
