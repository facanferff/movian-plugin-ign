exports.call = function (page, url, args, callback) {
  if (url === null) throw "URL can't be null";
  args = args || {};
  var headers = {};

  var opts = {
    args: args,
    noFail: true,
    compression: true,
    headers: headers,
    debug: false
  };

  log.d("Requesting " + url + " " + JSON.stringify(args));
  http.request(url, opts, function (err, result) {
    if (page) page.loading = false;
    if (err) {
      if (page) page.error(err);
      else console.error(err);
    } else {
      try {
        var pageHtml = html.parse(result).root;
        callback(pageHtml);
      } catch (e) {
        if (page) page.error(e);
        throw e;
      }
    }
  });
};
