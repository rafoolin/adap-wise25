import { describe, it, expect } from "vitest";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";

function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
  it("test name checking", () => {
    let fs: RootNode = createFileSystem();
    const result = fs.findNodes("ls");

    expect(result.size).toBeGreaterThan(0);
    // // Find the ls node
    const ls: Node = [...result][0];
    const expected = new StringName("/usr/bin/ls", '/');
    expect(ls.getFullName().asString()).toBe(expected.asString());
  });
});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch (er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex).toBeInstanceOf(ServiceFailureException);
      expect(ex.hasTrigger()).toBe(true);
      let tx: Exception = ex.getTrigger();
      expect(tx).toBeInstanceOf(InvalidStateException);
    }
    expect(threwException).toBe(true);
  });
});

// Custom tests
describe("Directory tree traversal test", () => {
  it("root should find all 'bin' directories deeply", () => {
    let fs = createFileSystem();
    const bins = fs.findNodes("bin");
    expect(bins.size).toBe(1);

    const bin = [...bins][0];
    expect(bin.getFullName().asString()).toBe("/usr/bin");
  });
});

describe("StringName absolute path semantics", () => {
  it("empty StringName + append should create '/usr'", () => {
    const n = new StringName("", '/');
    n.append("usr");
    expect(n.asString('/')).toBe("/usr");
  });

  it("StringName should interpret '/usr/bin/ls' correctly", () => {
    const n = new StringName("/usr/bin/ls", '/');
    expect(n.getNoComponents()).toBe(4);
    expect(n.getComponent(0)).toBe("");
    expect(n.getComponent(1)).toBe("usr");
    expect(n.getComponent(2)).toBe("bin");
    expect(n.getComponent(3)).toBe("ls");
    expect(n.asString('/')).toBe("/usr/bin/ls");
  });
});

describe("Recursive findNodes test", () => {
  it("findNodes should recursively locate deeply nested files", () => {
    let fs = createFileSystem();
    let results = fs.findNodes(".bashrc");

    expect(results.size).toBe(1);
    const bash = [...results][0];
    expect(bash.getFullName().asString()).toBe("/home/riehle/.bashrc");
  });
});

describe("Buggy setup test", () => {
  it("findNodes should throw ServiceFailureException", () => {
    try {
      const fs = createBuggySetup();
      fs.findNodes("ls");
      expect(false).toBe(true);
    } catch (er) {
      let ex = er as Exception;

      // Required by the exercise:
      expect(ex).toBeInstanceOf(ServiceFailureException);
      expect(ex.hasTrigger()).toBe(true);

      let trigger = ex.getTrigger();
      expect(trigger).toBeInstanceOf(InvalidStateException);
    }
  });
});
