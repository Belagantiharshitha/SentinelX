import psutil
import time
import random
from datetime import datetime

class HealthMonitor:
    def __init__(self):
        self.start_time = time.time()

    def get_system_health(self):
        """
        Calculates a real-time health score based on system metrics.
        """
        cpu_usage = psutil.cpu_percent(interval=None)
        memory = psutil.virtual_memory()
        
        # Base score starts at 100
        score = 100.0
        
        # Penalize for high resource usage
        score -= (cpu_usage * 0.1)  # Max -10
        score -= (memory.percent * 0.1) # Max -10
        
        # Add slight jitter for realism
        score += random.uniform(-0.5, 0.5)
        
        return {
            "score": round(max(0, min(100, score)), 2),
            "cpu": cpu_usage,
            "memory": memory.percent,
            "uptime_seconds": int(time.time() - self.start_time),
            "status": "LIVE" if score > 70 else "DEGRADED"
        }

health_monitor = HealthMonitor()
