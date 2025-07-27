# Stage 1: build with Maven
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /usr/src/app

COPY share-service/pom.xml ./
COPY share-service/src ./src
RUN mvn clean package -DskipTests

# Stage 2: runtime
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /usr/src/app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
