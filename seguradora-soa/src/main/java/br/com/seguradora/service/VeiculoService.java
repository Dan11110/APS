package br.com.seguradora.service;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;

@WebService
public interface VeiculoService {
    @WebMethod
    String consultarVeiculoPorPlaca(@WebParam(name = "placa") String placa);
}
