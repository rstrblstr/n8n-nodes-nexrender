const path = require('path');
const { task, src, dest, series } = require('gulp');

task('build:icons', copyIcons);
task('build:nexrender-api', copyNexrenderApi);
task('build', series(copyIcons, copyNexrenderApi));

function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	src(nodeSource).pipe(dest(nodeDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	return src(credSource).pipe(dest(credDestination));
}

function copyNexrenderApi() {
	const apiSource = path.resolve('nexrender-api', '**', '*');
	const apiDestination = path.resolve('dist', 'nexrender-api');

	return src(apiSource).pipe(dest(apiDestination));
}
