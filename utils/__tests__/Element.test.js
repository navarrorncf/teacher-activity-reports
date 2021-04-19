const { test, expect } = require("@jest/globals");
const Element = require("../Element");
const error = require("../../error");

test("creates an empty html element", () => {
  expect(new Element("some-tag-name").toString()).toBe(
    "<some-tag-name ></some-tag-name>"
  );
});

test("creates an empty html element with attributes", () => {
  const tag = new Element("some-tag-name");
  tag.setAttribute("id", "my-id").setAttribute("autoplay");
  expect(tag.toString()).toBe(
    '<some-tag-name id="my-id" autoplay ></some-tag-name>'
  );
});

test("removes attributes from html elements correctly", () => {
  const tag = new Element("some-tag-name");
  tag.setAttribute("id", "my-id").setAttribute("autoplay");
  tag.removeAttribute("id");
  expect(tag.toString()).toBe("<some-tag-name autoplay ></some-tag-name>");
});

test("creates an empty self closing html element", () => {
  expect(new Element("my-tag", { selfClosing: true }).toString()).toBe(
    "<my-tag />"
  );
});

test("creates an empty self closing html element with attributes", () => {
  const tag = new Element("my-tag", { selfClosing: true });
  tag
    .setAttribute("for", "another-tag-id")
    .setAttribute("src", "./assets/img/1.jpg");
  expect(tag.toString()).toBe(
    '<my-tag for="another-tag-id" src="./assets/img/1.jpg" />'
  );
});

test("removes attributes from self closing elements correctly", () => {
  const tag = new Element("my-tag", { selfClosing: true });

  tag
    .setAttribute("for", "another-tag-id")
    .setAttribute("src", "./assets/img/1.jpg");

  tag.removeAttribute("for");

  expect(tag.toString()).toBe('<my-tag src="./assets/img/1.jpg" />');
});

test("appends text as a child element correctly", () => {
  const tag = new Element("li");
  tag.appendChild("Item 1");
  expect(tag.toString()).toBe("<li >Item 1</li>");
});

test("creates elements with text content", () => {
  const tag = new Element("li", "Item 1");
  expect(tag.toString()).toBe("<li >Item 1</li>");
});

test("only accepts string as tag name", () => {
  expect(() => new Element(1)).toThrow(
    new error.ConstructorMisuse("Invalid first argument")
  );
});

test("does not accept other type argument for 2nd parameter", () => {
  expect(() => new Element("li", [1, 2, 3])).toThrowError(
    new error.ConstructorMisuse("Invalid second argument")
  );
});

test("does not accept empty tag name", () => {
  expect(() => new Element("")).toThrow(
    new error.ConstructorMisuse("Invalid first argument")
  );
});

test("utilizes map passed in as argument as 'attributes' property", () => {
  const attributes = new Map();
  expect(new Element("div", { attributes }).attributes).toBe(attributes);
});

test("utilizes map passed in as argument as 'attributes' property", () => {
  const children = [];
  expect(new Element("div", { children }).children).toBe(children);
});

test("handles non boolean value for 'selfClosing' property", () => {
  expect(
    new Element("span", { selfClosing: "non boolean value" }).selfClosing
  ).toBeFalsy();
});

test("handles string values passed in as 'textContent' property", () => {
  expect(
    new Element("textarea", {
      textContent: "My text",
    }).textContent
  ).toBe("My text");
});

test("handles attempt to remove non existing attribute", () => {
  const tag = new Element("some-tag").setAttribute(1).setAttribute("a");
  const map = new Map().set("a", null);
  expect(tag.removeAttribute("non-existing").attributes).toEqual(map);
});

test("handles attempt to add non string key as an attribute", () => {
  const tag = new Element("some-tag");
  expect(tag.setAttribute([1, 2, 3]).attributes).toEqual(new Map());
});
