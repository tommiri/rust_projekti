# # Create a stage for building the application.
# ARG RUST_VERSION=1.82.0
# FROM docker.io/rust:${RUST_VERSION}-slim-bookworm AS build
# ARG pkg=backend
# WORKDIR /app


# # Install the MySQL client.
# RUN apt-get update && apt-get install -y libmariadb-dev pkg-config

# # Copy the source code into the container. Then build the application.
# RUN --mount=type=bind,source=src,target=src \
#     --mount=type=bind,source=Cargo.toml,target=Cargo.toml \
#     --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
#     --mount=type=cache,target=/app/target/ \
#     --mount=type=cache,target=/usr/local/cargo/registry/ \
#     --mount=type=bind,source=/src/db/migrations,target=migrations \
#     --mount=type=bind,source=/templates,target=templates \
#     set -eux; \
#     cargo build --release; \
#     cp ./target/release/$pkg /main


# ################################################################################
# # Create a stage for the final image.
# FROM docker.io/debian:bookworm-slim AS final

# WORKDIR /app

# # Copy the executable from the "build" stage.
# COPY --from=build /main ./
# COPY /config ./config

# # Install the MySQL client.
# RUN apt-get update && apt-get install -y libmariadb-dev ca-certificates

# # What the container should run when it is started.
# CMD ./main

# Create a stage for building the application.
ARG RUST_VERSION=1.82.0
FROM docker.io/rust:${RUST_VERSION}-slim-bookworm AS build
ARG pkg=backend
WORKDIR /app

# Install the MySQL client.
RUN apt-get update && apt-get install -y libmariadb-dev default-mysql-client ca-certificates

# Copy the source code into the container. Then build the application.
COPY src src
COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
COPY /src/db/migrations migrations
COPY /templates templates

RUN --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    set -eux; \
    cargo build --release; \
    cp ./target/release/$pkg /main

################################################################################
# Create a stage for the final image.
FROM docker.io/debian:bookworm-slim AS final

WORKDIR /app

# Copy the executable from the "build" stage.
COPY --from=build /main ./
COPY /config ./config

# Install the MySQL client.
RUN apt-get update && apt-get install -y libmariadb-dev default-mysql-client ca-certificates

# What the container should run when it is started.
CMD ./main