from flask import Blueprint, jsonify
from postgrest.exceptions import APIError

from app.core.extensions import supabase_client as db

transactions_bp = Blueprint("transactions", __name__)

@transactions_bp.get("/transactions")
def get_transactions():
    """
    Returns every transaction joined with its items and product details.
    Ordered by newest first for the Transaction History screen.
    """
    try:
        res = (
            db.table("transactions")
            .select("*, transaction_items(*, products(name, image_url))")
            .order("created_at", desc=True)
            .execute()
        )
        return jsonify(res.data), 200
    except APIError as e:
        return jsonify({"error": str(e)}), 500

@transactions_bp.get("/transactions/<string:tx_id>")
def get_transaction(tx_id: str):
    """
    Returns a single transaction with all its line items.
    Used for the split-view detail panel in the Transaction History screen.
    """
    try:
        res = (
            db.table("transactions")
            .select("*, transaction_items(*, products(name, image_url))")
            .eq("id", tx_id)
            .single()
            .execute()
        )
        if not res.data:
            return jsonify({"error": "Transaction not found"}), 404
        return jsonify(res.data), 200
    except APIError as e:
        return jsonify({"error": str(e)}), 500
