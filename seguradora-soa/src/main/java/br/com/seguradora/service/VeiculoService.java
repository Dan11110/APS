package br.com.seguradora.service;

import javax.jws.WebMethod;
import javax.jws.WebService;
import br.com.seguradora.model.Veiculo;

@WebService
public interface VeiculoService {
    @WebMethod
    Veiculo consultaVeiculoPorPlaca(String placa);
}

