package br.com.seguradora.service;

import javax.jws.WebService;
import br.com.seguradora.model.Cliente;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@WebService(endpointInterface = "br.com.seguradora.service.ClienteService")
public class ClienteServiceImpl implements ClienteService {

    @Override
    public String consultaClientePorCpf(String cpf) {
       try (InputStream is = getClass().getClassLoader().getResourceAsStream("clientes.json")) {
            
            String json = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            JSONArray arr = new JSONArray(json);

            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (obj.getString("cpf").equals(cpf)) {
                    String nome = obj.getString("nome");

                    List<String> apolices = new ArrayList<>();
                    JSONArray a = obj.getJSONArray("apolices");
                    for (int j = 0; j < a.length(); j++) {
                        apolices.add(a.getString(j));
                    }

                    Cliente c = new Cliente(cpf, nome, apolices);

                    return c.toString();
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
