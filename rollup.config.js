import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/simulant.js',
	plugins: [ babel() ],
	moduleName: 'simulant',
	sourceMap: true
};
