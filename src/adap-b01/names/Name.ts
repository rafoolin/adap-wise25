export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        // throw new Error("needs implementation or deletion");
        this.components = [...other];
        this.delimiter = delimiter ?? this.delimiter;
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        // throw new Error("needs implementation or deletion");
        return this.components.join(delimiter).replaceAll(ESCAPE_CHARACTER, "");
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        // throw new Error("needs implementation or deletion");
        return this.components.join(this.delimiter);
    }

    /** Returns properly masked component string */
    public getComponent(i: number): string {
        // throw new Error("needs implementation or deletion");
        this.validateIndex(i);
        return this.components[i];

    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        // throw new Error("needs implementation or deletion");
        this.validateIndex(i);
        this.components[i] = c;
    }

    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        // throw new Error("needs implementation or deletion");
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        // throw new Error("needs implementation or deletion");
        this.validateIndex(i);
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        // throw new Error("needs implementation or deletion");
        this.components.push(c);
    }

    public remove(i: number): void {
        // throw new Error("needs implementation or deletion");
        this.validateIndex(i);
        this.components.splice(i, 1);
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
