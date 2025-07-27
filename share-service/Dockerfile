# Build stage: use Maven to compile and package
FROM maven:3.9-openjdk-17 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package

# Runtime stage: only include what we need to run the app
FROM openjdk:17-slim
WORKDIR /app

# Copy compiled app jar and its dependencies
COPY --from=build /build/target/share-service-1.0-SNAPSHOT.jar app.jar
COPY --from=build /build/target/dependency/*.jar ./lib/

EXPOSE 8080

CMD ["java", "-cp", "app.jar:lib/*", "p2p.App"]
