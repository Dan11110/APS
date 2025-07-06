package br.com.seguradora.service;

import javax.jws.WebMethod;
import javax.jws.WebService;
import br.com.seguradora.model.Cliente;

@WebService
public interface ClienteService {
    @WebMethod
    String consultaClientePorCpf(String cpf);
}
