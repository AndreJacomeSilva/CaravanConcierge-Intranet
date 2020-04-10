class Utils {
  /**
   * This function converts a string to a camel case string
   * @param {string} str 
   * 
   * @returns {string} The input string formated with CamelCase
   */
  static camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  /**
   * 
   * @param {any} d The object to validate.
   * 
   * @returns {bool} True if it is a date, false otherwise
   */
  static isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  /**
   * This function is to be used inside on a JSON.parser, in order to convert dates to their respective object
   * For example JSON.parse( dataJson, dateTimeParsing );
   **/
  static dateTimeParsing(key, value) {
    var a;
    if (typeof value === 'string') {
      a = /\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}\.\d{3}Z/.exec(value);
      if (a) {
        return new Date(a);
      }
    }
    return value;
  }

  /**
   * Since Google App Script CacheService is limited to 100kb,
   * this helper enables to extend sch limit, by splitting the date
   * into multiple keys
   * 
   * @param {object} cache (optional) The cache engine to use
   * @param {*} chunkSize (optional) The size of the chunk
   */
  static chunkyCache(cache, chunkSize) {
    if (cache == null || cache == undefined) {
      cache = CacheService.getScriptCache();
    }
    if (isNaN(chunkSize)) {
      chunkSize = 1024 * 90;
    }
    return {
      put: function (key, value, timeout) {
        if (isNaN(timeout)) {
          timeout = 6 * 60 * 60 - 10;
        }
        let json = JSON.stringify(value);
        let cSize = Math.floor(chunkSize / 2);
        let chunks = [];
        let index = 0;
        while (index < json.length) {
          let cKey = key + "_" + index;
          chunks.push(cKey);
          cache.put(cKey, json.substr(index, cSize), timeout + 5);
          index += cSize;
        }

        let superBlk = {
          chunkSize: chunkSize,
          chunks: chunks,
          length: json.length
        };
        cache.put(key, JSON.stringify(superBlk), timeout);
      },
      get: function (key, parseDates = false) {
        let superBlkCache = cache.get(key);
        if (superBlkCache != null) {
          let superBlk = JSON.parse(superBlkCache);
          let chunks = superBlk.chunks.map(function (cKey) {
            return cache.get(cKey);
          });
          if (chunks.every(function (c) { return c != null; })) {
            if (parseDates === true) {
              return JSON.parse(chunks.join(''), Utils.dateTimeParsing);
            } else {
              return JSON.parse(chunks.join(''));
            }
          }
        }
      },
      remove: function (key) {
        let superBlkCache = cache.get(key);
        if (superBlkCache != null) {
          let superBlk = JSON.parse(superBlkCache);
          chunks = superBlk.chunks.map(function (cKey) {
            cache.remove(cKey);
          });
        }
      }
    };
  };
}