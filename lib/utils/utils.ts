export function makeSureTrailingSlash(url: string) {
    if (!url.endsWith('/')) return url + '/';
    else url;
}
