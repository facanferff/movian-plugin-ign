/*
IGN plugin for Movian Media Center Copyright (C) 2016 Fábio Ferreira

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

This program is also available under a commercial proprietary license.
*/

var html = require('showtime/html');
var http = require('showtime/http');
var page = require('showtime/page');
var service = require('showtime/service');
var settings = require('showtime/settings');

var log = require('./src/log');
var plugin = require('./src/plugin');
var view = require('./src/view');

var PLUGIN_INFO = plugin.getDescriptor();
var PLUGIN_NAME = PLUGIN_INFO.title;
var PREFIX = PLUGIN_INFO.id;
var BASE_URL = "http://www.ign.com";

service.create(PLUGIN_NAME, PREFIX + ":start", "video", true,
  Plugin.path + "logo.png");

settings.globalSettings("settings", PLUGIN_NAME, Plugin.path + "icon.png",
  PLUGIN_INFO.description);

settings.createDivider("Developer");

settings.createBool("debug", "Debug", false, function (v) {
  service.debug = v;
});


new page.Route(PREFIX + ":start", function (page) {
  view.landingPage(page);
});

new page.Route(PREFIX + ":search:videos:(.*)", function (page, query) {
  view.search.videos(page, unescape(query));
});

new page.Route(PREFIX + ":video:(.*)", function (page, url) {
  view.video(page, unescape(url));
});

new page.Route(PREFIX + ":videos:recent", function (page) {
  view.videos.recent(page);
});

new page.Route(PREFIX + ":videos:gameTrailers", function (page) {
  view.videos.gameTrailers(page);
});

new page.Route(PREFIX + ":videos:reviews", function (page) {
  view.videos.reviews(page);
});

new page.Route(PREFIX + ":videos:movieTrailers", function (page) {
  view.videos.movieTrailers(page);
});

new page.Route(PREFIX + ":videos:seriesUpdates", function (page) {
  view.videos.seriesUpdates(page);
});


new page.Searcher(PLUGIN_NAME + " - Videos", Plugin.path + "logo.png", function (page, query) {
  view.search.videos(page, query);
});
