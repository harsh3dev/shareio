package p2p.utils;

import java.util.Map;

public class MultipartFormUtils {

    /**
     * Extracts a string field (like "password") from parsed form parts.
     *
     * @param parts Map of form parts returned by MultipartParser
     * @param fieldName The name of the form field to extract
     * @return Field value as String, or empty string if not present
     */
    public static String extractFieldAsString(Map<String, MultipartParser.FormPart> parts, String fieldName) {
        if (parts == null || fieldName == null) return "";
        MultipartParser.FormPart part = parts.get(fieldName);
        return (part != null) ? part.asText() : "";
    }

    /**
     * Extracts a file part from the form, throws if not found.
     *
     * @param parts Map of form parts
     * @param fieldName The name of the file field (usually "file")
     * @return The file part object
     * @throws IllegalArgumentException if the field is missing or invalid
     */
    public static MultipartParser.FormPart extractRequiredFile(Map<String, MultipartParser.FormPart> parts, String fieldName) {
        MultipartParser.FormPart filePart = parts.get(fieldName);
        if (filePart == null || filePart.filename == null) {
            throw new IllegalArgumentException("Missing or invalid file field: " + fieldName);
        }
        return filePart;
    }

    /**
     * Creates a simple response helper for HTTP exchanges.
     *
     * @param exchange The HTTP exchange object
     * @param statusCode HTTP status code
     * @param message Response message
     */
    public static void respond(com.sun.net.httpserver.HttpExchange exchange, int statusCode, String message) {
        try {
            exchange.sendResponseHeaders(statusCode, message.getBytes().length);
            try (java.io.OutputStream os = exchange.getResponseBody()) {
                os.write(message.getBytes());
            }
        } catch (java.io.IOException e) {
            System.err.println("Error sending response: " + e.getMessage());
        }
    }
}
