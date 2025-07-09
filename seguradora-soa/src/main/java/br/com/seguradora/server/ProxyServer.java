package br.com.seguradora.server;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.URL;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class ProxyServer {

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(9090), 0);

        server.createContext("/proxy/cliente", new ProxyHandler("http://localhost:8080/ws/cliente"));
        server.createContext("/proxy/veiculo", new ProxyHandler("http://localhost:8080/ws/veiculo"));

        server.setExecutor(null); // usa o executor padrão
        System.out.println("Proxy rodando em http://localhost:9090");
        server.start();
    }

    static class ProxyHandler implements HttpHandler {
        private final String destino;

        public ProxyHandler(String destino) {
            this.destino = destino;
        }

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Tratamento de CORS
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Headers", "Content-Type,X-System-Name");
            headers.add("Access-Control-Allow-Methods", "POST, OPTIONS");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1); // No Content
                return;
            }

            // Validação do sistema
            String path = exchange.getRequestURI().getPath(); // /proxy/cliente ou /proxy/veiculo
            String sistema = exchange.getRequestHeaders().getFirst("X-System-Name");

            boolean autorizado =
                    ("consulta-cliente".equals(sistema) && path.contains("/cliente")) ||
                    ("consulta-veiculo".equals(sistema) && path.contains("/veiculo")) ||
                    ("admin".equals(sistema));

            if (!autorizado) {
                String msg = "Acesso negado para o sistema: " + sistema;
                exchange.sendResponseHeaders(403, msg.length());
                exchange.getResponseBody().write(msg.getBytes());
                exchange.getResponseBody().close();
                return;
            }

            // Repassa a requisição ao serviço SOAP original
            URL url = new URL(destino);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "text/xml;charset=UTF-8");

            try (InputStream is = exchange.getRequestBody();
                 OutputStream os = conn.getOutputStream()) {
                is.transferTo(os);
            }

            int status = conn.getResponseCode();
            InputStream resposta = (status >= 400) ? conn.getErrorStream() : conn.getInputStream();

            byte[] body = resposta.readAllBytes();
            exchange.sendResponseHeaders(status, body.length);
            exchange.getResponseBody().write(body);
            exchange.getResponseBody().close();
        }
    }
}