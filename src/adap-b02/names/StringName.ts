import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        this.delimiter = delimiter ?? this.delimiter;
        this.noComponents = this.countComponents();
    }

    public asString(delimiter: string = this.delimiter): string {
        const parts: string[] = [];
        for (let i = 0; i < this.noComponents; i++) {
            parts.push(this.getComponent(i));
        }
        return parts.join(delimiter);
    }

    public asDataString(): string {
        const parts: string[] = [];
        for (let i = 0; i < this.noComponents; i++) {
            const component = this.getComponent(i);
            const escaped = component
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
            parts.push(escaped);
        }
        return parts.join(this.delimiter);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        this.validateIndex(x);

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
                if (currentIndex === x) {
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

    public setComponent(n: number, c: string): void {
        this.validateIndex(n);

        const parts: string[] = [];
        for (let i = 0; i < this.noComponents; i++) {
            parts.push(i === n ? c : this.getComponent(i));
        }
        this.name = parts
            .map(comp =>
                comp
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
            )
            .join(this.delimiter);
    }

    public insert(n: number, c: string): void {
        this.validateIndex(n);

        const parts: string[] = [];
        for (let i = 0; i < this.noComponents; i++) {
            if (i === n) {
                parts.push(c);
            }
            parts.push(this.getComponent(i));
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

    public append(c: string): void {
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

    public remove(n: number): void {
        this.validateIndex(n);

        const parts: string[] = [];
        for (let i = 0; i < this.noComponents; i++) {
            if (i !== n) {
                parts.push(this.getComponent(i));
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
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
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