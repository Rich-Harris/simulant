import buble from 'rollup-plugin-buble';

export default {
	entry: 'src/simulant.js',
	plugins: [ buble() ],
	moduleName: 'simulant',
	sourceMap: true
};
