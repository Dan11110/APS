package br.com.seguradora.service;

import br.com.seguradora.command.*;

import javax.jws.WebService;

@WebService(endpointInterface = "br.com.seguradora.service.VeiculoService")
public class VeiculoServiceImpl implements VeiculoService {

    @Override
    public String consultarVeiculoPorPlaca(String placa) {
        Invoker invoker = new Invoker();
        invoker.setCommand(new ConsultaVeiculoCommand());
        return invoker.run(placa);
    }
}
