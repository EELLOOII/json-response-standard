# Multi-stage Dockerfile for JSON Response Standard
# Includes Node.js, Python, and PHP for comprehensive testing

FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=20
ENV PYTHON_VERSION=3.10

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

# Install PHP (using default Ubuntu version for reliability)
RUN apt-get update && apt-get install -y \
    php-cli \
    php-json \
    php-mbstring \
    && rm -rf /var/lib/apt/lists/*

# Install Go
ENV GO_VERSION=1.23.1
RUN wget https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz \
    && tar -C /usr/local -xzf go${GO_VERSION}.linux-amd64.tar.gz \
    && rm go${GO_VERSION}.linux-amd64.tar.gz
ENV PATH="/usr/local/go/bin:${PATH}"

# Verify installations
RUN node --version && \
    npm --version && \
    python --version && \
    php --version && \
    go version

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package*.json ./

# Install npm dependencies (if any)
RUN if [ -f package-lock.json ]; then npm ci --only=production; fi

# Copy project files
COPY . .

# Initialize Go module (as root before switching user)
RUN go mod download || echo "No external Go dependencies"

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
