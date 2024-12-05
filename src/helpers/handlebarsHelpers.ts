import Handlebars from 'handlebars';

Handlebars.registerHelper('defaultSrc', function (src) {
  const DEFAULT_AVATAR = '/defaultSrc.png';
  return src || DEFAULT_AVATAR;
});

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});
