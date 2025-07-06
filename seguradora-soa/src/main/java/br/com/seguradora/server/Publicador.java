package br.com.seguradora.server;

import javax.xml.ws.Endpoint;
import br.com.seguradora.service.ClienteServiceImpl;
import br.com.seguradora.service.VeiculoServiceImpl;

public class Publicador {
    public static void main(String[] args) {
        Endpoint.publish("http://localhost:8080/cliente", new ClienteServiceImpl());
        Endpoint.publish("http://localhost:8081/veiculo", new VeiculoServiceImpl());
        System.out.println("Serviços SOAP publicados:");
        System.out.println("- Cliente: http://localhost:8080/cliente?wsdl");
        System.out.println("- Veículo: http://localhost:8081/veiculo?wsdl");
    }
}
