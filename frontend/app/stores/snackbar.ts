import {defineStore} from "pinia";

export const useSnackbarStore = defineStore('snackbar', {
    state() {
        return {
            visible: false,
            message: '',
            color: ''
        }
    },

    actions: {
        showSnackbar(color: 'success' | 'error' | 'info' | 'warning', message: string) {
            this.visible = false;

            setTimeout(() => {
                this.visible = true;
                this.message = message;
                this.color = color;
            }, 1)
        }
    }
})
