// pubsub.js
import { EventEmitter } from "events";

class pubsubClass extends EventEmitter {
  asyncIterator(eventName) {
    const ee = this;
    return {
      next() {
        return new Promise((resolve) => {
          ee.once(eventName, (data) => {
            resolve({ value: data, done: false });
          });
        });
      },
      return() {
        return Promise.resolve({ value: undefined, done: true });
      },
      throw(error) {
        return Promise.reject(error);
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }

  publish(event, payload) {
    this.emit(event, payload);
  }
}

export const pubsub = new pubsubClass();
