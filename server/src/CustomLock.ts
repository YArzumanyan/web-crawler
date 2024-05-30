export class CustomLock {
    locked: boolean;
    constructor() {
        this.locked = false;
    }

    tryLock() {
        if (this.locked) {
            return false;
        }
        this.locked = true;
        return true;
    }

    unlock() {
        this.locked = false;
    }
}
