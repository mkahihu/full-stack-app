"""Pydantic schemas for request/response validation."""
from datetime import datetime
from typing import List
from pydantic import BaseModel, Field

class CalculationRequest(BaseModel):
    """Schema for calculation request."""
    expression: str = Field(..., description="Mathematical expression to calculate")

class CalculationResponse(BaseModel):
    """Schema for calculation response."""
    id: int
    expression: str
    result: float
    created_at: datetime

    class Config:
        from_attributes = True

class CalculationCreate(BaseModel):
    """Schema for creating a calculation."""
    expression: str
    result: float

class HistoryResponse(BaseModel):
    """Schema for history response."""
    calculations: List[CalculationResponse]
    total: int