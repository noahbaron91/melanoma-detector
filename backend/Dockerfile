FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Final stage
FROM python:3.11-slim

# Copy virtual env from builder
COPY --from=builder /opt/venv /opt/venv

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy application
COPY . .

# Set environment variables
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Cloud Run will set PORT environment variable
ENV PORT 8080

# Use gunicorn as production server
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app