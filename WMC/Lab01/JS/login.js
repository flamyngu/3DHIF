document.getElementById("loginBtn").addEventListener("click", function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";

  if (!username || !password) {
    errorMsg.textContent = "Bitte alle Felder ausfüllen.";
    return;
  }

  if (password.length < 4) {
    errorMsg.textContent = "Passwort muss mindestens 4 Zeichen lang sein.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  const handleLogin = (message) => {
    localStorage.setItem("currentUser", username);
    window.location.href = "../HTML/index.html";
  };

  if (users[username]) {
    if (users[username] === password) {
      handleLogin("Login erfolgreich! Willkommen zurück, " + username);
    } else {
      errorMsg.textContent = "Falsches Passwort.";
    }
  } else {
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));
    handleLogin("Neuer Account erstellt. Willkommen, " + username);
  }
});
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.src = "../icons/einblenden.png"; 
  } else {
    passwordInput.type = "password";
    togglePassword.src = "../icons/ausblenden.png"; 
  }
});
