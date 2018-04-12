const Feature = require('./feature');
const Constants = require('../constants');
const turf = require('@turf/turf');

const LineString = function (ctx, geojson) {
  Feature.call(this, ctx, geojson);
};

LineString.prototype = Object.create(Feature.prototype);

LineString.prototype.isValid = function () {
  return this.coordinates.length > 1;
};

LineString.prototype.addCoordinate = function (path, lng, lat) {
  this.changed();
  const id = parseInt(path, 10);
  this.coordinates.splice(id, 0, [lng, lat]);
};

LineString.prototype.getCoordinate = function (path) {
  const id = parseInt(path, 10);
  return JSON.parse(JSON.stringify(this.coordinates[id]));
};

LineString.prototype.removeCoordinate = function (path) {
  this.changed();
  this.coordinates.splice(parseInt(path, 10), 1);
};

LineString.prototype.updateCoordinate = function (path, lng, lat) {
  const features = this.featuresAt([lng, lat]);

  const id = parseInt(path, 10);

  if (features.length) {
    const feature = this.getClosestFeature(features, [lng, lat]);
    this.coordinates[id] = feature.geometry.coordinates;
  } else {
    this.coordinates[id] = [lng, lat];
  }

  this.changed();
};

LineString.prototype.getClosestFeature = function (features, lngLatLike) {
  const ptA = this.ctx.map.project(lngLatLike);
  const turfPoint = turf.point(lngLatLike);

  let minDistance = Number.POSITIVE_INFINITY;
  let closestPoint = null;

  for (const feature of features) {
    const snapped = turf.nearestPointOnLine(feature, turfPoint);
    const ptB = this.ctx.map.project(snapped.geometry.coordinates);
    const distance = Math.hypot(ptA.x - ptB.x, ptA.y - ptB.y);

    if (distance < minDistance) {
      closestPoint = snapped;
    }
    minDistance = distance;
  }

  return closestPoint;
};

LineString.prototype.featuresAt = function (lngLatLike) {
  if (this.ctx.map === null) return [];

  const ptA = this.ctx.map.project(lngLatLike);
  const box = getBox(ptA);

  const features = this.ctx.map.queryRenderedFeatures(box).filter((feature) => {
    return (
      META_TYPES.includes(feature.properties.meta) && feature.properties.id !== this.id
    );
  });

  const uniqueFeatures = features.reduce((acc, feature) => {
    acc[feature.properties.id] = feature;
    return acc;
  }, {});

  return Object.values(uniqueFeatures);
};

function getBox(point, buffer = 25) {
  return [
    [point.x - buffer, point.y - buffer],
    [point.x + buffer, point.y + buffer]
  ];
}

const META_TYPES = [
  Constants.meta.FEATURE,
  'segment',
];

module.exports = LineString;
