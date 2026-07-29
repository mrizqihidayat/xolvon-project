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
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
    )

    app.register_blueprint(products_bp,     url_prefix="/api/v1")
    app.register_blueprint(transactions_bp, url_prefix="/api/v1")
    app.register_blueprint(checkout_bp,     url_prefix="/api/v1")

    @app.get("/")
    def health():
        return {"status": "ok", "service": "xolvon project backend", "version": "v1"}

    return app
