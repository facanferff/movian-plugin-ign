var loader = require("./loader");

exports.landingPage = function (page) {
  page.type = "directory";

  page.appendItem(PREFIX + ":search:videos:", "search", {
    title: "Search IGN: "
  });

  page.appendPassiveItem("separator", null, {
    title: "Video Sections"
  });

  page.appendItem(PREFIX + ":videos:recent", "directory", {
    title: "Recent videos"
  });

  page.appendItem(PREFIX + ":videos:gameTrailers", "directory", {
    title: "Game Trailers"
  });

  page.appendItem(PREFIX + ":videos:reviews", "directory", {
    title: "Reviews"
  });

  page.appendItem(PREFIX + ":videos:movieTrailers", "directory", {
    title: "Movie Trailers"
  });

  page.appendItem(PREFIX + ":videos:seriesUpdates", "directory", {
    title: "Series Updates"
  });
};

exports.search = {};
exports.search.videos = function (page, query) {
  page.type = "directory";
  loader.search.videos(page, query);
};

exports.videos = {};
exports.videos.recent = function (page) {
  page.type = "directory";
  loader.videos.recent(page);
};

exports.videos.gameTrailers = function (page) {
  page.type = "directory";
  loader.videos.gameTrailers(page);
};

exports.videos.reviews = function (page) {
  page.type = "directory";
  loader.videos.reviews(page);
};

exports.videos.movieTrailers = function (page) {
  page.type = "directory";
  loader.videos.movieTrailers(page);
};

exports.videos.seriesUpdates = function (page) {
  page.type = "directory";
  loader.videos.seriesUpdates(page);
};

exports.video = function (page, videoUrl) {
  loader.video(page, videoUrl);
};
