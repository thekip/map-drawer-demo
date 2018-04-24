const extent = require('@mapbox/geojson-extent');
const Constants = require('../constants');

const {
  LAT_MIN,
  LAT_MAX,
  LAT_RENDERED_MIN,
  LAT_RENDERED_MAX,
  LNG_MIN,
  LNG_MAX
} = Constants;

// Ensure that we do not drag north-south far enough for
// - any part of any feature to exceed the poles
// - any feature to be completely lost in the space between the projection's
//   edge and the poles, such that it couldn't be re-selected and moved back
module.exports = function (geojsonFeatures, point) {
  // "inner edge" = a feature's latitude closest to the equator
  let northInnerEdge = LAT_MIN;
  let southInnerEdge = LAT_MAX;
  // "outer edge" = a feature's latitude furthest from the equator
  let northOuterEdge = LAT_MIN;
  let southOuterEdge = LAT_MAX;

  let westEdge = LNG_MAX;
  let eastEdge = LNG_MIN;

  geojsonFeatures.forEach(feature => {
    const bounds = extent(feature);
    const [featureWestEdge, featureSouthEdge, featureEastEdge, featureNorthEdge] = bounds;

    if (featureSouthEdge > northInnerEdge) northInnerEdge = featureSouthEdge;
    if (featureNorthEdge < southInnerEdge) southInnerEdge = featureNorthEdge;
    if (featureNorthEdge > northOuterEdge) northOuterEdge = featureNorthEdge;
    if (featureSouthEdge < southOuterEdge) southOuterEdge = featureSouthEdge;

    if (featureWestEdge < westEdge) westEdge = featureWestEdge;
    if (featureEastEdge > eastEdge) eastEdge = featureEastEdge;
  });

  // These changes are not mutually exclusive: we might hit the inner
  // edge but also have hit the outer edge and therefore need
  // another readjustment
  const constrainedPoint = { ...point };

  if (constrainedPoint.lat > LAT_RENDERED_MAX) {
    constrainedPoint.lat = LAT_RENDERED_MAX - northInnerEdge;
  }
  if (constrainedPoint.lat > LAT_MAX) {
    constrainedPoint.lat = LAT_MAX - northOuterEdge;
  }
  if (constrainedPoint.lat < LAT_RENDERED_MIN) {
    constrainedPoint.lat = LAT_RENDERED_MIN - southInnerEdge;
  }
  if (constrainedPoint.lat < LAT_MIN) {
    constrainedPoint.lat = LAT_MIN - southOuterEdge;
  }


  if (constrainedPoint.lng <= LNG_MIN) {
    constrainedPoint.lng += Math.floor(Math.abs(constrainedPoint.lng) / 270) * 360;
  }
  if (constrainedPoint.lng >= LNG_MAX) {
    constrainedPoint.lng -= Math.floor(Math.abs(constrainedPoint.lng) / 270) * 360;
  }

  if (constrainedPoint.lng - eastEdge > LNG_MAX) {
    constrainedPoint.lng -= 360;
  }
  if (constrainedPoint.lng - westEdge < LNG_MIN) {
    constrainedPoint.lng += 360;
  }

  return constrainedPoint;
};
