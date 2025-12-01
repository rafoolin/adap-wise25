import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

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
        IllegalArgumentException.assert(noBytes > 0, "Read size must be positive");
        InvalidStateException.assert(this.state === FileState.OPEN, "Cannot read closed or deleted file");
        return new Int8Array(noBytes);
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