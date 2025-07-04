export const hashPassword = (password: string): string => {
    return btoa(password) 
}
