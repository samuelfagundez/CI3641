import { Memory, Pair } from '../src/models';

describe('Memory module', () => {
	it('Validate memory allocation', () => {
		const memory = new Memory(128);
		memory.allocate('hola', 16);
		memory.allocate('hola1', 43);
		memory.allocate('hola2', 15);
		memory.allocate('hola3', 16);
		memory.allocate('hola3', 12);
		memory.free('hola2');
		expect(memory.allocatedMemory).toStrictEqual([
			new Pair(0, 15, 'hola'),
			new Pair(64, 127, 'hola1'),
			new Pair(32, 47, 'hola3')
		]);
		expect(memory.unallocatedMemory).toStrictEqual([
			[],
			[],
			[],
			[],
			[new Pair(16, 63)],
			[],
			[],
			[]
		]);
	});

	it('Validate output', () => {
		const memory = new Memory(128);
		memory.allocate('hola', 32);
		expect(memory.show()).toBe(`
///////////////////////////////
        Memoria Libre
///////////////////////////////

From 32 to 63, From 64 to 127

///////////////////////////////
       Memoria Alojada
///////////////////////////////

0. Chunk hola starts at 0 ends at 31
`);
	});
});
