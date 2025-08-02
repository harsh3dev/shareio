package p2p.utils;

import java.util.HashMap;
import java.util.Map;

public class MultipartParser {
    private final byte[] data;
    private final String boundary;
    
    public MultipartParser(byte[] data, String boundary) {
        this.data = data;
        this.boundary = boundary;
    }
    
    /**
     * Parses multipart form data and returns a map of form parts.
     * 
     * @return Map where key is the form field name and value is the FormPart
     */
    public Map<String, FormPart> parseParts() {
        Map<String, FormPart> parts = new HashMap<>();
        
        try {
            String dataAsString = new String(data);
            String boundaryDelimiter = "--" + boundary;
            
            // Split by boundary
            String[] segments = dataAsString.split(boundaryDelimiter);
            
            for (String segment : segments) {
                if (segment.trim().isEmpty() || segment.trim().equals("--")) {
                    continue;
                }
                
                FormPart part = parseSegment(segment.getBytes());
                if (part != null && part.name != null) {
                    parts.put(part.name, part);
                }
            }
        } catch (Exception e) {
            System.err.println("Error parsing multipart data: " + e.getMessage());
        }
        
        return parts;
    }
    
    /**
     * Legacy method for backward compatibility - returns only the first file found.
     * 
     * @return ParseResult containing the first file found, or null if no file
     */
    public ParseResult parse() {
        Map<String, FormPart> parts = parseParts();
        
        for (FormPart part : parts.values()) {
            if (part.filename != null) {
                return new ParseResult(part.filename, part.contentType, part.content);
            }
        }
        
        return null;
    }
    
    private FormPart parseSegment(byte[] segmentData) {
        try {
            String segmentAsString = new String(segmentData);
            
            // Find the end of headers
            String headerEndMarker = "\r\n\r\n";
            int headerEnd = segmentAsString.indexOf(headerEndMarker);
            if (headerEnd == -1) {
                return null;
            }
            
            String headers = segmentAsString.substring(0, headerEnd);
            
            // Extract name from Content-Disposition
            String name = extractHeaderValue(headers, "name=\"", "\"");
            if (name == null) {
                return null;
            }
            
            // Extract filename if present
            String filename = extractHeaderValue(headers, "filename=\"", "\"");
            
            // Extract content type
            String contentType = extractHeaderValue(headers, "Content-Type: ", "\r\n");
            if (contentType == null) {
                contentType = filename != null ? "application/octet-stream" : "text/plain";
            }
            
            // Extract content
            int contentStart = headerEnd + headerEndMarker.length();
            byte[] content = new byte[segmentData.length - contentStart];
            System.arraycopy(segmentData, contentStart, content, 0, content.length);
            
            // Remove trailing \r\n if present
            if (content.length >= 2 && content[content.length - 2] == '\r' && content[content.length - 1] == '\n') {
                byte[] trimmed = new byte[content.length - 2];
                System.arraycopy(content, 0, trimmed, 0, trimmed.length);
                content = trimmed;
            }
            
            return new FormPart(name, filename, contentType, content);
            
        } catch (Exception e) {
            System.err.println("Error parsing segment: " + e.getMessage());
            return null;
        }
    }
    
    private String extractHeaderValue(String headers, String startMarker, String endMarker) {
        int start = headers.indexOf(startMarker);
        if (start == -1) {
            return null;
        }
        
        start += startMarker.length();
        int end = headers.indexOf(endMarker, start);
        if (end == -1) {
            return null;
        }
        
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
        
        /**
         * Returns the content as text (useful for form fields).
         */
        public String asText() {
            return new String(content).trim();
        }
        
        /**
         * Returns true if this part represents a file upload.
         */
        public boolean isFile() {
            return filename != null;
        }
    }
    
    /**
     * Legacy ParseResult class for backward compatibility.
     */
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
