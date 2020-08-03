/*==================
[NodeJS] Read Directory Depth - Asynchronous
	Language:
		NodeJS 14
==================*/
const synchronousReadDirectoryDepth = require("./synchronous.js");
/**
 * @function asynchronous
 * @alias async
 * @param {string} rootDirectoryPath
 * @param {object} [option]
 * @param {(string|[string,string])[]} [option.excludeFile]
 * @param {(string|[string,string])[]} [option.excludeSubDirectory]
 * @param {number} [option.maximumDepth=Infinity]
 * @returns {string[]}
 */
function asynchronous() {
	return new Promise((resolve, reject) => {
		const result = synchronousReadDirectoryDepth(...arguments);
		resolve(result);
	});
};
module.exports = asynchronous;
