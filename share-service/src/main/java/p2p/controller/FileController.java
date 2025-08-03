package p2p.controller;

import p2p.service.FileSharer;
import p2p.utils.MultipartFormUtils;
import p2p.utils.MultipartParser;
import p2p.utils.MultipartParser.FormPart;

import java.io.*;
import java.util.UUID;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.net.Socket;

import org.apache.commons.io.IOUtils;

public class FileController {
    private final FileSharer fileSharer;
    private final HttpServer server;
    private final String uploadDir;
    private final ExecutorService executorService;

    public FileController(int port) throws IOException {
        this.fileSharer = new FileSharer();
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        this.uploadDir = System.getProperty("java.io.tmpdir") + File.separator + "filetogo-uploads";
        this.executorService = Executors.newFixedThreadPool(10);
        
        File uploadDirFile = new File(uploadDir);
        if (!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }
        
        server.createContext("/upload", new UploadHandler());
        server.createContext("/download", new DownloadHandler());
        server.createContext("/health", new HealthHandler());
        server.createContext("/", new CORSHandler());
        
        server.setExecutor(executorService);
    }
    
    public void start() {
        server.start();
        System.out.println("API server started on port " + server.getAddress().getPort());
    }
    
    public void stop() {
        server.stop(0);
        executorService.shutdown();
        System.out.println("API server stopped");
    }
    
    private class CORSHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            String origin = exchange.getRequestHeaders().getFirst("Origin");
            
            // Allow only same-origin requests
            if (origin != null && origin.equals("http://" + exchange.getLocalAddress().getHostName() + ":" + exchange.getLocalAddress().getPort())) {
            headers.add("Access-Control-Allow-Origin", origin);
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");
            }
            
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
            }
            
            String response = "Not Found";
            exchange.sendResponseHeaders(404, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
            os.write(response.getBytes());
            }
        }
    }
    
    private class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Content-Type", "application/json");
            
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                String response = "Method Not Allowed";
                exchange.sendResponseHeaders(405, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
            
            String response = "{\"status\":\"ok\",\"message\":\"ShareIO service is running\"}";
            exchange.sendResponseHeaders(200, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }
    
    private class UploadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            /**
             * we are getting the request headers as we have to work with it
             */
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            
            if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {
                String response = "Method Not Allowed";
                exchange.sendResponseHeaders(405, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
            
            Headers requestHeaders = exchange.getRequestHeaders();
            String contentType = requestHeaders.getFirst("Content-Type");
            
            if (contentType == null || !contentType.startsWith("multipart/form-data")) {
                String response = "Bad Request: Content-Type must be multipart/form-data";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
            
            try {
                System.out.println("Request Headers: " + requestHeaders);
                /**
                 * here we get the boundary part
                 * which is like: boundary=----WebKitFormBoundaryKzmxgAa2mIAnqOMJ
                 * its inside the content type header
                 */
                String boundary = contentType.substring(contentType.indexOf("boundary=") + 9);

                /**
                 * we get the boundary and then
                 * we convert it to bytes
                 * we use the multipart parser to parse the request body
                 * and extract the file content
                 * we then save the file to the upload directory
                 * and offer the file to the FileSharer
                 * which will return a port number
                 * we then start the file server on that port
                 * and return the port number to the client
                 * as a JSON response
                 */
                
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                IOUtils.copy(exchange.getRequestBody(), baos);
                byte[] requestData = baos.toByteArray();
                
                MultipartParser parser = new MultipartParser(requestData, boundary);
                Map<String, FormPart> parts = parser.parseParts();
                
                // Use utility to extract file with validation
                FormPart filePart;
                try {
                    filePart = MultipartFormUtils.extractRequiredFile(parts, "file");
                } catch (IllegalArgumentException e) {
                    MultipartFormUtils.respond(exchange, 400, "Bad Request: " + e.getMessage());
                    return;
                }
                
                // Extract optional password field
                String password = MultipartFormUtils.extractFieldAsString(parts, "password");
                
                // Log password status (safely)
                if (password != null && !password.trim().isEmpty()) {
                    System.out.println("Password field received (length: " + password.length() + ")");
                } else {
                    System.out.println("No password provided");
                }
                
                String filename = filePart.filename;
                if (filename == null || filename.trim().isEmpty()) {
                    filename = "unnamed-file";
                }
                
                String uniqueFilename = UUID.randomUUID().toString() + "_" + new File(filename).getName();
                String filePath = uploadDir + File.separator + uniqueFilename;
                
                try (FileOutputStream fos = new FileOutputStream(filePath)) {
                    fos.write(filePart.content);
                }
                
                // Offer file with password if provided
                int port;
                if (password != null && !password.trim().isEmpty()) {
                    port = fileSharer.offerFile(filePath, password);
                    System.out.println("File offered with password protection on port: " + port);
                } else {
                    port = fileSharer.offerFile(filePath);
                    System.out.println("File offered without password on port: " + port);
                }
                
                new Thread(() -> fileSharer.startFileServer(port)).start();
                
                String jsonResponse = "{\"port\": " + port + "}";
                headers.add("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(jsonResponse.getBytes());
                }
                
            } catch (Exception e) {
                System.err.println("Error processing file upload: " + e.getMessage());
                String response = "Server error: " + e.getMessage();
                exchange.sendResponseHeaders(500, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }
    
    private class DownloadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            
            if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                String response = "Method Not Allowed";
                exchange.sendResponseHeaders(405, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
            
            String path = exchange.getRequestURI().getPath();
            String portStr = path.substring(path.lastIndexOf('/') + 1);
            
            // Extract password from query parameters
            String query = exchange.getRequestURI().getQuery();
            String clientPassword = null;
            if (query != null) {
                String[] params = query.split("&");
                for (String param : params) {
                    if (param.startsWith("pass=")) {
                        clientPassword = param.substring(5);
                        // URL decode the password if needed
                        clientPassword = java.net.URLDecoder.decode(clientPassword, "UTF-8");
                        break;
                    } else if (param.equals("pass")) {
                        clientPassword = ""; // Empty password parameter
                        break;
                    }
                }
            }
            
            try {
                int port = Integer.parseInt(portStr);
                
                // Check if file exists on the port
                if (fileSharer.getFileInfo(port) == null) {
                    String response = "Not Found: File not available on this port";
                    exchange.sendResponseHeaders(404, response.getBytes().length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                    return;
                }
                
                // Simple password validation at HTTP level
                String requiredPassword = fileSharer.getFilePassword(port);
                
                if (requiredPassword != null) {
                    // File has a password - validate it
                    if (clientPassword == null || !requiredPassword.equals(clientPassword)) {
                        String response = "Unauthorized: Invalid or missing password";
                        headers.add("Content-Type", "text/plain");
                        exchange.sendResponseHeaders(401, response.getBytes().length);
                        try (OutputStream os = exchange.getResponseBody()) {
                            os.write(response.getBytes());
                        }
                        return;
                    }
                }
                // If file has no password or password matches, proceed with download
                
                // Connect to socket and download file (no password exchange needed)
                try (Socket socket = new Socket("localhost", port);
                     InputStream socketInput = socket.getInputStream()) {

                    File tempFile = File.createTempFile("download-", ".tmp");
                    String filename = "downloaded-file"; // Default filename
                    
                    try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                        byte[] buffer = new byte[4096];
                        int bytesRead;
                        
                        // Read filename header
                        ByteArrayOutputStream headerBaos = new ByteArrayOutputStream();
                        int b;
                        while ((b = socketInput.read()) != -1) {
                            if (b == '\n') break;
                            headerBaos.write(b);
                        }
                        
                        String headerLine = headerBaos.toString().trim();
                        
                        // Parse filename from header
                        if (headerLine.startsWith("Filename: ")) {
                            filename = headerLine.substring("Filename: ".length());
                        }
                        
                        // Read file content
                        while ((bytesRead = socketInput.read(buffer)) != -1) {
                            fos.write(buffer, 0, bytesRead);
                        }
                    }
                    
                    headers.add("Content-Disposition", "attachment; filename=\"" + filename + "\"");
                    headers.add("Content-Type", "application/octet-stream");
                    
                    exchange.sendResponseHeaders(200, tempFile.length());
                    try (OutputStream os = exchange.getResponseBody();
                         FileInputStream fis = new FileInputStream(tempFile)) {
                        byte[] buffer = new byte[4096];
                        int bytesRead;
                        while ((bytesRead = fis.read(buffer)) != -1) {
                            os.write(buffer, 0, bytesRead);
                        }
                    }
                    
                    tempFile.delete();
                    
                } catch (IOException e) {
                    System.err.println("Error downloading file from peer: " + e.getMessage());
                    String response = "Error downloading file: " + e.getMessage();
                    headers.add("Content-Type", "text/plain");
                    exchange.sendResponseHeaders(500, response.getBytes().length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(response.getBytes());
                    }
                }
                
            } catch (NumberFormatException e) {
                String response = "Bad Request: Invalid port number";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
            }
        }
    }
}
