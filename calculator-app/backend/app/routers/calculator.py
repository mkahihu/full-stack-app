"""Calculator router with calculation and history endpoints."""
import re
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Calculation
from ..schemas import (
    CalculationRequest, 
    CalculationResponse, 
    CalculationCreate,
    HistoryResponse
)

router = APIRouter(prefix="/api/calculator", tags=["calculator"])

def safe_eval(expression: str) -> float:
    """Safely evaluate mathematical expressions."""
    # Remove whitespace
    expression = expression.replace(" ", "")
    
    # Validate expression contains only allowed characters
    if not re.match(r'^[0-9+\-*/().]+$', expression):
        raise ValueError("Invalid characters in expression")
    
    # Prevent certain dangerous patterns
    dangerous_patterns = ['__', 'import', 'exec', 'eval', 'open', 'file']
    if any(pattern in expression.lower() for pattern in dangerous_patterns):
        raise ValueError("Potentially dangerous expression")
    
    try:
        # Use eval with restricted globals for basic arithmetic
        allowed_names = {
            "__builtins__": {},
            "__name__": "__main__",
        }
        result = eval(expression, allowed_names)
        return float(result)
    except Exception as e:
        raise ValueError(f"Invalid mathematical expression: {str(e)}")

@router.post("/calculate", response_model=CalculationResponse)
async def calculate(
    request: CalculationRequest, 
    db: Session = Depends(get_db)
):
    """Calculate mathematical expression and store in history."""
    try:
        result = safe_eval(request.expression)
        
        # Create calculation record
        calculation = Calculation(
            expression=request.expression,
            result=result
        )
        db.add(calculation)
        db.commit()
        db.refresh(calculation)
        
        return calculation
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/history", response_model=HistoryResponse)
async def get_history(
    limit: int = 50, 
    offset: int = 0, 
    db: Session = Depends(get_db)
):
    """Get calculation history with pagination."""
    calculations = db.query(Calculation)\
        .order_by(Calculation.created_at.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()
    
    total = db.query(Calculation).count()
    
    return HistoryResponse(calculations=calculations, total=total)

@router.delete("/history")
async def clear_history(db: Session = Depends(get_db)):
    """Clear all calculation history."""
    db.query(Calculation).delete()
    db.commit()
    return {"message": "History cleared successfully"}