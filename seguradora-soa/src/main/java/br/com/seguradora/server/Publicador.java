package br.com.seguradora.server;

import br.com.seguradora.service.*;
import javax.xml.ws.Endpoint;

public class Publicador {
    public static void main(String[] args) {
        Endpoint.publish("http://localhost:8080/ws/cliente", new ClienteServiceImpl());
        Endpoint.publish("http://localhost:8080/ws/veiculo", new VeiculoServiceImpl());
        System.out.println("Serviços SOAP publicados com sucesso.");
    }
}
