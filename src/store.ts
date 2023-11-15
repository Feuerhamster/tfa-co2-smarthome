class LogStore {
	private _log: number[] = [];
	private maxlen: number;

	constructor(maxlen: number = 24) {
		this.maxlen = maxlen;
	}

	get log(): number[] {
		return this.log;
	}

	public push() {
		this._log.push()
		this.cleanup();
	}

	private cleanup() {
		if (this._log.length > this.maxlen) {
			this._log.pop();
		}
	}
}