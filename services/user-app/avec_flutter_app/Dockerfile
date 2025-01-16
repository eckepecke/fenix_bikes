# FROM debian:latest AS build-env

# RUN apt-get update
# # Install necessary dependencies for running Flutter on web
# RUN apt-get install -y libxi6 libgtk-3-0 libxrender1 libxtst6 libxslt1.1 curl git wget unzip libgconf-2-4 gdb libstdc++6 libglu1-mesa fonts-droid-fallback lib32stdc++6 python3
# RUN apt-get clean

# RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter

# # Set Flutter path
# ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# RUN flutter doctor -v
# RUN flutter channel master
# RUN flutter upgrade

# # Enable web support
# RUN flutter config --enable-web

# RUN mkdir /app/
# COPY . /app/
# # Set the working directory inside the container
# WORKDIR /app/

# RUN flutter pub get
# RUN flutter build web 
FROM debian:latest AS build-env

# Update and install necessary dependencies
RUN apt-get update && apt-get install -y \
    libxi6 \
    libgtk-3-0 \
    libxrender1 \
    libxtst6 \
    libxslt1.1 \
    curl \
    git \
    wget \
    unzip \
    libgconf-2-4 \
    gdb \
    libstdc++6 \
    libglu1-mesa \
    fonts-droid-fallback \
    python3 \
    ca-certificates \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user and group to run Flutter
RUN groupadd -g 1000 fluttergroup && \
    useradd -r -m -u 1000 -g fluttergroup flutter

# Change ownership of /usr/local so the flutter user can access it
RUN chown -R flutter:fluttergroup /usr/local

# Set environment variables for the non-root user
ENV HOME=/home/flutter

# Switch to the non-root user
USER flutter

# Clone Flutter repository as the non-root user
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter

# Set Flutter path for the non-root user
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Create the /home/flutter/app directory instead of /app
RUN mkdir -p /home/flutter/app && chown -R flutter:fluttergroup /home/flutter/app

# Set working directory and copy app files
WORKDIR /home/flutter/app
COPY . /home/flutter/app/

# Run Flutter commands as the non-root user
RUN flutter doctor -v
RUN flutter clean
RUN flutter pub get
RUN flutter build web -v