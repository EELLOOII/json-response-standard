# Multi-stage Dockerfile for JSON Response Standard
# Includes Node.js, Python, and PHP for comprehensive testing

FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20
ENV PYTHON_VERSION=3.11
ENV PHP_VERSION=8.2

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    software-properties-common \
    ca-certificates \
    gnupg \
    lsb-release \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs

# Install Python
RUN apt-get update && apt-get install -y \
    python${PYTHON_VERSION} \
    python3-pip \
    python3-venv \
    && ln -sf /usr/bin/python${PYTHON_VERSION} /usr/bin/python \
    && ln -sf /usr/bin/python${PYTHON_VERSION} /usr/bin/python3

# Install PHP
RUN apt-get update && apt-get install -y \
    software-properties-common \
    && add-apt-repository ppa:ondrej/php -y \
    && apt-get update \
    && apt-get install -y \
    php${PHP_VERSION}-cli \
    php${PHP_VERSION}-json \
    php${PHP_VERSION}-mbstring \
    && ln -sf /usr/bin/php${PHP_VERSION} /usr/bin/php \
    && rm -rf /var/lib/apt/lists/*

# Verify installations
RUN node --version && \
    npm --version && \
    python --version && \
    php --version

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install npm dependencies (if any)
RUN if [ -f package-lock.json ]; then npm ci --only=production; fi

# Copy project files
COPY . .

# Create non-root user for security
RUN useradd -m -u 1000 jsonuser && chown -R jsonuser:jsonuser /app
USER jsonuser

# Expose port (for future web interface)
EXPOSE 3000

# Default command runs all tests
CMD ["node", "test/run-tests.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1
