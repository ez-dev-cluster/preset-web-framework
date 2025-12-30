import {defineStore} from "pinia";

interface DialogButton {
    text: string;
    color: string;
    value: string;
    position: 'left' | 'center' | 'right';
}

export const useDialogStore = defineStore('dialog', {
    state() {
        return {
            ref: null as HTMLElement | null,
            visible: false,
            title: '',
            body: '',
            input: '',
            input_type: '',
            buttons: [] as DialogButton[],
        }
    },

    actions: {
        setupRef(ref: any) {
            this.ref = ref
        },

        clear () {
            this.title = ''
            this.body = ''
            this.input = ''
            this.input_type = ''
            this.buttons = []
        },

        dialogResolvePromise (): Promise<string[]> {
            return new Promise((resolve) => {
                const onClick = (e: Event) => {
                    resolve([(e as CustomEvent).detail, this.input])
                    this.visible = false
                    this.ref!.removeEventListener('x-click', onClick)
                }
                this.ref!.addEventListener('x-click', onClick)
            })
        },

        showAlertDialog(body: string, title: string = '') {
            this.clear()
            this.visible = true
            this.title = title
            this.body = body

            this.buttons = [{
                text: 'OK',
                color: 'primary',
                value: 'ok',
                position: 'center'
            }]

            return this.dialogResolvePromise()
        },

        showConfirmDialog(body: string, title: string = ''): Promise<string[]> {
            this.clear()
            this.visible = true;
            this.title = title
            this.body = body;

            this.buttons = [
                {
                    text: 'Cancel',
                    color: '',
                    value: 'cancel',
                    position: 'right'
                },
                {
                    text: 'Confirm',
                    color: 'primary',
                    value: 'confirm',
                    position: 'left'
                }
            ]

            return this.dialogResolvePromise()
        },

        showPromptDialog(body: string, title: string = '') {
            this.clear()
            this.visible = true;
            this.title = title
            this.body = body;
            this.input_type = 'text'

            this.buttons = [
                {
                    text: 'Cancel',
                    color: '',
                    value: 'cancel',
                    position: 'left'
                },
                {
                    text: 'Confirm',
                    color: 'primary',
                    value: 'confirm',
                    position: 'right'
                },
            ]

            return this.dialogResolvePromise()
        },

        showErrorDialog(error: Error) {

        }
    }
})
