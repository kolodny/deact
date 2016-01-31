module.exports = deact;

var forEach = Array.prototype.forEach;

function deact(template) {

  var replaceholder = 'x' + Math.random().toString(36).slice(2);
  var regex = RegExp(replaceholder + '-(\\d+)');
  var args = arguments;

  var replaceAttributes = false;
  var replaceElements = false;

  var innerHTML = template.slice(0, -1).map(function(templateItem, index) {
    var insertItem = args[index + 1];
    if (insertItem && insertItem.nodeType === 1) { insertItem = [insertItem]; }
    if (typeof insertItem === 'function' && templateItem.slice(-1) === '=') {
      replaceAttributes = true;
      insertItem = '"' + replaceholder + '-' + index + '" x-deact-x';
    } else if (Array.isArray(insertItem)) {
      replaceElements = true;
      insertItem = '<' + replaceholder + ' data-id=' + index + ' ></' + replaceholder + '>';
    }
    return templateItem + (insertItem || '');
  }).join('') + template[template.length - 1];

  var div = document.createElement('div');
  div.innerHTML = innerHTML;

  if (replaceAttributes) {
    forEach.call(div.querySelectorAll('[x-deact-x]'), function(element) {
      forEach.call(element.attributes, function(attribute) {

        // weird IE bug
        if (attribute) {
          var matches = regex.exec(element.getAttribute(attribute.name));
          if (matches) {
            var replacement = args[+matches[1] + 1];
            element.removeAttribute(attribute.name);
            if (/^on/.test(attribute.name) && typeof replacement === 'function') {
              element[attribute.name] = null; // IE again
              element.addEventListener(attribute.name.slice(2), replacement);
            } else {
              element[attribute.name] = replacement;
            }
          }
        }
      });
    });
  }

  if (replaceElements) {
    forEach.call(div.querySelectorAll(replaceholder), function(element) {
      var replacements = args[+element.getAttribute('data-id') + 1];
      if (!Array.isArray(replacements)) { replacements = [replacements]; }
      if (!replacements.length) {
        element.parentNode.removeChild(element);
      } else {

        element.parentNode.replaceChild(replacements[0], element);
        replacements.slice(1).forEach(function(replacement, index) {
          replacements[index].parentNode.insertBefore(replacement, replacements[index].nextElementSibling);
        });
      }
    });
  }

  if (div.children.length !== 1) {
    throw new Error('Adjacent elements must be wrapped in an enclosing tag');
  }
  return div.children[0];
}

var entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

deact.escape = function(text) {
  return String(text).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}
