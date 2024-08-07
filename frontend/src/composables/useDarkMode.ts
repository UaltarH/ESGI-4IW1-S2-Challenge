export const useDarkMode = () => {
    const toggleDarkMode = (e: Event) => {
        if(e.target === null) {
            return;
        }
        if(!(e.target instanceof HTMLElement))
            return;
        let isDarkMode:boolean = applyDarkMode();
        localStorage.setItem("darkMode", String(isDarkMode));
    };
    const applyDarkMode = ((isToggled?:boolean) => {
        const html = document.getElementsByTagName("html")[0];
        const toggle = document.getElementById("dark-mode-toggle");
        if(toggle === null) {
            throw new Error("Dark mode toggle not found");
        }
        if(isToggled === undefined) {
            html.classList.toggle("dark");
            toggle.classList.toggle("dark");
            return html.classList.contains("dark");
        }
        else {
            if(isToggled) {
                html.classList.add("dark");
                if(!toggle.classList.contains("dark"))
                    toggle.classList.add("dark");
                return true
            } else {
                html.classList.remove("dark");
                toggle.classList.remove("dark");
                return false;
            }
        }
    });
    const loadDarkModePreference = (() => {
        const darkMode = localStorage.getItem("darkMode");
        const isDarkMode = darkMode === "true";
        applyDarkMode(isDarkMode);
    });
    return {toggleDarkMode, loadDarkModePreference};
};