import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";


describe("AbstractName contract tests", () => {

  it("constructor rejects null source", () => {
    expect(() => new StringArrayName(null as any)).toThrow(IllegalArgumentException);
  });

  it("asString() throws on invalid delimiter", () => {
    const n = new StringArrayName(["x", "y"]);
    // empty delimiter not allowed
    expect(() => n.asString("")).toThrow(IllegalArgumentException);
    expect(() => n.asString(null as any)).toThrow(IllegalArgumentException);
  });


  it("insert throws on invalid index (index must be within 0..length-1)", () => {
    const n = new StringArrayName(["x", "y"]);
    expect(() => n.insert(-1, "z")).toThrow(IllegalArgumentException);
    expect(() => n.insert(5, "z")).toThrow(IllegalArgumentException);
  });

  it("remove throws on invalid index", () => {
    const n = new StringArrayName(["x", "y"]);
    expect(() => n.remove(-10)).toThrow(IllegalArgumentException);
    expect(() => n.remove(2)).toThrow(IllegalArgumentException);
  });

  it("index validation allows correct index values (0..length-1)", () => {
    const n = new StringArrayName(["a", "b", "c"]);

    expect(() => n.getComponent(0)).not.toThrow();
    expect(() => n.getComponent(1)).not.toThrow();
    expect(() => n.getComponent(2)).not.toThrow();
  });
});

// Old tests below this line for basic functionality
describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de").insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau").append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de").remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]).insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]).append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]).remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#').insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.append("people").asString()).toBe("oss.cs.fau.de#people");
  });
});