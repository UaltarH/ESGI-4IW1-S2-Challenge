export const formMessages = () => {
    const requiredMessage = "Ce champ est requis";
    const invalidStringMessage = "Ce champ doit être une chaîne de caractères";
    const invalidNumberMessage = "Ce champ doit être un nombre";
    const invalidEmailMessage = "Ce champ doit être une adresse email valide";
    const invalidDateMessage = "Ce champ doit être une date valide";
    return { requiredMessage, invalidStringMessage, invalidNumberMessage, invalidEmailMessage, invalidDateMessage }
}