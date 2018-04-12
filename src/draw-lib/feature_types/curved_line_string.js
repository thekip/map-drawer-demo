const bezierSpline = require('@turf/bezier-spline').default;

const Feature = require('./feature');
const Constants = require('../constants');

class CurvedLineString extends Feature {
  isValid() {
    return this.coordinates.length > 1;
  }

  addCoordinate(path, lng, lat) {
    this.changed();
    const id = parseInt(path, 10);
    this.coordinates.splice(id, 0, [lng, lat]);
  }

  getCoordinate(path) {
    const id = parseInt(path, 10);
    return JSON.parse(JSON.stringify(this.coordinates[id]));
  }

  removeCoordinate(path) {
    this.changed();
    this.coordinates.splice(parseInt(path, 10), 1);
  }

  updateCoordinate(path, lng, lat) {
    const id = parseInt(path, 10);
    this.coordinates[id] = [lng, lat];
    this.changed();
  }

  internal(mode) {
    const geojson = this.applySmoothing(super.internal(mode));
    //const geojson = super.internal(mode);
    return geojson;
  }

  /**
   *
   * @private
   * @param geojson
   * @returns {*}
   */
  applySmoothing(geojson) {
    if (geojson.geometry.coordinates.length < 2) {
      return geojson;
    }

    const latest = geojson.geometry.coordinates[geojson.geometry.coordinates.length - 1];
    const beforeLatest =  geojson.geometry.coordinates[geojson.geometry.coordinates.length - 2];

    if (this.compareCoords(beforeLatest, latest, 25)) {
      console.log(geojson.geometry.coordinates);
      geojson.geometry.coordinates =  geojson.geometry.coordinates.slice(0, geojson.geometry.coordinates.length - 1);
      console.log(geojson.geometry.coordinates);
    }

    if (geojson.geometry.coordinates.length < 2) {
      return geojson;
    }

    return bezierSpline(geojson, {
      resolution: 2000 * geojson.geometry.coordinates.length,
    });
  }

  compareCoords(a, b, buffer) {
    const ptA = this.ctx.map.project([ a[0], a[1] ]);
    const ptB = this.ctx.map.project([ b[0], b[1] ]);

    //console.log(ptA, ptB);
    //const ptA = map.project([ startCoord[0], startCoord[1] ]);
    //const ptB = map.project([ endCoord[0], endCoord[1] ]);
    //const mid = map.unproject([ (ptA.x + ptB.x) / 2, (ptA.y + ptB.y) / 2 ]);

    if (ptA.x === ptB.x && ptA.y === ptB.y) {
      return true;
    }

    const bb = {
      ix: ptA.x - buffer,
      iy: ptA.y - buffer,
      ax: ptA.x + buffer,
      ay: ptA.y + buffer,
    };

    console.log(bb);
    if(bb.ix <= ptB.x && ptB.x <= bb.ax && bb.iy <= ptB.y && ptB.y <= bb.ay ) {
      return true;
    }

    return false;
  }

}


module.exports = CurvedLineString;
