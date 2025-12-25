FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Expose port (Cloud Run uses PORT env var, defaults to 8080)
EXPOSE 8080

# Set PORT environment variable for uvicorn
ENV PORT=8080

# Copy startup script
COPY start_server.py /app/start_server.py
RUN chmod +x /app/start_server.py

# Run the application using Python startup script
# This ensures PORT environment variable is properly read
CMD ["python", "start_server.py"]

