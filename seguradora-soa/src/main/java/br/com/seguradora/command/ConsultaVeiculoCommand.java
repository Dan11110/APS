package br.com.seguradora.command;

import javax.json.*;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ConsultaVeiculoCommand implements Command {

    @Override
    public String execute(String placa) {
        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("veiculos.json");
            if (is == null) return "{}";

            String jsonText = new Scanner(is, StandardCharsets.UTF_8).useDelimiter("\\A").next();

            JsonReader reader = Json.createReader(new java.io.StringReader(jsonText));
            JsonArray veiculos = reader.readArray();
            for (JsonValue val : veiculos) {
                JsonObject veiculo = val.asJsonObject();
                if (veiculo.getString("placa").equalsIgnoreCase(placa)) {
                    return veiculo.toString();
                }
            }
            return "{}";
        } catch (Exception e) {
            return "{\"erro\":\"Falha ao ler veiculo\"}";
        }
    }
}
