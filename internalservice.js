/*==================
[NodeJS] Read Directory Depth - Internal Service
	Language:
		NodeJS 14
==================*/
/**
 * @private
 * @function prefabTypeError
 * @param {string} argumentName
 * @param {string} typeCondition
 * @returns {TypeError}
 */
function prefabTypeError(argumentName, typeCondition) {
	throw new TypeError(`Invalid type of "${argumentName}"! Require type of ${typeCondition}.`);
};
module.exports.prefabTypeError = prefabTypeError;
