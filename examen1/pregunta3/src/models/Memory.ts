// Esta estructura se utilizará para representar intervalos de memoria libres u ocupados
export class Pair {
	// lower bound
	public lb: number;
	// upper bound
	public ub: number;
	// block name
	public name?: string;

	constructor(a: number, b: number, name?: string) {
		this.lb = a;
		this.ub = b;
		this.name = name;
	}
}

export class Memory {
	// Arreglo de arreglos de Pares
	// Cada posición es una representación de
	// como está fraccionada la memoria, en algunos casos en una posición
	// pueden incurrir 2 posiciones de memoria, pero sería efímero porque
	// en esos casos habría que mergearlas
	private unallocated_memory: Pair[][];
	// Arreglo de los bloques de memoria asignados
	private allocated_memory: Pair[];

	constructor(memory_size: number) {
		this.unallocated_memory = [];
		this.allocated_memory = [];

		// Determinamos el tamaño de la memoria que debe ser un exponente de 2
		// para dar sentido al algoritmo Buddy System

		let x = Math.ceil(Math.log(memory_size) / Math.log(2));

		this.unallocated_memory = new Array(x + 1);

		for (let i = 0; i <= x; i++) this.unallocated_memory[i] = [];

		// Alojamos al final de nuestro arreglo de memoria sin ubicar el bloque con toda la memoria
		// esto para poder iterativamente ir diviendo la memoria e ir llenando hacia al comienzo del arreglo.
		// Donde en caso de la memoria estar completamente llena, por ejemplo, el bloque 0 que empieza en la dirección 0
		// estaría al comienzo del arreglo
		this.unallocated_memory[x].push(new Pair(0, memory_size - 1));
	}

	// Funcion para hacer display de la data
	show() {
		const output = `
///////////////////////////////
        Memoria Libre
///////////////////////////////

${this.unallocated_memory
	.filter((chunk) => chunk.length)
	.map((chunk, i) => {
		if (chunk && chunk.length) {
			return `${i > 0 ? ' ' : ''}From ${chunk[0].lb} to ${chunk[0].ub}`;
		}
	})}

///////////////////////////////
       Memoria Alojada
///////////////////////////////

${this.allocated_memory.map((chunk, i) => {
	if (chunk) {
		return `${i === 0 ? `${i}. ` : ` ${i}. `}Chunk ${
			chunk.name
		} starts at ${chunk.lb} ends at ${chunk.ub}`;
	}
})}
`;
		console.log(output);
		return output;
	}

	// Controlador de la operación de asignación de memoria
	allocate(memoryBlockName: string, memoryToAllocate: number) {
		// Si está ocupado falla
		if (
			this.allocated_memory.find(
				(memory) => memory.name === memoryBlockName
			)
		)
			return console.log('Ese nombre ya tiene memoria reservada');
		// Encontramos el bloque al que pertenece esa cantidad de memoria solicitada
		let x = Math.floor(Math.ceil(Math.log(memoryToAllocate) / Math.log(2)));
		// Insertamos el bloque donde pertenece siguiendo estrictamente el algoritmo de buddy system
		let i;
		let temp: Pair | undefined = undefined;
		if (this.unallocated_memory[x].length > 0) {
			temp = this.unallocated_memory[x].shift();
			if (temp) {
				temp.name = memoryBlockName;
				this.allocated_memory.push(temp);
			}
			return;
		}
		// Buscamos la primera posición con memoria disponible
		for (i = x + 1; i < this.unallocated_memory.length; i++) {
			if (this.unallocated_memory[i].length == 0) continue;
			break;
		}
		if (i == this.unallocated_memory.length) {
			console.log('No quedan suficientes bloques de memoria');
			return;
		}
		temp = this.unallocated_memory[i].shift();
		i--;
		// Actualizamos los bloques para poder insertar la memoria en orden regresivo
		for (; i >= x; i--) {
			if (temp) {
				let newPair = new Pair(
					temp.lb,
					temp.lb + Math.floor((temp.ub - temp.lb) / 2)
				);
				let newPair2 = new Pair(
					temp.lb + Math.floor((temp.ub - temp.lb + 1) / 2),
					temp.ub
				);
				this.unallocated_memory[i].push(newPair);
				this.unallocated_memory[i].push(newPair2);
				temp = this.unallocated_memory[i].shift();
			}
		}
		if (temp) {
			temp.name = memoryBlockName;
			this.allocated_memory.push(temp);
		}
	}

	// Controlador de la operación de liberar memoria
	free(memoryBlockName: string) {
		// Error si el nombre del bloque de memoria no existe
		const memoryBlockID = this.allocated_memory.findIndex(
			(memory) => memory.name === memoryBlockName
		);
		if (memoryBlockID < 0)
			return console.log('Ese nombre no tiene memoria reservada');
		const memoryBlock = this.allocated_memory[memoryBlockID];
		// El monto de memoria a liberar es su rango de bloque + 1
		const allocatedMemoryAmount = memoryBlock.ub - memoryBlock.lb + 1;
		// Ubicamos la posición a liberar del arreglo de unallocated
		let x = Math.floor(
			Math.ceil(Math.log(allocatedMemoryAmount) / Math.log(2))
		);
		// Insertamos en unallocated
		const temp = new Pair(memoryBlock.lb, memoryBlock.ub);
		const memorySpaceAllocation = this.unallocated_memory[x];
		memorySpaceAllocation.push(temp);
		if (memorySpaceAllocation.length > 1) {
			this.unallocated_memory[x] = [
				new Pair(
					memorySpaceAllocation[1].lb,
					memorySpaceAllocation[0].ub
				)
			];
		}
		let i = x;
		// Fixeamos las incosistencias
		while (
			this.unallocated_memory[i].length &&
			this.unallocated_memory[i][0] &&
			this.unallocated_memory[i + 1] &&
			this.unallocated_memory[i + 1].length &&
			this.unallocated_memory[i][0].ub ===
				this.unallocated_memory[i + 1][0].lb - 1
		) {
			this.unallocated_memory[i + 1][0] = new Pair(
				this.unallocated_memory[i][0].lb,
				this.unallocated_memory[i + 1][0].ub
			);
			this.unallocated_memory[i] = [];
			i += 1;
		}
		// Limpiamos allocated
		this.allocated_memory = [
			...this.allocated_memory.slice(0, memoryBlockID),
			...this.allocated_memory.slice(memoryBlockID + 1)
		];
	}

	// Getter para leer la propiedad unallocated_memory
	get unallocatedMemory() {
		return this.unallocated_memory;
	}

	// Getter para leer la propidad allocated_memory
	get allocatedMemory() {
		return this.allocated_memory;
	}
}
