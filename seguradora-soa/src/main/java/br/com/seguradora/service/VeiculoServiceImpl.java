package br.com.seguradora.service;

import javax.jws.WebService;
import br.com.seguradora.model.Veiculo;
import org.json.JSONArray;
import org.json.JSONObject;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@WebService(endpointInterface = "br.com.seguradora.service.VeiculoService")
public class VeiculoServiceImpl implements VeiculoService {

    @Override
    public Veiculo consultaVeiculoPorPlaca(String placa) {
        try {
            String json = new String(Files.readAllBytes(Paths.get("data/veiculos.json")));
            JSONArray arr = new JSONArray(json);

            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                if (obj.getString("placa").equalsIgnoreCase(placa)) {
                    
                    List<String> multas = new ArrayList<>();
                    JSONArray m = obj.getJSONArray("multas");
                    for (int j = 0; j < m.length(); j++) {
                        multas.add(m.getString(j));
                    }



                    Veiculo v = new Veiculo(obj.getString("placa"), obj.getString("ipva"), multas, obj.getString("restricoes"), obj.getBoolean("roubado"));
                    return v;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }
}
