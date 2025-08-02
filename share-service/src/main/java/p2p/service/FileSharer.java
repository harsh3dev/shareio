package p2p.service;

import p2p.utils.UploadUtils;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;


public class FileSharer {

    private static class FileInfo {

        private String filePath;
        private String password;

        public FileInfo(String filePath, String password) {
            this.filePath = filePath;
            this.password = password;
        }

        public String getFilePath() {
            return filePath;
        }

        public String getPassword() {
            return password;
        }
    }


    private HashMap<Integer, FileInfo> availableFiles;
    public FileSharer() {
        availableFiles = new HashMap<>();
    }

    public int offerFile(String filePath) {
        return offerFile(filePath, null);
    }

    public int offerFile(String filePath, String password) {
        int port;
        while (true) {
            port = UploadUtils.generateCode();
            if (!availableFiles.containsKey(port)) {
                FileInfo info = new FileInfo(filePath, password);
                availableFiles.put(port, info);
                return port;
            }
        }
    }

    public void startFileServer(int port) {
        FileInfo fileInfo = availableFiles.get(port);
        if (fileInfo == null) {
            System.err.println("No file associated with port: " + port);
            return;
        }

        String filePath = fileInfo.getFilePath();
        if (!new File(filePath).exists()) {
            System.err.println("File does not exist: " + filePath);
            return;
        }
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("Serving file '" + new File(filePath).getName() + "' on port " + port);
            Socket clientSocket = serverSocket.accept();
            System.out.println("Client connected: " + clientSocket.getInetAddress());

            new Thread(new FileSenderHandler(clientSocket, fileInfo)).start();

        } catch (IOException e) {
            System.err.println("Error starting file server on port " + port + ": " + e.getMessage());
        }
    }

    private static class FileSenderHandler implements Runnable {
        private final Socket clientSocket;
        private final FileInfo fileInfo;

        public FileSenderHandler(Socket clientSocket, FileInfo fileInfo) {
            this.clientSocket = clientSocket;
            this.fileInfo = fileInfo;
        }

        @Override
        public void run() {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                 OutputStream oss = clientSocket.getOutputStream()) {
                
                // Check if password is required
                String password = fileInfo.getPassword();
                if (password != null && !password.isEmpty()) {
                    // Send password request
                    oss.write("PASSWORD_REQUIRED\n".getBytes());
                    oss.flush();
                    
                    // Read password from client
                    String clientPassword = reader.readLine();
                    if (!password.equals(clientPassword)) {
                        oss.write("UNAUTHORIZED\n".getBytes());
                        System.out.println("Unauthorized access attempt from " + clientSocket.getInetAddress());
                        return;
                    }
                    
                    // Send authorization success
                    oss.write("AUTHORIZED\n".getBytes());
                    oss.flush();
                }
                
                // Send the filename as a header
                String filename = new File(fileInfo.getFilePath()).getName();
                String header = "Filename: " + filename + "\n";
                oss.write(header.getBytes());
                
                // Send the file content
                try (FileInputStream fis = new FileInputStream(fileInfo.getFilePath())) {
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = fis.read(buffer)) != -1) {
                        oss.write(buffer, 0, bytesRead);
                    }
                    System.out.println("File '" + filename + "' sent to " + clientSocket.getInetAddress());
                }
                
            } catch (IOException e) {
                System.err.println("Error sending file to client: " + e.getMessage());
            } finally {
                try {
                    clientSocket.close();
                } catch (IOException e) {
                    System.err.println("Error closing client socket: " + e.getMessage());
                }
            }
        }
    }

}
