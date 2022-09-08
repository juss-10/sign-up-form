const inputs = [...document.querySelectorAll(".sign-up-form input")];
const firstPassword = document.querySelector("#password");
const passwordConfirmation = document.querySelector("#confirm-password");
const passwords = [firstPassword, passwordConfirmation];
const form = document.querySelector("#form");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
let hasConfirmedPassword = false;

inputs.forEach(input => input.addEventListener("keyup", e => {
    removeWhitespace(e)
    inputHandler(e)
}))

firstPassword.addEventListener("input", showPasswordPopup)
inputs.forEach(input => input.addEventListener("focusout", e => inputHandler(e)))
form.addEventListener("submit", e => {
    e.preventDefault()

    const isValidForm = inputs.every(input => {
        return input.validity.valid && hasConfirmedPassword
    })

    if (isValidForm) {
        showModal()
    }
})

closeModalBtn.addEventListener("click", () => {
    resetForm()
    closeModal()
})

function inputHandler(e) {
    const input = {
        element: e.currentTarget,
        value: e.currentTarget.value,
        valid: e.currentTarget.validity.valid && e.currentTarget.value !== "",
        hasFocus: e.currentTarget === document.activeElement,
        parent: e.currentTarget.parentElement
    }

    const isTypingFirstPassword = input.element === firstPassword;
    const isPasswordField = input.element === firstPassword || input.element === passwordConfirmation;
    const isConfirmingPassword = input.element !== firstPassword && isPasswordField

    setToLowerCase(isPasswordField, input.hasFocus, input.element, input.value)

    if (isTypingFirstPassword) {
        validatePassword(input)
    } else if (!isPasswordField) {
        validate(input)
    } else if (isConfirmingPassword) {
        validateConfirmation(input)
    }
}

function validatePassword({ valid, hasFocus, parent }) {
    if (valid) {
        setIcon(parent, "valid")
        passwordConfirmation.disabled = false;
    } else if (!valid && !hasFocus) {
        setIcon(parent, "invalid")
        passwordConfirmation.disabled = true;
        passwordConfirmation.value = "";
    } else if (!valid) {
        setIcon(parent, "indeterminate")
        passwordConfirmation.disabled = true;
        passwordConfirmation.value = "";
    }
}

function validate({ valid, hasFocus, parent }) {
    if (valid) {
        setIcon(parent, "valid")
    } else if (!valid && !hasFocus) {
        setIcon(parent, "invalid")
    } else if (!valid) {
        setIcon(parent, "indeterminate")
    }
}

function validateConfirmation({ hasFocus, parent }) {

    hasConfirmedPassword = firstPassword.value === passwordConfirmation.value;

    if (hasConfirmedPassword) {
        setIcon(parent, "valid")
    } else if (!hasConfirmedPassword && !hasFocus) {
        setIcon(parent, "invalid")
    } else if (!hasConfirmedPassword) {
        setIcon(parent, "indeterminate")
    }
}


function setIcon(iconContainer, status) {
    if (iconContainer.classList.contains(status)) return;

    switch (status) {
        case "valid":
            updateIconClasses(iconContainer, "valid", ["invalid", "indeterminate"])
            break;
        case "invalid":
            updateIconClasses(iconContainer, "invalid", ["valid", "indeterminate"])
            break;
        case "indeterminate":
            updateIconClasses(iconContainer, "indeterminate", ["valid", "invalid"])
            break;
        default:
            removeIconClasses(iconContainer)
    }
}

function updateIconClasses(iconContainer, classToAdd, classesToRemove) {
    iconContainer.classList.remove(...classesToRemove)
    iconContainer.classList.add(classToAdd)
}

function removeIconClasses(iconContainer) {
    iconContainer.classList.remove("valid", "invalid", "indeterminate")
}

function setToLowerCase(isPasswordField, hasFocus, inputElement, inputValue) {
    if (!isPasswordField && !hasFocus) {
        inputElement.value = inputValue.toLowerCase();
    }
}

function showPasswordPopup() {
    document.querySelector("#password-popup").classList.add("visible")
}

function removeWhitespace(e) {
    e.currentTarget.value = e.currentTarget.value.trim();
}

function showModal() {
    modal.classList.add("visible")
}

function closeModal() {
    modal.classList.remove("visible")
}

function resetForm() {
    inputs.forEach(input => input.value = "")
    hasConfirmedPassword = false;
}