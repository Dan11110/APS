package br.com.seguradora.command;

import javax.json.*;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ConsultaClienteCommand implements Command {

    @Override
    public String execute(String cpf) {
        try {
            InputStream is = getClass().getClassLoader().getResourceAsStream("clientes.json");
            if (is == null) return "{}";

            String jsonText = new Scanner(is, StandardCharsets.UTF_8).useDelimiter("\\A").next();

            JsonReader reader = Json.createReader(new java.io.StringReader(jsonText));
            JsonArray clientes = reader.readArray();
            for (JsonValue val : clientes) {
                JsonObject cliente = val.asJsonObject();
                if (cliente.getString("cpf").equals(cpf)) {
                    return cliente.toString();
                }
            }
            return "{}";
        } catch (Exception e) {
            return "{\"erro\":\"Falha ao ler cliente\"}";
        }
    }
}
