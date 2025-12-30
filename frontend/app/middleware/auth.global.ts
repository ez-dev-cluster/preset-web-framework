export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === "/login") {
        return;
    }

    const auth_store = useAuthStore();
    if(!auth_store.user && to.meta.layout !== "customer") {
        return navigateTo("/login");
    }
})