package br.com.seguradora.model;

import java.util.List;

public class Veiculo {
    private String placa;
    private String ipva;
    private List<String> multas;
    private String restricoes;
    private boolean roubado;

    
    public Veiculo(String placa, String ipva, List<String> multas, String restricoes, boolean roubado) {
        this.placa = placa;
        this.ipva = ipva;
        this.multas = multas;
        this.restricoes = restricoes;
        this.roubado = roubado;
    }

    public String toString() {
        return "Veiculo{" +
                "placa='" + placa + '\'' +
                ", ipva='" + ipva + '\'' +
                ", multas=" + multas +
                ", restricoes='" + restricoes + '\'' +
                ", roubado=" + roubado +
                '}';
    }
}