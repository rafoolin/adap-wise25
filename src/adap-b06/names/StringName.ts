import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected readonly name: string;
    protected readonly noComponents: number;

    constructor(source: string, delimiter?: string) {
        super(delimiter ?? DEFAULT_DELIMITER);
        if (this.delimiter === undefined || this.delimiter === null || this.delimiter.length === 0) {
            throw new InvalidStateException("Final delimiter must be a non-empty string");
        }
        if (source === undefined || source === null) {
            throw new IllegalArgumentException("Source string must be defined and non-null");
        }
        this.name = source;
        this.noComponents = this.countComponents();
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
        // Handle possibly multi-character delimiter by scanning and matching
        // while respecting escape characters. We must return empty components
        // for consecutive delimiters and for a trailing delimiter.
        let currentIndex = 0;
        let cur = "";
        let escaped = false;
        const delim = this.delimiter;
        const nameLen = this.name.length;


        for (let j = 0; j < nameLen;) {
            const ch = this.name[j];

            if (escaped) {
                cur += ch;
                escaped = false;
                j++;
                continue;
            }

            if (ch === ESCAPE_CHARACTER) {
                escaped = true;
                j++;
                continue;
            }

            // If delimiter is single-char, fast path. Otherwise check substring.
            if (delim.length === 1) {
                if (ch === delim) {
                    if (currentIndex === i) {
                        return cur;
                    }
                    currentIndex++;
                    cur = "";
                    j++;
                    continue;
                }
                cur += ch;
                j++;
                continue;
            }

            // Multi-character delimiter check
            if (j + delim.length <= nameLen && this.name.substring(j, j + delim.length) === delim) {
                if (currentIndex === i) {
                    return cur;
                }
                currentIndex++;
                cur = "";
                j += delim.length;
                continue;
            }

            // normal character
            cur += ch;
            j++;
        }

        // If we reached the end, `cur` holds the last component (possibly empty).
        return cur;
    }

    public setComponent(i: number, c: string): Name {
        this.validateIndex(i);

        const parts: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            parts.push(j === i ? c : this.getComponent(j));
        }
        return new StringName(
            parts
                .map(comp =>
                    comp
                        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                        .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
                )
                .join(this.delimiter),
            this.delimiter
        );
    }

    public insert(i: number, c: string): Name {
        this.validateIndex(i);

        const parts: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j === i) {
                parts.push(c);
            }
            parts.push(this.getComponent(j));
        }

        return new StringName(
            parts
                .map(comp =>
                    comp
                        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                        .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
                )
                .join(this.delimiter),
            this.delimiter
        );
    }

    public append(c: string): Name {

        const escapedComponent = c
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);

        // Empty string should be similar to ["", "delimiter"]
        if (this.noComponents === 0 && this.name === "") {
            return new StringName(this.delimiter + escapedComponent, this.delimiter);
        }

        if (this.name.length > 0) {
            return new StringName(this.name + this.delimiter + escapedComponent, this.delimiter);
        }
        return new StringName(escapedComponent, this.delimiter);

    }

    public remove(i: number): Name {
        this.validateIndex(i);


        const parts: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            if (j !== i) {
                parts.push(this.getComponent(j));
            }
        }

        return new StringName(
            parts
                .map(comp =>
                    comp
                        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                        .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
                )
                .join(this.delimiter),
            this.delimiter
        );
    }

    public concat(other: Name): Name {
        const parts: string[] = [];
        for (let j = 0; j < this.noComponents; j++) {
            parts.push(this.getComponent(j));
        }
        for (let k = 0; k < other.getNoComponents(); k++) {
            parts.push(other.getComponent(k));
        }

        return new StringName(
            parts
                .map(comp =>
                    comp
                        .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                        .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
                )
                .join(this.delimiter),
            this.delimiter
        );
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
        IllegalArgumentException.assert(i >= 0 && i < this.noComponents, `index out of range: ${i}`);
    }

}