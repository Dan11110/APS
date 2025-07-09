package br.com.seguradora.command;

public class Invoker {
    private Command command;

    public void setCommand(Command command) {
        this.command = command;
    }

    public String run(String parametro) {
        return command.execute(parametro);
    }
}
