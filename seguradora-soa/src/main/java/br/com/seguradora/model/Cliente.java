package br.com.seguradora.model;

import java.util.List;

public class Cliente {
    private String cpf;
    private String nome;
    private List<String> apolices;

    // Getters e Setters
    public Cliente(String cpf, String nome, List<String> apolices) {
        this.cpf = cpf;
        this.nome = nome;
        this.apolices = apolices;
    }
    
    public String toString() {
        return "Cliente{" +
                "cpf='" + cpf + '\'' +
                ", nome='" + nome + '\'' +
                ", apolices=" + apolices +
                '}';
    }
}
