import sqlite3
import math
from typing import Optional, List, Dict, Any, Tuple
from app.config import settings

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id TEXT PRIMARY KEY,
                prediction TEXT NOT NULL,
                confidence REAL NOT NULL,
                model_name TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                fruit_type TEXT,
                explanation TEXT,
                image_url TEXT
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pred_timestamp ON predictions(timestamp)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pred_class ON predictions(prediction)")
        conn.commit()
    finally:
        conn.close()

def save_prediction(data: Dict[str, Any]) -> str:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO predictions (id, prediction, confidence, model_name, timestamp, fruit_type, explanation, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["id"],
            data["prediction"],
            data["confidence"],
            data["model_name"],
            data["timestamp"],
            data.get("fruit_type"),
            data.get("explanation"),
            data.get("image_url")
        ))
        conn.commit()
        return data["id"]
    finally:
        conn.close()

def get_history(
    search: Optional[str] = None,
    filter_class: Optional[str] = None,
    sort_order: str = "desc",
    page: int = 1,
    limit: int = 10
) -> Tuple[List[Dict[str, Any]], int, int]:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        
        where_clauses = []
        params = []
        
        if filter_class and filter_class.lower() in ["fresh", "rotten"]:
            where_clauses.append("LOWER(prediction) = LOWER(?)")
            params.append(filter_class)
            
        if search:
            where_clauses.append("(id LIKE ? OR explanation LIKE ? OR fruit_type LIKE ?)")
            term = f"%{search}%"
            params.extend([term, term, term])
            
        where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
        
        # Count total
        count_cursor = conn.cursor()
        count_cursor.execute(f"SELECT COUNT(*) FROM predictions {where_sql}", params)
        total = count_cursor.fetchone()[0]
        
        # Sorting
        order = "DESC" if sort_order.lower() == "desc" else "ASC"
        offset = (page - 1) * limit
        
        query = f"""
            SELECT id, prediction, confidence, model_name, timestamp, fruit_type, explanation, image_url
            FROM predictions
            {where_sql}
            ORDER BY timestamp {order}
            LIMIT ? OFFSET ?
        """
        cursor.execute(query, params + [limit, offset])
        rows = cursor.fetchall()
        
        items = [dict(row) for row in rows]
        pages = max(1, math.ceil(total / limit)) if total > 0 else 1
        return items, total, pages
    finally:
        conn.close()

def get_prediction_by_id(prediction_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM predictions WHERE id = ?", (prediction_id,))
        row = cursor.fetchone()
        return dict(row) if row else None
    finally:
        conn.close()

def clear_history() -> int:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM predictions")
        count = cursor.fetchone()[0]
        cursor.execute("DELETE FROM predictions")
        conn.commit()
        return count
    finally:
        conn.close()

def get_stats() -> Dict[str, Any]:
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM predictions")
        total = cursor.fetchone()[0]
        
        if total == 0:
            return {
                "total_predictions": 0,
                "fresh_count": 0,
                "rotten_count": 0,
                "avg_confidence": 0.0,
                "fresh_percentage": 0.0
            }
            
        cursor.execute("SELECT COUNT(*) FROM predictions WHERE LOWER(prediction) = 'fresh'")
        fresh_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM predictions WHERE LOWER(prediction) = 'rotten'")
        rotten_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT AVG(confidence) FROM predictions")
        avg_conf_row = cursor.fetchone()[0]
        avg_conf = float(avg_conf_row) if avg_conf_row is not None else 0.0
        
        fresh_pct = (fresh_count / total * 100.0) if total > 0 else 0.0
        
        return {
            "total_predictions": total,
            "fresh_count": fresh_count,
            "rotten_count": rotten_count,
            "avg_confidence": round(avg_conf, 4),
            "fresh_percentage": round(fresh_pct, 1)
        }
    finally:
        conn.close()
