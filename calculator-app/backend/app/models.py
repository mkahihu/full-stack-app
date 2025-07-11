"""Database models for calculator application."""
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base

class Calculation(Base):
    """Model for storing calculation history."""
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    expression = Column(String, nullable=False)
    result = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<Calculation(expression='{self.expression}', result={self.result})>"