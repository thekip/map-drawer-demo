const LineString = require('./draw-lib/feature_types/line_string');
const Feature = require('./draw-lib/feature_types/feature');
const bezierSpline = require('@turf/bezier-spline').default;

LineString.prototype.internal = function (mode) {
  return this.applySmoothing(Feature.prototype.internal.call(this, mode));
};

/**
 *
 * @private
 * @param geojson
 * @returns {*}
 */
LineString.prototype.applySmoothing = function (geojson) {
  if (geojson.geometry.coordinates.length < 2) {
    return geojson;
  }

  const latest = geojson.geometry.coordinates[geojson.geometry.coordinates.length - 1];
  const beforeLatest = geojson.geometry.coordinates[geojson.geometry.coordinates.length - 2];

  if (this.compareCoords(beforeLatest, latest, 25)) {
    geojson.geometry.coordinates = geojson.geometry.coordinates.slice(0, geojson.geometry.coordinates.length - 1);
  }

  if (geojson.geometry.coordinates.length < 2) {
    return geojson;
  }

  return bezierSpline(geojson, {
    resolution: 1500 * geojson.geometry.coordinates.length,
  });
};

LineString.prototype.compareCoords = function (a, b, buffer) {
  const ptA = this.ctx.map.project([a[0], a[1]]);
  const ptB = this.ctx.map.project([b[0], b[1]]);

  if (ptA.x === ptB.x && ptA.y === ptB.y) {
    return true;
  }

  const bb = {
    ix: ptA.x - buffer,
    iy: ptA.y - buffer,
    ax: ptA.x + buffer,
    ay: ptA.y + buffer,
  };

  return bb.ix <= ptB.x && ptB.x <= bb.ax && bb.iy <= ptB.y && ptB.y <= bb.ay
};