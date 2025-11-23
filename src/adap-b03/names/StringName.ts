import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        this.name = source;
        this.noComponents = this.countComponents();
    }

    public clone(): Name {
        return super.clone() as StringName;
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
        return this.noComponents;
    }

    public getComponent(i: number): string {
        this.validateIndex(i);

        let currentIndex = 0;
        let cur = "";
        let escaped = false;

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];

            if (escaped) {
                cur += ch;
                escaped = false;
            }
            else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            }
            else if (ch === this.delimiter) {
                if (currentIndex === i) {
                    return cur;
                }
                currentIndex++;
                cur = "";
            }
            else {
                cur += ch;
            }
        }

        return cur;
    }

    public setComponent(i: number, c: string) {
        this.validateIndex(i);

        const parts: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            parts.push(i === i ? c : this.getComponent(j));
        }
        this.name = parts
            .map(comp =>
                comp
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
            )
            .join(this.delimiter);
    }

    public insert(i: number, c: string) {
        this.validateIndex(i);

        const parts: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j === i) {
                parts.push(c);
            }
            parts.push(this.getComponent(j));
        }

        this.name = parts
            .map(comp =>
                comp
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
            )
            .join(this.delimiter);
        this.noComponents++;
    }

    public append(c: string) {
        const escapedComponent = c
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);

        if (this.name.length > 0) {
            this.name += this.delimiter + escapedComponent;
        } else {
            this.name = escapedComponent;
        }
        this.noComponents++;
    }

    public remove(i: number) {
        this.validateIndex(i);

        const parts: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j !== i) {
                parts.push(this.getComponent(j));
            }
        }

        this.name = parts
            .map(comp =>
                comp
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
            )
            .join(this.delimiter);
        this.noComponents--;
    }

    public concat(other: Name): void {
        super.concat(other);
    }


    /**
     * Count the number of components in the raw string.
     */
    private countComponents(): number {
        if (this.name.length === 0) {
            return 0;
        }

        let count = 1;
        let escaped = false;

        for (let i = 0; i < this.name.length; i++) {
            const ch = this.name[i];

            if (escaped) {
                escaped = false;
            }
            else if (ch === ESCAPE_CHARACTER) {
                escaped = true;
            }
            else if (ch === this.delimiter) {
                count++;
            }
        }

        return count;
    }

    /**
     * Check if the index is in the correct range; otherwise throws an exception.
     *
     * @param i index
     */
    private validateIndex(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new RangeError(`index out of range: ${i}`);
        }
    }

}