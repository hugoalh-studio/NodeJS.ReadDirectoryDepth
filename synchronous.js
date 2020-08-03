/*==================
[NodeJS] Read Directory Depth - Synchronous
	Language:
		NodeJS 14
==================*/
const advancedDetermine = require("@hugoalh/advanced-determine");
const fileSystem = require("fs");
const path = require("path").win32;
/**
 * @function synchronous
 * @alias sync
 * @param {string} rootDirectoryPath
 * @param {object} [option]
 * @param {(string|[string,string])[]} [option.excludeFile]
 * @param {(string|[string,string])[]} [option.excludeSubDirectory]
 * @param {number} [option.maximumDepth=Infinity]
 * @returns {string[]}
 */
function synchronous(rootDirectoryPath, option) {
	let runtime = {
		excludeFile: [],
		excludeFilePatternTotal: 0,
		excludeSubDirectory: [],
		excludeSubDirectoryPatternTotal: 0,
		maximumDepth: Infinity
	};
	if (advancedDetermine.isString(rootDirectoryPath) != true) {
		throw new TypeError(`Invalid type of "rootDirectoryPath"! Require type of string.`);
	};
	if (rootDirectoryPath.search(/:\\/giu) == -1) {
		rootDirectoryPath = path.join(process.cwd(), rootDirectoryPath);
	};
	rootDirectoryPath = new URL(rootDirectoryPath).toString();
	if (advancedDetermine.isObject(option) == true) {
		if (option.excludeFile) {
			if (advancedDetermine.isArray(option.excludeFile) == false) {
				throw new TypeError(`Invalid type of "option.excludeFile"! Require type of array.`);
			};
			option.excludeFile.forEach((pattern) => {
				if (advancedDetermine.isString(pattern) == true) {
					runtime.excludeFile.push(pattern);
				} else if (advancedDetermine.isArray(pattern) == true && advancedDetermine.isString(pattern[0]) == true && advancedDetermine.isString(pattern[1]) == true) {
					runtime.excludeFile.push(new RegExp(...pattern));
				} else {
					throw new TypeError(`Invalid type of "option.excludeFile.pattern"! Require type of string, or [string, string].`);
				};
			});
			runtime.excludeFilePatternTotal = runtime.excludeFile.length;
		};
		if (option.excludeSubDirectory) {
			if (advancedDetermine.isArray(option.excludeSubDirectory) == false) {
				throw new TypeError(`Invalid type of "option.excludeSubDirectory"! Require type of array.`);
			};
			option.excludeSubDirectory.forEach((pattern) => {
				if (advancedDetermine.isString(pattern) == true) {
					runtime.excludeSubDirectory.push(pattern);
				} else if (advancedDetermine.isArray(pattern) == true && advancedDetermine.isString(pattern[0]) == true && advancedDetermine.isString(pattern[1]) == true) {
					runtime.excludeSubDirectory.push(new RegExp(...pattern));
				} else {
					throw new TypeError(`Invalid type of "option.excludeSubDirectory.pattern"! Require type of string, or [string, string].`);
				};
			});
			runtime.excludeSubDirectoryPatternTotal = runtime.excludeSubDirectory.length;
		};
		if (option.maximumDepth || option.maximumDepth === 0) {
			if (option.maximumDepth !== Infinity && advancedDetermine.isNumberPositiveInteger(option.maximumDepth) != true) {
				throw new TypeError(`Invalid type of "option.maximumDepth"! Require type of positive integer number.`);
			};
			runtime.maximumDepth = option.maximumDepth;
		};
	};
	let awaitingDirectory = ["./"];
	let fileList = [];
	function readADirectory(subDirectoryPath) {
		const list = fileSystem.readdirSync(
			path.join(rootDirectoryPath, subDirectoryPath),
			{
				encoding: "utf8",
				withFileTypes: false
			}
		);
		let listCatalog = {
			directory: [],
			file: []
		};
		Promise.allSettled(
			list.map((element) => {
				new Promise(() => {
					const elementRootPath = path.join(subDirectoryPath, element);
					if (fileSystem.lstatSync(path.join(rootDirectoryPath, elementRootPath)).isDirectory() == true) {
						let invalid = false;
						for (let index = 0; index < runtime.excludeSubDirectoryPatternTotal; index++) {
							if (elementRootPath.match(runtime.excludeSubDirectory[index]) !== null) {
								invalid = true;
								break;
							};
						};
						let depthTest = elementRootPath.match(/\\/gu);
						depthTest = (depthTest === null) ? 0 : depthTest.length;
						if (depthTest >= runtime.maximumDepth) {
							invalid = true;
						};
						if (invalid == false) {
							listCatalog.directory.push(elementRootPath);
						};
					} else {
						let invalid = false;
						for (let index = 0; index < runtime.excludeFilePatternTotal; index++) {
							if (elementRootPath.match(runtime.excludeFile[index]) !== null) {
								invalid = true;
								break;
							};
						};
						if (invalid == false) {
							listCatalog.file.push(elementRootPath);
						};
					};
				}).catch((error) => { });
			})
		);
		return listCatalog;
	};
	while (awaitingDirectory.length > 0) {
		const listCatalog = readADirectory(awaitingDirectory.shift());
		awaitingDirectory.push(...listCatalog.directory);
		fileList.push(...listCatalog.file);
	};
	return fileList;
};
module.exports = synchronous;
