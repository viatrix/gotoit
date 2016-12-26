
import {tick} from '../App';

class ValueCache {
    constructor(expire, sourceFunction) {
        this.stored_value = undefined;
        this.last_refresh = 0;
        this.expire = expire;
        this.sourceFunction = sourceFunction;
    }

    get() {
        if (tick - this.last_refresh > this.expire) {
            this.stored_value = this.sourceFunction();
            this.last_refresh = tick;
        }
        return this.stored_value;
    }
}




/*

class ValueCacheStore {
    constructor() {
        this.stored_value = undefined;
        this.last_refresh = 0;
    }
}

class ValueCacheCatcher {
    constructor(expire, sourceFunction) {
        this.expire = expire;
        this.sourceFunction = sourceFunction;
    }

    set(target, key, value, receiver) {
        throw new Error("Please don't set properties of ValueCache object.");
    }

    get(target, key, value, receiver) {
        return this.sourceFunction();
    }
}

class ValueCache {
    constructor(expire, sourceFunction) {
        //let proxy = new Proxy(new ValueCacheStore(), new ValueCacheCatcher(expire, sourceFunction));
        let proxy = new Proxy('', new ValueCacheCatcher(expire, sourceFunction));
        console.log(proxy);
        return proxy;
    }
}

*/

export default ValueCache;