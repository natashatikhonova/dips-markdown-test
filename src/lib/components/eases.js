import * as eases from 'svelte/easing';

const easeElastic = {}
for (const ease in eases){
	if (ease === "elasticIn") {
		console.log(ease)
		easeElastic.fn = eases[ease]
		let shape = 'M0 1000';
		
		for (let i = 1; i <= 1000; i++) {
			shape = `${shape} L${(i / 1000) * 1000} ${1000 - eases[ease](i / 1000) * 1000} `;
			easeElastic.shape = shape;
		}

	}
}
export {easeElastic};

