import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import './curve-line-augmentation';
/* eslint-disable */
import MapboxDraw from './draw-lib'
import './style.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWV0ZW9ncm91cC1tYXBib3giLCJhIjoiY2o4bDB1ZDB6MGgxejJxcWhrYWp2bDRqbyJ9.h2ar3DSNjGEl5oC3XdL4cg';

/* eslint-disable */
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: './assets/styles_v1_mapbox_light-v9-custom.json', //hosted style id
  center: [-91.874, 42.760], // starting position
  zoom: 1 // starting zoom
});

const styles = require('./draw-lib/lib/theme');

var draw = new MapboxDraw({
  //modes: {
  //  ...MapboxDraw.modes,
  //  draw_line_string: DrawCurvedLine,
  //  simple_select: SimpleSelect,
  //},
  styles: [
    ...styles,
    {
      'id': 'gl-draw-line-segment-red-double',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'meta', 'segment'],
        ['==', 'segmentId', '1']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#f4ac41',
        'line-dasharray': [0.2, 2],
        'line-width': 10
      }
    },
    {
      'id': 'gl-draw-line-segment-red-1',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'meta', 'segment'],
        ['==', 'segmentId', '1']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#f45e41',
        'line-dasharray': [0.2, 2],
        'line-width': 2
      }
    },

    {
      'id': 'gl-draw-line-segment-orange-2',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'meta', 'segment'],
        ['==', 'segmentId', '2']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#f4ac41',
        'line-dasharray': [0.2, 2],
        'line-width': 2
      }
    },
    {
      'id': 'gl-draw-line-segment-yellow-3',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'meta', 'segment'],
        ['==', 'segmentId', '3']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#eef441',
        'line-dasharray': [0.2, 2],
        'line-width': 2
      }
    },
    {
      'id': 'gl-draw-line-segment-green-4',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'meta', 'segment'],
        ['==', 'segmentId', '4']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#79f441',
        'line-dasharray': [0.2, 2],
        'line-width': 2
      }
    },
    {
      'id': 'gl-draw-line-segment-blue-5',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'meta', 'segment'],
        ['==', 'segmentId', '5']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#41ebf4',
        'line-dasharray': [0.2, 2],
        'line-width': 2
      }
    },
    {
      'id': 'gl-draw-line-segment-dark-blue-6',
      'type': 'line',
      'filter': ['all',
        ['==', '$type', 'LineString'],
        ['==', 'meta', 'segment'],
        ['==', 'segmentId', '6']
      ],
      'layout': {
        'line-cap': 'round',
        'line-join': 'round'
      },
      'paint': {
        'line-color': '#4155f4',
        'line-dasharray': [0.2, 2],
        'line-width': 2
      }
    },
    //{
    //  'id': 'vertex-test',
    //  'type': 'circle',
    //  'filter': ['all',
    //    ['==', 'meta', 'vertex'],
    //    //['==', '$type', 'Point'],
    //    //['!=', 'mode', 'static']
    //  ],
    //  'paint': {
    //    'circle-radius': 5,
    //    'circle-color': '#fbb03b'
    //  }
    //},
  ],
});

map.addControl(draw);