var html = require('showtime/html');

exports.getVideoPage = function (videoUrl) {
  var videoPage = html.parse(http.request(videoUrl)).root;
  return videoPage;
};

exports.isStreamVideo = function (videoPage) {
  return videoPage.getElementByClassName("ign-videoplayer").length > 0;
};

exports.getVideoTitle = function (videoPage) {
  return videoPage.getElementByTagName("title")[0].textContent;
};

exports.getVideoSources = function (videoPage) {
  var videoInfo = JSON.parse(videoPage.getElementByClassName("ign-videoplayer")[0]
    .attributes.getNamedItem("data-video").value);

  var sources = [];
  if (videoInfo.m3uUrl) {
    log.d("Using HLS url");

    sources.push({
      url: videoInfo.m3uUrl
    });
  } else {
    log.d("No HLS url available, falling back for MP4 videos");
    sources = videoInfo.assets;
    sources.reverse();
  }

  return sources;
};

exports.getVideoSlug = function (videoPage) {
  return videoPage.getElementByClassName("instant-play")[0]
    .attributes.getNamedItem("data-slug").value;
};

exports.getLiveVideoSources = function (slug) {
  var js = http.request("http://widgets.ign.com/video/embed/content.jsonp?slug=" + slug).toString();

  var videoInfo = js.match(/data-video='(.+?)'/)[1];
  videoInfo = videoInfo.replace(/\\/g, "");
  videoInfo = JSON.parse(videoInfo);
  var sources = [];
  if (videoInfo.m3uUrl) {
    log.d("Using HLS url");

    sources.push({
      url: videoInfo.m3uUrl
    });
  } else {
    log.d("No HLS url available, falling back for MP4 videos");
    sources = videoInfo.assets;
    sources.reverse();
  }

  return sources;
};

exports.hasVideoSlug = function (videoPage) {
  return videoPage.getElementByClassName("instant-play").length > 0 &&
    videoPage.getElementByClassName("instant-play")[0]
    .attributes.getNamedItem("data-slug");
};
