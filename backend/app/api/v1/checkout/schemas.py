from typing import List
from pydantic import BaseModel, Field


class CheckoutItem(BaseModel):
    """
    A single item sent by the frontend.
    NOTE: No 'price' field — prices are fetched server-side from the DB.
    """
    product_id: str = Field(..., min_length=1, description="UUID of the product")
    quantity:   int = Field(..., gt=0, description="Quantity must be > 0")


class CheckoutRequest(BaseModel):
    """Full checkout request body."""
    items:          List[CheckoutItem] = Field(..., min_length=1)
    payment_method: str                = Field(default="Cash", max_length=50)


class CheckoutResponse(BaseModel):
    """Response returned after a successful checkout."""
    success:        bool
    transaction_id: str
