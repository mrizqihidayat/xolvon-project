from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from app.core.extensions import supabase_client as db
from .schemas import CheckoutRequest

checkout_bp = Blueprint("checkout", __name__)


@checkout_bp.post("/checkout")
def checkout():

    # ── 1. Validate request shape via Pydantic schema ─────────────────────
    try:
        body = CheckoutRequest(**request.get_json(force=True))
    except ValidationError as e:
        return jsonify({"error": e.errors()}), 422

    # Serialise items to plain dicts for the Supabase RPC (JSONB param)
    items_payload = [item.model_dump() for item in body.items]

    # ── 2. Call the atomic Supabase RPC ───────────────────────────────────
    response = db.rpc(
        "process_checkout",
        {"items": items_payload, "payment_method": body.payment_method},
    ).execute()

    # ── 3. Handle RPC-level errors ────────────────────────────────────────
    if hasattr(response, "error") and response.error:
        err_msg: str = str(response.error)
        if "INSUFFICIENT_STOCK" in err_msg:
            parts = err_msg.split("INSUFFICIENT_STOCK:")
            bad_id = parts[1].strip() if len(parts) > 1 else "unknown"
            return jsonify(
                {"error": "Insufficient stock", "product_id": bad_id}
            ), 400
        return jsonify({"error": "Checkout failed. Please try again."}), 500

    # ── 4. Normalise transaction_id from RPC return value ─────────────────
    transaction_id = response.data if isinstance(response.data, str) else None
    if not transaction_id:
        if isinstance(response.data, list) and len(response.data) > 0:
            transaction_id = str(response.data[0])
        else:
            transaction_id = str(response.data)

    return jsonify({"success": True, "transaction_id": transaction_id}), 201
