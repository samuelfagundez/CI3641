export class Pair {
	public lb: number;
	public ub: number;
	public name?: string;

	constructor(a: number, b: number, name?: string) {
		this.lb = a;
		this.ub = b;
		this.name = name;
	}
}

export class Memory {
	private unallocated_memory: Pair[][];
	private allocated_memory: Pair[];

	constructor(memory_size: number) {
		this.unallocated_memory = [];
		this.allocated_memory = [];

		let x = Math.ceil(Math.log(memory_size) / Math.log(2));

		this.unallocated_memory = new Array(x + 1);

		for (let i = 0; i <= x; i++) this.unallocated_memory[i] = [];

		this.unallocated_memory[x].push(new Pair(0, memory_size - 1));
	}

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

	allocate(memoryBlockName: string, memoryToAllocate: number) {
		if (
			this.allocated_memory.find(
				(memory) => memory.name === memoryBlockName
			)
		)
			return console.log('Ese nombre ya tiene memoria reservada');
		let x = Math.floor(Math.ceil(Math.log(memoryToAllocate) / Math.log(2)));
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

	free(memoryBlockName: string) {
		const memoryBlockID = this.allocated_memory.findIndex(
			(memory) => memory.name === memoryBlockName
		);
		if (memoryBlockID < 0)
			return console.log('Ese nombre no tiene memoria reservada');
		const memoryBlock = this.allocated_memory[memoryBlockID];
		const allocatedMemoryAmount = memoryBlock.ub - memoryBlock.lb + 1;
		let x = Math.floor(
			Math.ceil(Math.log(allocatedMemoryAmount) / Math.log(2))
		);
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
		this.allocated_memory = [
			...this.allocated_memory.slice(0, memoryBlockID),
			...this.allocated_memory.slice(memoryBlockID + 1)
		];
	}

	get unallocatedMemory() {
		return this.unallocated_memory;
	}

	get allocatedMemory() {
		return this.allocated_memory;
	}
}
