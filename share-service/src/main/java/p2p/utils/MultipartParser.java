package p2p.utils;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * MultipartParser - byte-oriented parser adapted from the implementation in the
 * fine controller. Provides both a map-based API (parseParts) used by the
 * existing share-service `FileController` and a legacy parse() method that
 * returns the first file found (ParseResult) for backward compatibility.
 */
public class MultipartParser {
    private final byte[] data;
    private final String boundary;

    public MultipartParser(byte[] data, String boundary) {
        this.data = data;
        this.boundary = boundary;
    }

    /**
     * Parses multipart form data and returns a map of form parts keyed by field name.
     */
    public Map<String, FormPart> parseParts() {
        Map<String, FormPart> parts = new HashMap<>();

        if (data == null || boundary == null) return parts;

        try {
            byte[] boundaryBytes = ("--" + boundary).getBytes();
            byte[] headerEndMarker = "\r\n\r\n".getBytes();

            int pos = findSequence(data, boundaryBytes, 0);
            if (pos == -1) return parts; // no boundary found

            pos += boundaryBytes.length;

            while (pos < data.length) {
                // skip optional CRLF after boundary
                if (pos + 2 <= data.length && data[pos] == '\r' && data[pos + 1] == '\n') {
                    pos += 2;
                }

                // Check for final boundary marker: '--' following the boundary
                if (pos + 2 <= data.length && data[pos] == '-' && data[pos + 1] == '-') {
                    break; // end of multipart
                }

                // Find end of headers
                int headerEnd = findSequence(data, headerEndMarker, pos);
                if (headerEnd == -1) break;

                int contentStart = headerEnd + headerEndMarker.length;

                // Find start of next boundary
                int nextBoundary = findSequence(data, boundaryBytes, contentStart);
                if (nextBoundary == -1) break;

                int contentEnd = nextBoundary;

                // Trim trailing CRLF if present before the boundary
                if (contentEnd - 2 >= contentStart && data[contentEnd - 2] == '\r' && data[contentEnd - 1] == '\n') {
                    contentEnd -= 2;
                }

                // Extract headers and content
                byte[] headerBytes = Arrays.copyOfRange(data, pos, headerEnd);
                byte[] contentBytes = Arrays.copyOfRange(data, contentStart, contentEnd);

                String headers = new String(headerBytes);
                String name = extractHeaderValue(headers, "name=\"", "\"");
                String filename = extractHeaderValue(headers, "filename=\"", "\"");
                String contentType = extractHeaderValue(headers, "Content-Type: ", "\r\n");
                if (contentType == null) {
                    contentType = (filename != null) ? "application/octet-stream" : "text/plain";
                }

                if (name != null) {
                    FormPart part = new FormPart(name, filename, contentType, contentBytes);
                    parts.put(name, part);
                }

                // Move pos to after the boundary we found
                pos = nextBoundary + boundaryBytes.length;
            }

        } catch (Exception e) {
            System.err.println("Error parsing multipart data: " + e.getMessage());
        }

        return parts;
    }

    /**
     * Legacy method for backward compatibility - returns only the first file found.
     */
    public ParseResult parse() {
        try {
            // try to find filename in raw bytes similar to the fine implementation
            String dataAsString = new String(data);

            String filenameMarker = "filename=\"";
            int filenameStart = dataAsString.indexOf(filenameMarker);
            if (filenameStart == -1) {
                return null;
            }

            filenameStart += filenameMarker.length();
            int filenameEnd = dataAsString.indexOf("\"", filenameStart);
            String filename = dataAsString.substring(filenameStart, filenameEnd);

            String contentTypeMarker = "Content-Type: ";
            int contentTypeStart = dataAsString.indexOf(contentTypeMarker, filenameEnd);
            String contentType = "application/octet-stream";
            if (contentTypeStart != -1) {
                contentTypeStart += contentTypeMarker.length();
                int contentTypeEnd = dataAsString.indexOf("\r\n", contentTypeStart);
                contentType = dataAsString.substring(contentTypeStart, contentTypeEnd);
            }

            String headerEndMarker = "\r\n\r\n";
            int headerEnd = dataAsString.indexOf(headerEndMarker);
            if (headerEnd == -1) return null;

            int contentStart = headerEnd + headerEndMarker.length();

            byte[] boundaryBytes = ("\r\n--" + boundary + "--").getBytes();
            int contentEnd = findSequence(data, boundaryBytes, contentStart);

            if (contentEnd == -1) {
                boundaryBytes = ("\r\n--" + boundary).getBytes();
                contentEnd = findSequence(data, boundaryBytes, contentStart);
            }

            if (contentEnd == -1 || contentEnd <= contentStart) return null;

            byte[] fileContent = new byte[contentEnd - contentStart];
            System.arraycopy(data, contentStart, fileContent, 0, fileContent.length);

            return new ParseResult(filename, contentType, fileContent);
        } catch (Exception e) {
            System.err.println("Error parsing multipart data: " + e.getMessage());
            return null;
        }
    }

    private int findSequence(byte[] data, byte[] sequence, int startPos) {
        outer:
        for (int i = startPos; i <= data.length - sequence.length; i++) {
            for (int j = 0; j < sequence.length; j++) {
                if (data[i + j] != sequence[j]) {
                    continue outer;
                }
            }
            return i;
        }
        return -1;
    }

    private String extractHeaderValue(String headers, String startMarker, String endMarker) {
        int start = headers.indexOf(startMarker);
        if (start == -1) return null;
        start += startMarker.length();
        int end = headers.indexOf(endMarker, start);
        if (end == -1) return null;
        return headers.substring(start, end);
    }

    public static class FormPart {
        public final String name;
        public final String filename;
        public final String contentType;
        public final byte[] content;

        public FormPart(String name, String filename, String contentType, byte[] content) {
            this.name = name;
            this.filename = filename;
            this.contentType = contentType;
            this.content = content;
        }

        public String asText() {
            return new String(content).trim();
        }

        public boolean isFile() {
            return filename != null;
        }
    }

    public static class ParseResult {
        public final String filename;
        public final String contentType;
        public final byte[] fileContent;

        public ParseResult(String filename, String contentType, byte[] fileContent) {
            this.filename = filename;
            this.contentType = contentType;
            this.fileContent = fileContent;
        }
    }
}
