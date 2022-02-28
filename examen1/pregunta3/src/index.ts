import { MenuOptions, Memory } from './models';
import menu from './menu';

const main = () => {
  const maxMemoryChunks = process.argv[2];
  if (!+maxMemoryChunks)
    return console.log(
      'Debes introducir como parametro de esta llamada el número de bloques de memoria'
    );
  let opt: MenuOptions;
  const memory = new Memory(+maxMemoryChunks);
  // Opening a socket for listening and processing
  console.log('Diga su siguiente acción:');
  process.stdin.on('data', (data) => {
    // Data is a buffer which requires casting
    // Also, removing the break line at the end
    opt = data.toString().slice(0, -1) as MenuOptions;
    if (opt === MenuOptions.salir) process.exit();
    menu(memory, opt);
  });
};

main();
