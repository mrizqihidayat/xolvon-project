from flask import Blueprint, jsonify, request
from pydantic import ValidationError
from postgrest.exceptions import APIError

from app.core.extensions import supabase_client as db
from .schemas import ProductCreate, ProductUpdate

products_bp = Blueprint("products", __name__)

@products_bp.get("/products")
def get_active_products():
    """Returns only is_active=True products for the POS screen."""
    try:
        res = (
            db.table("products")
            .select("*")
            .eq("is_active", True)
            .order("created_at", desc=False)
            .execute()
        )
        return jsonify(res.data), 200
    except APIError as e:
        return jsonify({"error": str(e)}), 500


@products_bp.get("/products/all")
def get_all_products():
    """Returns all products (active + inactive) for the management screen."""
    try:
        res = (
            db.table("products")
            .select("*")
            .order("created_at", desc=False)
            .execute()
        )
        return jsonify(res.data), 200
    except APIError as e:
        return jsonify({"error": str(e)}), 500

@products_bp.post("/products")
def create_product():
    try:
        body = ProductCreate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422

    try:
        res = db.table("products").insert(body.model_dump()).execute()
        return jsonify(res.data[0]), 201
    except APIError as e:
        return jsonify({"error": str(e)}), 500

@products_bp.put("/products/<string:product_id>")
def update_product(product_id: str):
    try:
        body = ProductUpdate(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422

    updates = body.model_dump(exclude_none=True)
    if not updates:
        return jsonify({"error": "No valid fields provided for update"}), 400

    try:
        res = (
            db.table("products")
            .update(updates)
            .eq("id", product_id)
            .execute()
        )
        if not res.data:
            return jsonify({"error": "Product not found"}), 404
        return jsonify(res.data[0]), 200
    except APIError as e:
        return jsonify({"error": str(e)}), 500

@products_bp.delete("/products/<string:product_id>")
def delete_product(product_id: str):
    try:
        res = (
            db.table("products")
            .delete()
            .eq("id", product_id)
            .execute()
        )
        if not res.data:
            return jsonify({"error": "Product not found"}), 404
        return jsonify({"message": "Product deleted successfully"}), 200
    except APIError as e:
        return jsonify({"error": str(e)}), 500
