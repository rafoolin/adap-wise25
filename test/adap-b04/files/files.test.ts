import { describe, it, expect } from "vitest";

import { IllegalArgumentException } from "../../../src/adap-b04/common/IllegalArgumentException";
import { Directory } from "../../../src/adap-b04/files/Directory";
import { Node } from "../../../src/adap-b04/files/Node";
import { Link } from "../../../src/adap-b04/files/Link";
import { File } from "../../../src/adap-b04/files/File";
import { RootNode } from "../../../src/adap-b04/files/RootNode";
import { InvalidStateException } from "../../../src/adap-b04/common/InvalidStateException";


// -------------------------
// Directory + Node tests
// -------------------------

describe("Directory & Node contract tests", () => {

  it("Node constructor requires non-null name and parent", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    expect(() => new Node(null as any, root)).toThrow(IllegalArgumentException);
    expect(() => new Node("hello", null as any)).toThrow(IllegalArgumentException);
  });

  it("Node is added to parent's children on creation", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const child = new Directory("child", root);

    expect(root.hasChildNode(child)).toBe(true);
    expect(child.getParentNode()).toBe(root);
  });

  it("move() removes node from old parent and adds to new parent", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const a = new Directory("A", root);
    const b = new Directory("B", root);

    const c = new Directory("C", a);

    c.move(b);

    expect(a.hasChildNode(c)).toBe(false);
    expect(b.hasChildNode(c)).toBe(true);
    expect(c.getParentNode()).toBe(b);
  });

  it("rename() changes base name", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const d = new Directory("old", root);

    d.rename("new");
    expect(d.getBaseName()).toBe("new");
  });

  it("removeChildNode throws when child not found", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const other = new Directory("other", root);
    const missing = new Directory("missing", root);

    // First removal is fine — missing *is* a child
    root.removeChildNode(missing);

    // Second removal should throw because it's no longer a child
    expect(() => root.removeChildNode(missing)).toThrow(InvalidStateException);
  });
});


// -------------------------
// File tests
// -------------------------

describe("File contract tests", () => {

  it("File starts CLOSED", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);

    const state = (f as any).state;
    expect(state).toBe(1); // CLOSED
  });

  it("open() transitions CLOSED → OPEN", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);

    expect(() => f.open()).not.toThrow();
    expect((f as any).state).toBe(0); // OPEN
  });

  it("open() throws when already open", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);

    f.open();
    expect(() => f.open()).toThrow(InvalidStateException);
  });

  it("read() throws when file is closed", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);

    expect(() => f.read(10)).toThrow(InvalidStateException);
  });

  it("read() throws on non-positive size", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);
    f.open();

    expect(() => f.read(0)).toThrow(IllegalArgumentException);
    expect(() => f.read(-5)).toThrow(IllegalArgumentException);
  });

  it("close() transitions OPEN → CLOSED", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);

    f.open();
    expect(() => f.close()).not.toThrow();
    expect((f as any).state).toBe(1); // CLOSED
  });

  it("close() throws when file is not open", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);

    expect(() => f.close()).toThrow(InvalidStateException);
  });

  it("open() throws if file is deleted", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const f = new File("file.txt", root);

    (f as any).state = 2; // DELETED
    expect(() => f.open()).toThrow(InvalidStateException);
  });

});


// -------------------------
// Link tests
// -------------------------

describe("Link contract tests", () => {

  it("Link constructor requires non-null target", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);


    expect(() => new Link("ln", root, null as any)).toThrow(IllegalArgumentException);
    expect(() => new Link("ln", root, undefined as any)).toThrow(IllegalArgumentException);
  });

  it("getBaseName() delegates to target node", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const dir = new Directory("folder", root);

    const link = new Link("ln", root, dir);
    expect(link.getBaseName()).toBe("folder");
  });

  it("rename() renames the target, not the link", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const dir = new Directory("x", root);

    const link = new Link("ln", root, dir);
    link.rename("y");

    expect(dir.getBaseName()).toBe("y");
  });

  it("setTargetNode updates the link target", () => {
    let rn: RootNode = new RootNode();
    let root: Directory = new Directory("root", rn);

    const a = new Directory("A", root);
    const b = new Directory("B", root);

    const link = new Link("ln", root, a);
    link.setTargetNode(b);

    expect(link.getBaseName()).toBe("B");
  });
});