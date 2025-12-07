import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter === undefined || delimiter === null || delimiter.length === 0) {
            throw new IllegalArgumentException("Delimiter must be a non-empty string");
        }
        this.delimiter = delimiter;
    }

    public clone(): Name {
        // This is a shallow clone that can work for all children
        const clone = Object.create(Object.getPrototypeOf(this)) as Name;
        if (clone === null || clone === undefined) {
            throw new MethodFailedException("Cloning failed");
        }
        return Object.assign(clone, this);
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === undefined || delimiter === null || delimiter.length === 0) {
            throw new IllegalArgumentException("Delimiter must be a non-empty string");
        }
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.getComponent(i));
        }

        return parts.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            const component = this.getComponent(i);
            if (component === undefined || component === null) {
                throw new InvalidStateException("Component is undefined or null");
            }
            const escaped = component
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
            parts.push(escaped);
        }
        return parts.join(this.delimiter);
    }

    public isEqual(other: Name): boolean {
        if (other === undefined || other === null) {
            return false;
        }
        if (other === this) {
            return true;
        }

        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    public getHashCode(): number {
        // Based on DJB2 Hash function
        const s = this.asDataString();
        let hash = 5381;
        for (let i = 0; i < s.length; i++) {
            hash = ((hash << 5) + hash) ^ s.charCodeAt(i);
        }
        return hash >>> 0;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}