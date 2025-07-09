package br.com.seguradora.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.URL;

public class ProxyServer {

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(9090), 0);

        server.createContext("/proxy/cliente", new ProxyHandler("http://localhost:8080/ws/cliente"));
        server.createContext("/proxy/veiculo", new ProxyHandler("http://localhost:8080/ws/veiculo"));

        server.start();
        System.out.println("Proxy HTTP ativo em http://localhost:9090");
    }

    static class ProxyHandler implements HttpHandler {
        private final String targetUrl;

        public ProxyHandler(String targetUrl) {
            this.targetUrl = targetUrl;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String method = exchange.getRequestMethod();

            // Adicionar cabeçalhos CORS para todas as respostas
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");

            if ("OPTIONS".equalsIgnoreCase(method)) {
                // Responde a requisição OPTIONS para preflight
                exchange.sendResponseHeaders(204, -1);
                exchange.close();
                return;
            }

            if (!"POST".equalsIgnoreCase(method)) {
                exchange.sendResponseHeaders(405, -1); // Método não permitido
                exchange.close();
                return;
            }

            // Lê o corpo da requisição enviada pelo front-end
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            exchange.getRequestBody().transferTo(baos);
            byte[] requestBody = baos.toByteArray();

            // Cria conexão com o serviço SOAP real
            URL url = new URL(targetUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "text/xml;charset=UTF-8");

            // Envia o corpo da requisição SOAP
            try (OutputStream os = conn.getOutputStream()) {
                os.write(requestBody);
            }

            // Lê a resposta do serviço SOAP
            InputStream inputStream = conn.getInputStream();
            byte[] response = inputStream.readAllBytes();

            // Retorna resposta ao front-end com cabeçalhos CORS
            exchange.getResponseHeaders().add("Content-Type", "text/xml;charset=UTF-8");
            exchange.sendResponseHeaders(200, response.length);

            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
            exchange.close();
        }
    }
}
