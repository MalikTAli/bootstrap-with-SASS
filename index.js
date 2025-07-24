$(document).ready(function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const onlyLetters = /^[A-Za-z]+$/;

  function loadLogin() {
    attachLoginHandlers();
  }

  function loadSignup() {
    $("#signup-email").focus();
    attachSignupHandlers();
    $('#signUp-form input[type="submit"]')
      .prop("disabled", !$("#terms").is(":checked"))
      .toggleClass("disabled", !$("#terms").is(":checked"));
  }

  function showError(element, errorElement, msg) {
    errorElement.text(msg).show();
    element.addClass("my-b-error");
  }

  function clearError(element, errorElement) {
    errorElement.hide();
    element.removeClass("error-border");
  }

  function getMsg(element, key) {
    return element.data(`msg-${key}`);
  }

  function validateEmail(email, emailError) {
    const val = email.val().trim();
    clearError(email, emailError);
    if (!val) {
      showError(email, emailError, getMsg(email, "required"));
      return false;
    } else if (!emailRegex.test(val)) {
      showError(email, emailError, getMsg(email, "invalid"));
      return false;
    }
    return true;
  }

  function validatePassword(password, passwordError) {
    const val = password.val();
    clearError(password, passwordError);

    if (!val) {
      showError(password, passwordError, getMsg(password, "required"));
      return false;
    } else if (val.length < 8) {
      showError(password, passwordError, getMsg(password, "minlength"));
      return false;
    } else if (!/[A-Z]/.test(val)) {
      showError(password, passwordError, getMsg(password, "uppercase"));
      return false;
    } else if (!/[a-z]/.test(val)) {
      showError(password, passwordError, getMsg(password, "lowercase"));
      return false;
    } else if (!/[0-9]/.test(val)) {
      showError(password, passwordError, getMsg(password, "digit"));
      return false;
    } else if (!/[^A-Za-z0-9]/.test(val)) {
      showError(password, passwordError, getMsg(password, "special"));
      return false;
    }
    return true;
  }

  function validateName(name, nameError) {
    const val = name.val().trim();
    clearError(name, nameError);
    if (!val) {
      showError(name, nameError, getMsg(name, "required"));
      return false;
    } else if (!onlyLetters.test(val)) {
      showError(name, nameError, getMsg(name, "invalid"));
      return false;
    }
    return true;
  }

  function validateConfirmPassword(
    password,
    confirmPassword,
    confirmPasswordError
  ) {
    const passwordVal = password.val();
    const confirmVal = confirmPassword.val();
    clearError(confirmPassword, confirmPasswordError);
    if (confirmVal !== passwordVal) {
      showError(
        confirmPassword,
        confirmPasswordError,
        getMsg(confirmPassword, "mismatch")
      );
      return false;
    }
    return true;
  }

  function setupTogglePassword(selector, input) {
    $(selector).on("click", function () {
      const type = input.attr("type") === "password" ? "text" : "password";
      input.attr("type", type);
      $(this).text(type === "password" ? "Show" : "Hide");
    });
  }

  function attachLoginHandlers() {
    const email = $("#email");
    const password = $("#password");
    const emailError = $("#error-email");
    const passwordError = $("#error-password");
    const togglePassword = $(".togglePassword");
    setupTogglePassword(togglePassword, password);

    $(document).on("mousedown", function (e) {
      const isClickOnToggle = $(e.target).is(".togglePassword");
      const active = document.activeElement;

      if (active?.id === "email") {
        validateEmail(email, emailError);
      }

      if (!isClickOnToggle && active?.id === "password") {
        validatePassword(password, passwordError);
      }
    });

    $("#logIn-form").submit(function (e) {
      e.preventDefault();
      const validEmail = validateEmail(email, emailError);
      const validPassword = validatePassword(password, passwordError);
      if (validEmail && validPassword) alert("Login successful!");
    });
  }

  function attachSignupHandlers() {
    const firstName = $("#first-name");
    const lastName = $("#last-name");
    const email = $("#signup-email");
    const password = $("#signup-password");
    const confirmPassword = $("#confirm-password");
    const submitBtn = $("#signup-submit");
    const termsCheckbox = $("#terms");

    const firstNameError = $("#error-first-name");
    const lastNameError = $("#error-last-name");
    const emailError = $("#error-signup-email");
    const passwordError = $("#error-signup-password");
    const confirmPasswordError = $("#error-confirm-password");

    setupTogglePassword($(".togglePassword"), password);
    setupTogglePassword($("#toggleconfirmPassword"), confirmPassword);

    $(document).on("mousedown", function (e) {
      const target = $(e.target);
      const active = document.activeElement;
      if (active?.id === "signup-email") validateEmail(email, emailError);
      if (!target.is(".togglePassword") && active?.id === "signup-password")
        validatePassword(password, passwordError);
      if (
        !target.is("#toggleconfirmPassword") &&
        active?.id === "confirm-password"
      )
        validateConfirmPassword(
          password,
          confirmPassword,
          confirmPasswordError
        );
      if (active?.id === "first-name") validateName(firstName, firstNameError);
      if (active?.id === "last-name") validateName(lastName, lastNameError);
    });

    termsCheckbox.on("change", function () {
      const isDisabled = !this.checked;
      submitBtn
        .prop("disabled", isDisabled)
        .toggleClass("disabled", isDisabled);
    });

    $("#signUp-form").submit(function (e) {
      e.preventDefault();
      const valid =
        validateName(firstName, firstNameError) &&
        validateName(lastName, lastNameError) &&
        validateEmail(email, emailError) &&
        validatePassword(password, passwordError) &&
        validateConfirmPassword(
          password,
          confirmPassword,
          confirmPasswordError
        );

      if (valid) alert("Account created successfully");
    });
  }

  $("#logIn").click(() => {
    loadLogin();
  });

  $("#signUp").click(() => {
    loadSignup();
  });

  loadLogin();
});
