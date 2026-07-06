# Root Dockerfile for Spring Boot Microservices
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy the wrapper and pom
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy all modules
COPY Central Central
COPY Donaciones Donaciones
COPY EurekaServer EurekaServer
COPY Logistica Logistica
COPY Necesidades Necesidades
COPY Usuarios Usuarios

# Make sure mvnw is executable
RUN chmod +x ./mvnw

# Build the project, skipping tests for faster build
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Define an argument for the module name
ARG MODULE

# Create a volume for temporary files if needed by Spring Boot
VOLUME /tmp

# Copy the built jar from the builder stage
COPY --from=builder /app/${MODULE}/target/*.jar app.jar

# Run the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
