module.exports = deact;

var forEach = Array.prototype.forEach
var events;
var div;

function deact(template) {

  var replaceholder = 'x' + Math.random().toString(36).slice(2);
  var regex = RegExp(replaceholder + '-(\\d+)');
  var args = arguments;

  var innerHTML = template.slice(0, -1).map(function(templateItem, index) {
    var insertItem = args[index + 1];
    if (typeof insertItem === 'function' && templateItem.slice(-1) === '=') {
      insertItem = '"' + replaceholder + '-' + index + '" x-deact-x';
    }
    return templateItem + insertItem;
  }).join('') + template[template.length - 1];

  if (!div) div = document.createElement('div');
  if (!events) {
    events = {};
    for (var key in div) if (/^on/.test(key)) events[key] = true;
  }
  div.innerHTML = innerHTML;

  forEach.call(div.querySelectorAll('[x-deact-x]'), function(element) {
    forEach.call(element.attributes, function(attribute) {
      var matches = regex.exec(element.getAttribute(attribute.name));
      if (matches) {
        element.removeAttribute(attribute.name);
        if (events[attribute.name]) {
          element.addEventListener(attribute.name.slice(2), args[+matches[1] + 1]);
        } else {
          element[attribute.name] = args[+matches[1] + 1];
        }
      }
    });
  });

  if (div.children.length !== 1) {
    throw new Error('Adjacent elements must be wrapped in an enclosing tag');
  }
  return div.children[0];
}
