import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        this.components = [...source];
        this.delimiter = delimiter ?? this.delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components
            .map(c =>
                c
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
            )
            .join(this.delimiter);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        this.validateIndex(i);
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.validateIndex(i);
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.validateIndex(i);
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        this.validateIndex(i);
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        for (let index = 0; index < other.getNoComponents(); index++) {
            this.append(other.getComponent(index));
        }
    }

    /** 
    * Check if the index is in the correct range; otherwise throws an exception.
    * 
    * @param i index 
    */
    private validateIndex(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new RangeError(`index out of range: ${i}`);
        }
    }

}