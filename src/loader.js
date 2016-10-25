var api = require("./api");
var player = require("./player");

function loaderSearch(page, url) {
  page.loading = true;

  var pageNum = 0;
  page.entries = 0;

  function loader() {
    var args = {
      page: pageNum
    };
    api.call(page, url, args, function (pageHtml) {
      var entries = pageHtml.getElementByClassName("search-item");
      for (var i in entries) {
        var entry = entries[i];

        var metadata = {};

        if (entry.attributes.getNamedItem("data-type").value === "video") {
          if (entry.getElementByClassName("search-item-title").length > 0) {
            metadata.title = entry.getElementByClassName("search-item-title")[0]
              .textContent.trim();
          } else {
            log.d("Ignoring item as it doesn't have title, possibly some paging element");
            continue;
          }

          if (entry.getElementByTagName("img").length > 0) {
            metadata.icon = entry.getElementByTagName("img")[0]
              .attributes.getNamedItem("src").value;
          }

          if (entry.getElementByClassName("video-description").length > 0) {
            metadata.description = entry.getElementByClassName("video-description")[0].textContent;
          }

          if (entry.getElementByClassName("duration").length > 0) {
            metadata.duration = entry.getElementByClassName("duration")[0].textContent.trim();
          }

          var videoUrl = entry.getElementByTagName("a")[0]
            .attributes.getNamedItem("href").value;

          page.appendItem(PREFIX + ":video:" + escape(videoUrl), "video", metadata);
          page.entries++;
        }
      }

      pageNum++;
      page.haveMore(true);
    });

    page.haveMore(false);
  }

  page.asyncPaginator = loader;
  loader();
}

function loaderVideos(page, url) {
  page.loading = true;

  var nextPageUrl = url;
  page.entries = 0;

  function loader() {
    api.call(page, nextPageUrl, null, function (pageHtml) {
      var entries = pageHtml.getElementByClassName("grid_16");
      for (var i in entries) {
        var entry = entries[i];

        var metadata = {};

        if (entry.getElementByTagName("a")[0] && entry.getElementByTagName("a")[0].attributes.getNamedItem("title")) {
          metadata.title = entry.getElementByTagName("a")[0]
            .attributes.getNamedItem("title").value;
        } else {
          log.d("Ignoring item as it doesn't have title, possibly some paging element");
          continue;
        }

        if (entry.getElementByTagName("img").length > 0) {
          metadata.icon = entry.getElementByTagName("img")[0]
            .attributes.getNamedItem("src").value;
        }

        if (entry.getElementByClassName("video-description").length > 0)
          metadata.description = entry.getElementByClassName("video-description")[0].textContent;

        if (entry.getElementByClassName("video-details").length > 0 &&
          entry.getElementByClassName("video-details")[0]
          .getElementByTagName("li").length > 0) {
          metadata.duration = entry.getElementByClassName("video-details")[0].textContent;
          metadata.duration = metadata.duration.substr(0, metadata.duration.indexOf(" "));
        }

        var videoUrl = entry.getElementByTagName("a")[0]
          .attributes.getNamedItem("href").value;

        page.appendItem(PREFIX + ":video:" + escape(videoUrl), "video", metadata);
        page.entries++;
      }

      if (pageHtml.getElementById("moreVideos")) {
        nextPageUrl = BASE_URL + pageHtml.getElementById("moreVideos")
          .attributes.getNamedItem("href").value;
        page.haveMore(true);
      } else page.haveMore(false);
    });

    page.haveMore(false);
  }

  page.asyncPaginator = loader;
  loader();
}

/*******************************************************************************
 * Exported functions
 ******************************************************************************/
exports.video = function (page, videoUrl) {
  page.type = "video";

  var videoPage = player.getVideoPage(videoUrl);

  var title = player.getVideoTitle(videoPage);
  var sources;
  if (player.isStreamVideo(videoPage)) {
    sources = player.getVideoSources(videoPage);
  } else if (player.hasVideoSlug(videoPage)) {
    var slug = player.getVideoSlug(videoPage);
    sources = player.getLiveVideoSources(slug);
  } else {
    page.error("This video has an unknown playback behavior");
  }

  page.loading = false;
  page.source = "videoparams:" + JSON.stringify({
    "title": title,
    "no_fs_scan": true,
    "no_subtitle_scan": true,
    "canonicalUrl": videoUrl,
    "sources": sources,
    "subtitles": []
  });
};

exports.search = {};
exports.search.videos = function (page, query) {
  loaderSearch(page, "http://www.ign.com/ajax/search/results?count=10&type=video&filter=videos&q=" + query);
};

exports.videos = {};
exports.videos.recent = function (page) {
  loaderVideos(page, "http://www.ign.com/videos/all/moregalleryajax?page=1&filter=all");
};

exports.videos.gameTrailers = function (page) {
  loaderVideos(page, "http://www.ign.com/videos/all/moregalleryajax?page=1&filter=games-trailer");
};

exports.videos.reviews = function (page) {
  loaderVideos(page, "http://www.ign.com/videos/all/moregalleryajax?page=1&filter=games-review");
};

exports.videos.movieTrailers = function (page) {
  loaderVideos(page, "http://www.ign.com/videos/all/moregalleryajax?page=1&filter=movies-trailer");
};

exports.videos.seriesUpdates = function (page) {
  loaderVideos(page, "http://www.ign.com/videos/all/moregalleryajax?page=1&filter=series");
};
