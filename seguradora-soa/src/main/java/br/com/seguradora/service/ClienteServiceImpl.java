package br.com.seguradora.service;

import br.com.seguradora.command.*;

import javax.jws.WebService;

@WebService(endpointInterface = "br.com.seguradora.service.ClienteService")
public class ClienteServiceImpl implements ClienteService {

    @Override
    public String consultarClientePorCPF(String cpf) {
        Invoker invoker = new Invoker();
        invoker.setCommand(new ConsultaClienteCommand());
        return invoker.run(cpf);
    }
}
