# app/__init__.py
from flask import Flask
from flask_cors import CORS

from .core.config import Config
from .core.extensions import supabase_client  # noqa: F401
from .api.v1.products.router import products_bp
from .api.v1.transactions.router import transactions_bp
from .api.v1.checkout.router import checkout_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(
        app,
        resources={r"/api/*": {"origins": [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
        ]}},
        supports_credentials=True,
    )

    app.register_blueprint(products_bp,     url_prefix="/api/v1")
    app.register_blueprint(transactions_bp, url_prefix="/api/v1")
    app.register_blueprint(checkout_bp,     url_prefix="/api/v1")

    @app.get("/")
    def health():
        return {"status": "ok", "service": "xolvon project backend", "version": "v1"}

    return app
