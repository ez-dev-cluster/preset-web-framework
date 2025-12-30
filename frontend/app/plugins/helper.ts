export default defineNuxtPlugin(() => {
    const snackbarStore = useSnackbarStore();
    const loaderStore = useLoaderStore();
    const dialogStore = useDialogStore();

    return {
        provide: {
            snackbar: (color: 'success' | 'error' | 'info' | 'warning', message: string) => {
                snackbarStore.showSnackbar(color, message)
            },
            loading: (visible: boolean, message: string = "Loading") => {
                loaderStore.showLoader(visible, message)
            },
            dialog: {
                confirmDelete: async () => {
                    const result = await dialogStore.showConfirmDialog('คุณแน่ใจหรือไม่? การลบนี้ไม่สามารถย้อนกลับได้', 'ยืนยันการลบ')
                    return result[0]
                },
                confirm: (message: string) => {
                },
                alert: (message: string) => {
                },
                prompt: (message: string) => {
                },
                error: (message: string) => {
                },
            }
        }
    }
})