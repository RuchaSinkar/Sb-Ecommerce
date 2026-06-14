# ============================================================
# Stage 1: Build the application with Maven
# ============================================================
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy pom.xml first — leverages Docker layer caching.
# Dependencies only re-download if pom.xml changes.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================================
# Stage 2: Slim runtime image — just JRE + the jar
# ============================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy only the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Folder for uploaded product images (mounted as a volume in compose)
RUN mkdir -p /app/images && chown -R spring:spring /app

USER spring

EXPOSE 8080

# Healthcheck hits Spring Boot Actuator (add the dependency — see notes below)
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
