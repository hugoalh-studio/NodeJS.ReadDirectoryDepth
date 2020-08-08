/*==================
[NodeJS] Read Directory Depth - Asynchronous
	Language:
		NodeJS 14
==================*/
const synchronousReadDirectoryDepth = require("./synchronous.js");
/**
 * @function asynchronous
 * @alias async
 * @description Read directory with depth in asynchronous.
 * @param {string} rootDirectoryPath Root directory path.
 * @param {object} [option] Option.
 * @param {(string|[string,string]|RegExp)[]} [option.excludeFile] Exclude file (in pattern).
 * @param {(string|[string,string]|RegExp)[]} [option.excludeSubDirectory] Exclude sub directory (in pattern).
 * @param {number} [option.maximumDepth=Infinity] The maximum depth level specifying how deep a sub directory should be read.
 * @returns {string[]} File list.
 */
function asynchronous(rootDirectoryPath, option) {
	return new Promise((resolve, reject) => {
		const result = synchronousReadDirectoryDepth(rootDirectoryPath, option);
		resolve(result);
	}).catch();
};
module.exports = asynchronous;
