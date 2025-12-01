import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(bn !== undefined && bn !== null, "Base name must not be null");
        IllegalArgumentException.assert(pn !== undefined && pn !== null, "Parent node must not be null");

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        IllegalArgumentException.assert(pn !== undefined && pn !== null, "Parent node must not be null");
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
        InvalidStateException.assert(this.parentNode !== undefined && this.parentNode !== null, "Parent node must not be null");
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to !== undefined && to !== null, "Target directory cannot be null");
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
        InvalidStateException.assert(this.parentNode !== undefined && this.parentNode !== null, "Parent node must not be null");
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== undefined && bn !== null, "Name cannot be null");
        this.doSetBaseName(bn);
        InvalidStateException.assert(this.parentNode !== undefined && this.parentNode !== null, "Parent node must not be null");

    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

}
