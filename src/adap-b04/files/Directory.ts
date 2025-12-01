import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(bn !== null, "Base name cannot be null");
        IllegalArgumentException.assert(pn !== null, "Parent directory cannot be null");
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        IllegalArgumentException.assert(cn !== null, "Child cannot be null");
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== null, "Child cannot be null");
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== null, "Child cannot be null");
        InvalidStateException.assert(this.childNodes.has(cn), "Child node not found");
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

}