const error = require("../error");

class Element {
  /**
   * Creates an instance of Element, which works similar to a Node in the DOM
   * @param {string}          tagName                Name of the html tag, like 'ul' or 'div'
   * @param {(Object|string)} properties             Either textContent(string) or a properties object
   * @param {Map}             properties.attributes  Map of html tag attributes, like '"id", "my-element-id"'
   * @param {Element[]}       properties.children    Child nodes of current Element instance
   * @param {string}          properties.textContent Text content of tag, which will be enclosed by tag boundings
   * @param {boolean}         properties.selfClosing Whether the tag is self-closing
   */
  constructor(tagName, properties) {
    this.tagName = tagName;
    if (typeof properties === "string") {
      this.textContent = properties;
      this.properties = new Map();
      this.children = [];
    } else if (properties && Object.prototype === properties.__proto__) {
      this.attributes =
        properties.attributes instanceof Map
          ? properties.attributes
          : new Map();

      this.children = Array.isArray(properties.children)
        ? properties.children
        : [];

      this.textContent =
        typeof properties.textContent === "string"
          ? properties.textContent
          : "";
      this.selfClosing =
        typeof properties.selfClosing === "boolean"
          ? properties.selfClosing
          : false;
    } else if (properties !== undefined) {
      throw new error.ConstructorMisuse("Invalid second argument");
    } else {
      this.attributes = new Map();
      this.children = [];
      this.textContent = "";
      this.selfClosing = false;
    }
    if (typeof tagName !== "string" || tagName.length === 0) {
      throw new error.ConstructorMisuse("Invalid first argument");
    }
  }

  /**
   * Adds an Element or string as a last child of the current Element instance
   * @param {Element|string} element element or string to be appendended
   */
  appendChild(element) {
    this.children.push(element);
    return this;
  }

  /**
   * Sets an html attribute in the current element
   * @param {string} key   Attribute name, like 'id' or 'class'
   * @param {string} value Attribute value
   * @returns {Element}    the current object
   */
  setAttribute(key, value) {
    if (typeof key == "string" && key.length > 0) {
      if (!value) {
        this.attributes.set(key, null);
      } else {
        this.attributes.set(key, value);
      }
    }
    return this;
  }

  /**
   * Removes a previously set attribute
   * @param {string} key the attribute name to be removed
   * @returns {Element}  the current object
   */
  removeAttribute(key) {
    if (this.attributes.has(key)) {
      this.attributes.delete(key);
    }
    return this;
  }

  /**
   * Gets the html code of the element's current state
   * @returns {string} the html string of the current node and its children
   */
  toString() {
    let attributesString = "";
    if (this.attributes && this.attributes.size) {
      this.attributes.forEach(
        (v, k) => (attributesString += v ? `${k}="${v}" ` : `${k} `)
      );
    }

    let res = `<${this.tagName} ${attributesString}`;
    if (this.selfClosing) {
      res += "/>";
    } else {
      res += ">" + this.textContent;

      this.children.forEach((child) => {
        res += child.toString();
      });
      res += `</${this.tagName}>`;
    }
    return res;
  }
}

module.exports = Element;
