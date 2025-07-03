export interface MicroservicioConfig {
  clientId: string;
  clientSecret: string;
}

export const Microservicios: Record<string, MicroservicioConfig> = {
  'producto-service': {
    clientId: 'producto-service',
    clientSecret: 'secretProductos'
  },
  'categoria-service': {
    clientId: 'categoria-service',
    clientSecret: 'secretCategorias'
  },
  'usuario-service': {
    clientId: 'usuario-service',
    clientSecret: 'secretUsuarios'
  }
};
