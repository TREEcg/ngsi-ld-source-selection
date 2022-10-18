"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSureTrailingSlash = void 0;
function makeSureTrailingSlash(url) {
    if (!url.endsWith('/'))
        return url + '/';
    else
        url;
}
exports.makeSureTrailingSlash = makeSureTrailingSlash;
//# sourceMappingURL=utils.js.map