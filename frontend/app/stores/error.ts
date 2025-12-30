import {defineStore} from "pinia";
import {FetchError} from "ofetch";

type ErrorHandler = (error: Error) => boolean;

export const useErrorStore = defineStore('error', {
    state: () => {
        return {
            dialog: false,
            error: null as Error | null,
            form_errors: {} as any
        }
    },

    actions: {
        /**
         * ErrorHandler, return true if error is handled
         * @param error
         */
        handleUnexpectedError(error: Error) {
            console.error(error)
            this.dialog = true
            this.error = error
            return true
        },

        /**
         * ErrorHandler, return true if error is handled
         * @param error
         */
        handleFetchError(error: FetchError): boolean {
            if (error instanceof FetchError) {
                if (!error.status) {
                    return false
                }

                if (error.status === 400) {
                    this.form_errors = error.data
                    return true
                }
            }

            return false
        },

        /**
         * Loop through all handlers, stop if the error is handled
         * @param error
         * @param handlers
         */
        handle(error: Error, handlers?: ErrorHandler[]): void {
            handlers = handlers || [this.handleFetchError, this.handleUnexpectedError]

            let is_handled = false;

            for (const handler of handlers) {
                is_handled = handler(error);
                if (is_handled) {
                    return
                }
            }
        },

        clear() {
            this.dialog = false
            this.error = null
            this.form_errors = {}
        }
    }
})