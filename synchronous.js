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
 * @description Read directory with depth in synchronous.
 * @param {string} rootDirectoryPath Root directory path.
 * @param {object} [option] Option.
 * @param {(string|[string,string]|RegExp)[]} [option.excludeFile] Exclude file (in pattern).
 * @param {(string|[string,string]|RegExp)[]} [option.excludeSubDirectory] Exclude sub directory (in pattern).
 * @param {number} [option.maximumDepth=Infinity] The maximum depth level specifying how deep a sub directory should be read.
 * @returns {string[]} File list.
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
	if (advancedDetermine.isObjectPair(option) == true) {
		if (typeof option.excludeFile != "undefined") {
			if (advancedDetermine.isArray(option.excludeFile) == false) {
				throw new TypeError(`Invalid type of "option.excludeFile"! Require type of array.`);
			};
			option.excludeFile.forEach((pattern) => {
				if (advancedDetermine.isString(pattern) == true || advancedDetermine.isRegularExpression(pattern) == true) {
					runtime.excludeFile.push(pattern);
				} else if (advancedDetermine.isArray(pattern) == true && advancedDetermine.isString(pattern[0]) == true && advancedDetermine.isString(pattern[1]) == true) {
					runtime.excludeFile.push(new RegExp(...pattern));
				} else {
					throw new TypeError(`Invalid type of "option.excludeFile.pattern"! Require type of string, [string, string], or regular expression.`);
				};
			});
			runtime.excludeFilePatternTotal = runtime.excludeFile.length;
		};
		if (typeof option.excludeSubDirectory != "undefined") {
			if (advancedDetermine.isArray(option.excludeSubDirectory) == false) {
				throw new TypeError(`Invalid type of "option.excludeSubDirectory"! Require type of array.`);
			};
			option.excludeSubDirectory.forEach((pattern) => {
				if (advancedDetermine.isString(pattern) == true || advancedDetermine.isRegularExpression(pattern) == true) {
					runtime.excludeSubDirectory.push(pattern);
				} else if (advancedDetermine.isArray(pattern) == true && advancedDetermine.isString(pattern[0]) == true && advancedDetermine.isString(pattern[1]) == true) {
					runtime.excludeSubDirectory.push(new RegExp(...pattern));
				} else {
					throw new TypeError(`Invalid type of "option.excludeSubDirectory.pattern"! Require type of string, [string, string], or regular expression.`);
				};
			});
			runtime.excludeSubDirectoryPatternTotal = runtime.excludeSubDirectory.length;
		};
		if (typeof option.maximumDepth != "undefined") {
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
				}).catch();
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
