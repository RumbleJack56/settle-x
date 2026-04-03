from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


def ensure_sqlite_legacy_columns(engine: Engine):
    """Adds newly introduced columns for local SQLite DBs without full Alembic migration."""
    if not str(engine.url).startswith("sqlite"):
        return

    inspector = inspect(engine)
    existing_columns = {col["name"] for col in inspector.get_columns("transactions")}

    with engine.begin() as conn:
        if "transaction_type" not in existing_columns:
            conn.execute(
                text("ALTER TABLE transactions ADD COLUMN transaction_type VARCHAR NOT NULL DEFAULT 'GENERIC'")
            )
        if "transaction_metadata" not in existing_columns:
            conn.execute(
                text("ALTER TABLE transactions ADD COLUMN transaction_metadata VARCHAR")
            )

