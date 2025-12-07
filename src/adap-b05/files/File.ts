import { Node } from "./Node";
import { Directory } from "./Directory";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { MethodFailedException } from "../../adap-b05/common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        InvalidStateException.assert(this.state !== FileState.DELETED, "Cannot open deleted file");
        InvalidStateException.assert(this.state !== FileState.OPEN, "File already open");
        this.state = FileState.OPEN;
    }

    public read(noBytes: number): Int8Array {
        let result: Int8Array = new Int8Array(noBytes);
        // do something

        let tries: number = 0;
        for (let i: number = 0; i < noBytes; i++) {
            try {
                result[i] = this.readNextByte();
            } catch (ex) {
                tries++;
                if (ex instanceof MethodFailedException) {
                    // Oh no! What @todo?!
                }
            }
        }

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }


    public close(): void {
        InvalidStateException.assert(this.state !== FileState.DELETED, "Cannot close deleted file");
        InvalidStateException.assert(this.state === FileState.OPEN, "File not open");
        this.state = FileState.CLOSED;
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}