export class CustomLock {
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
