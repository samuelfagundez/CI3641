import { MenuOptions, Memory } from './models';

const menu = (memory: Memory, opt: MenuOptions) => {
  const splittedOpt = opt.split(' ');

  switch (splittedOpt[0]) {
    case MenuOptions.reservar:
      if (splittedOpt.length < 3) {
        console.log('Número de parámetros insuficiente');
        break;
      }
      if (!+splittedOpt[2]) {
        console.log('Número de bloques inválido');
        break;
      }
      if (splittedOpt.length > 3) {
        console.log('Número de parámetros inválido');
        break;
      }
      memory.allocate(splittedOpt[1], +splittedOpt[2]);
      break;

    case MenuOptions.mostrar:
      memory.show();
      break;

    case MenuOptions.liberar:
      if (splittedOpt.length > 2) {
        console.log('Número de parámetros inválido');
        break;
      }
      if (splittedOpt.length < 2) {
        console.log('Debe proveer el nombre del bloque a liberar');
        break;
      }
      memory.free(splittedOpt[1]);
      break;

    default:
      console.log('Error, acción no valida');
      break;
  }
  console.log('Diga su siguiente acción:');
};

export default menu;
