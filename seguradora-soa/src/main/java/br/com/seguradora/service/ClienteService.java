package br.com.seguradora.service;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService
public interface ClienteService {
    @WebMethod
    String consultarClientePorCPF(@WebParam(name = "cpf") String cpf);
}
