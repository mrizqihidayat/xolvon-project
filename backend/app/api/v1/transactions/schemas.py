from typing import Optional, List
from pydantic import BaseModel


class TransactionItemResponse(BaseModel):
    """A single line-item inside a transaction."""
    id:             str
    transaction_id: str
    product_id:     str
    quantity:       int
    price:          float   # static historical price at time of sale
    subtotal:       float
    products:       Optional[dict] = None  # joined product name & image


class TransactionResponse(BaseModel):
    """A complete transaction with its line items."""
    id:                str
    total_amount:      float
    payment_method:    str
    created_at:        str
    transaction_items: List[TransactionItemResponse] = []
