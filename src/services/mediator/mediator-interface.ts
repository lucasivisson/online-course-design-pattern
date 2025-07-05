/* eslint-disable @typescript-eslint/no-explicit-any */
// services/mediatorInterfaces.ts

// Forward declaration para evitar circular dependencies se Component precisar do Mediator e vice-versa
// Isso é uma simplificação para fins de exemplo
interface Mediator {
    // O 'sender' será o componente que notificou o mediador.
    // O 'event' será uma string que descreve o que aconteceu.
    notify(sender: BaseComponent, event: string, payload?: any): Promise<void>;
}

class BaseComponent {
    protected mediator: Mediator | undefined; // 'undefined' para permitir construção sem mediador inicialmente

    constructor(mediator: Mediator | undefined) {
      if(mediator) this.mediator = mediator
    }

    public setMediator(mediator: Mediator): void {
        this.mediator = mediator;
    }
}

export { BaseComponent };
export type { Mediator };
