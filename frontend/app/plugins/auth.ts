export default defineNuxtPlugin(async () => {
    const store = useAuthStore();
    await store.initAuth()
    return {
        provide: {
            auth: {
                has_perm(perm_code: string) {
                    if (!store.user) {
                        return false
                    }
                    return store.user.permissions.includes(perm_code)
                }
            }
        }
    }
})