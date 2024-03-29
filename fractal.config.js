'use strict';
const path = require('path');
const fractal = (module.exports = require('@frctl/fractal').create());
const mandelbrot = require('@frctl/mandelbrot');


/*
 * Give your project a title.
 */
fractal.set('project.title', 'Librairie de composants');
fractal.set('project.version', 'v1.0');
fractal.set('project.author', 'Francois Leproust');


/*
 * Tell Fractal where to look for components.
 */
fractal.components.engine(require('@frctl/nunjucks'));
fractal.components.set('path', path.join(__dirname, 'src/components'));
fractal.components.set('label', 'Styleguide'); // default is 'Components'
fractal.components.set('default.collated', false); // default is false
fractal.components.set('ext', '.html');



/*
 * Tell Fractal where to look for documentation pages.
 */
fractal.docs.set('path', path.join(__dirname, 'src/docs'));
fractal.docs.set('indexLabel', 'Documentation');
fractal.docs.engine(require('@frctl/nunjucks'));


/*
 * Tell the Fractal web preview plugin where to look for static assets.
 */
fractal.web.set('static.path', path.join(__dirname, 'src/assets'));


/*
 * Tell the Fractal where to output the build files.
 */
fractal.web.set('builder.dest', path.join(__dirname, 'dist'));



fractal.web.set('server.sync', true);
fractal.web.set('server.syncOptions', {
  open: true,
  browser: ['firefox'],
  notify: true
});
fractal.web.set('server.watch', true);


/*
 * Theme
 * Docs : https://fractal.build/guide/web/default-theme.html#configuration
 */
fractal.web.theme(
  mandelbrot({
    skin: {
      name: 'black',
      //accent: '#333333',
      //complement: '#FFFFFF',
      //links: '#000000',
    },
    information: [
      {
        label: 'Version',
        value: require('./package.json').version,
      },
      {
        label: 'Built on',
        value: new Date(),
        type: 'time',
        format: (value) => {
            return value.toLocaleDateString('en');
        },
      },
    ],
  })
);

