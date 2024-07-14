const path = require('path');
const { task, src, dest, series } = require('gulp');

task('build:icons', copyNodesIcons);
task('build', series(copyNodesIcons));

function copyNodesIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');
	src(nodeSource).pipe(dest(nodeDestination));

	const apiSource = path.resolve('nodes', 'Nexrender', 'Nexapi', '**', '*');
	const apiDestination = path.resolve('dist', 'nodes', 'Nexrender', 'Nexapi');
	src(apiSource).pipe(dest(apiDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return src(credSource).pipe(dest(credDestination));
}

