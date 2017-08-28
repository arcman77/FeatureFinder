
const Utils = {
    formatBytes(bytes, decimals) {
        if (bytes == 0) {
            return '0 B';
        }
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / (k ** i)).toFixed(decimals))} ${sizes[i]}`;
    },
    slideArray(array, newVal) {
        array.shift();
        array.push(newVal);

        return array;
    },
    formatTimeDuration(miliSecs) {
        var timeDiff = miliSecs;
        timeDiff /= 1000;
        const seconds = Math.round(timeDiff % 60);
        timeDiff = Math.floor(timeDiff / 60);
        const minutes = Math.round(timeDiff % 60);
        timeDiff = Math.floor(timeDiff / 60);
        const hours = Math.round(timeDiff % 24);
        timeDiff = Math.floor(timeDiff / 24);
        const days = timeDiff;

        // eslint-disable-next-line prefer-template
        let elapsed = (days > 0 ? days + 'd ' : '') + (hours > 0 ? hours + 'h ' : '') + (minutes > 0 ? minutes + 'm ' : '');
        elapsed = (elapsed !== '' ? elapsed : `${seconds}s`);
        return elapsed;
    },
    /* eslint-disable prefer-template */
    formatHHMMSS (num) {
        var secNum = num | 0; // don't forget the second param
        var hours = ~~(secNum / 3600);
        var minutes = ~~((secNum - (hours * 3600)) / 60);
        var seconds = secNum - (hours * 3600) - (minutes * 60);
        var time = '';

        if (hours) {
            time += hours + ':';
        }

        if (minutes < 10 && hours > 0) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        time += minutes + ':' + seconds;
        return time;
    },
    getBrowserLanguageRaw() {
        var nav = window.navigator;
        var lang = nav.languages ? nav.languages[0] : null;
        lang = lang || nav.language || nav.browserLanguage || nav.userLanguage;

        return lang;
    },
    getBrowserLanguage() {
        var lang = Utils.getBrowserLanguageRaw();

        if (lang.indexOf('_') !== -1) {
            lang = lang.split('_').join('-');
        }

        if (lang.substring(0, 2) === 'en') {
            lang = 'en'; //we do not currently distinguish between english in different countries
        }

        return lang;
    },
    getRootElementFontSize(id) {
        // Returns a number
        return parseFloat(
            // of the computed font-size, in px
            getComputedStyle(
                // for the root <html> element
                document.getElementById(id) || document.documentElement
            )
            .fontSize
        );
    },
    covertEmToPixels(em, id) {
        return Utils.getRootElementFontSize(id) * em;
    },
    getJsonFromUrl(hashBased) {
        var query;

        if (hashBased) {
            const pos = location.href.indexOf('?');
            if (pos === -1) {
                return [];
            }
            query = location.href.substr(pos + 1);
        } else {
            query = location.search.substr(1);
        }

        const result = {};

        query.split('&').forEach((part) => {
            if (!part) {
                return;
            }

            // eslint-disable-next-line
            part = part.split('+').join(' '); // replace every + with space, regexp-free version
            const eq = part.indexOf('=');
            let key = eq > -1 ? part.substr(0, eq) : part;
            const val = eq > -1 ? decodeURIComponent(part.substr(eq + 1)) : '';
            const from = key.indexOf('[');
            if (from === -1) {
                result[decodeURIComponent(key)] = val;
            } else {
                const to = key.indexOf(']');
                const index = decodeURIComponent(key.substring(from + 1, to));
                key = decodeURIComponent(key.substring(0, from));
                if (!result[key]) {
                    result[key] = [];
                }
                if (!index) {
                    result[key].push(val);
                } else {
                    result[key][index] = val;
                }
            }
        });
        return result;
    },
    getUrlParam(name) {
        var result = null;
        var urlJson = Utils.getJsonFromUrl();
        if (urlJson[name]) {
            result = urlJson[name];
        }
        return result;
    },
    removeUrlParam(url, parameter) {
        var urlParts = url.split('?');
        var result = url;

        if (urlParts.length >= 2) {
            // Get first part, and remove from array
            const urlBase = urlParts.shift();

            // Join it back up
            const queryString = urlParts.join('?');

            const prefix = `${encodeURIComponent(parameter)}=`;
            const parts = queryString.split(/[&;]/g);

            // Reverse iteration as may be destructive
            for (let i = parts.length; i-- > 0;) {
                // Idiom for string.startsWith
                if (parts[i].lastIndexOf(prefix, 0) !== -1) {
                    parts.splice(i, 1);
                }
            }
            result = `${urlBase}?${parts.join('&')}`;
        }
        return result;
    },
    getCookie(cname) {
        var name = `${cname}=`;
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    },
    getFileExtension(filename) {
        const ext = filename.match(/.*\.(.*)$/);
        return ext ? ext[1] : null;
    },
    //highstock formatters
    highstockFormatter(source, rawData) {
        return Utils[`${source}ToHighstock`](rawData);
    },
    bittrexToHighstock(rawData) {
        return rawData.map(data => [Number(new Date(data.T)), data.C]);
    }
};

export default Utils;
