import {defineStore} from "pinia";

export const useLoaderStore = defineStore('loader', {
    state() {
        return {
            visible: false,
            message: 'Loading',
        }
    },

    actions: {
        showLoader(visible: boolean, message: string = "Loading"): void {
            this.visible = visible;
            this.message = message;
        }
    }
})
