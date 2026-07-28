from typing import Optional
from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    """Schema for POST /api/v1/products — create a new product."""
    name:      str            = Field(..., min_length=1, max_length=255)
    category:  str            = Field(default="Uncategorized", max_length=100)
    price:     float          = Field(..., ge=0, description="Price in IDR, must be >= 0")
    stock:     int            = Field(..., ge=0, description="Stock count, must be >= 0")
    is_active: bool           = Field(default=True)
    image_url: Optional[str]  = Field(default=None)


class ProductUpdate(BaseModel):
    """Schema for PUT /api/v1/products/<id> — partial update (all fields optional)."""
    name:      Optional[str]   = Field(default=None, min_length=1, max_length=255)
    category:  Optional[str]   = Field(default=None, max_length=100)
    price:     Optional[float] = Field(default=None, ge=0)
    stock:     Optional[int]   = Field(default=None, ge=0)
    is_active: Optional[bool]  = Field(default=None)
    image_url: Optional[str]   = Field(default=None)


class ProductResponse(BaseModel):
    """Schema representing a product returned from the database."""
    id:        str
    name:      str
    category:  str
    price:     float
    stock:     int
    is_active: bool
    image_url: Optional[str]
    created_at: str
