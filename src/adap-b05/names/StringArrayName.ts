import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        if (this.delimiter === undefined || this.delimiter === null || this.delimiter.length === 0) {
            throw new InvalidStateException("Final delimiter must be a non-empty string");
        }
        if (source === undefined || source === null) {
            throw new IllegalArgumentException("Source array must be defined and non-null");
        }
        this.components = [...source];
    }

    public clone(): Name {
        // shallow clone
        const cloned = super.clone() as StringArrayName;
        if (cloned === null || cloned === undefined) {
            throw new InvalidStateException("Cloning failed");
        }
        cloned.components = [...this.components];
        return cloned;
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.validateIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        this.validateIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string) {
        this.validateIndex(i);
        this.components.splice(i, 0, c);
    }

    public append(c: string) {
        this.components.push(c);
    }

    public remove(i: number) {
        this.validateIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        super.concat(other);
    }


    /** 
    * Check if the index is in the correct range; otherwise throws an exception.
    * 
    * @param i index 
    */
    private validateIndex(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, `index out of range: ${i}`);
    }
}