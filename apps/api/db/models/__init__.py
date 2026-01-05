"""app models."""

import pkgutil
from pathlib import Path

# Import all models here to ensure they are registered with SQLAlchemy
from .users_model import UserModel
from .orders_model import OrderModel
from .user_orders_model import UserOrderModel

__all__ = ["UserModel", "OrderModel", "UserOrderModel"]


def load_all_models() -> None:
    """Load all models from this folder."""
    package_dir = Path(__file__).resolve().parent
    modules = pkgutil.walk_packages(
        path=[str(package_dir)],
        prefix="src.db.models.",
    )
    for module in modules:
        __import__(module.name)
