# Create a stage for building the application.
ARG RUST_VERSION=1.82.0
FROM docker.io/rust:${RUST_VERSION}-slim-bookworm AS build
ARG pkg=backend
WORKDIR /app

# Install the MySQL client.
RUN apt-get update && apt-get install -y libmariadb-dev

# Copy the source code into the container. Then build the application.
RUN --mount=type=bind,source=src,target=src \
    --mount=type=bind,source=Cargo.toml,target=Cargo.toml \
    --mount=type=bind,source=Cargo.lock,target=Cargo.lock \
    --mount=type=cache,target=/app/target/ \
    --mount=type=cache,target=/usr/local/cargo/registry/ \
    --mount=type=bind,source=migrations,target=migrations \
    set -eux; \
    cargo build --locked --release; \
    cp ./target/release/$pkg /main


################################################################################
# Create a stage for the final image.
FROM docker.io/debian:bookworm-slim AS final

WORKDIR /app

# Copy the executable from the "build" stage.
COPY --from=build /main ./

# Install the MySQL client.
RUN apt-get update && apt-get install -y libmariadb-dev

# What the container should run when it is started.
CMD ./main
