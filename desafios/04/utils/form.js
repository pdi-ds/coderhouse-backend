(() => {
  const form = document.querySelector("form"),
    submit = form.querySelector('button[type="submit"]'),
    alert = document.querySelector(".alert"),
    alertTxt = alert.querySelector("span"),
    alertList = alert.querySelector("ul");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert.classList.add("d-none");
    alertList
      .querySelectorAll("li")
      .forEach((node) => alertList.removeChild(node));
    alertList.classList.add("d-none");
    submit.setAttribute("disabled", "disabled");
    submit.textContent = "Sending...";
    const data = new FormData(form);
    const values = {};
    for (let entry of data.entries()) {
      values[entry[0]] = entry[1];
    }
    fetch(form.getAttribute("action"), {
      body: JSON.stringify(values),
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        submit.textContent = "Add...";
        if (result.hasOwnProperty("error") === true) {
          alert.classList.remove("alert-success");
          alert.classList.remove("alert-warning");
          alert.classList.add("alert-danger");
          alertTxt.textContent = result.error;
          if (result.hasOwnProperty("errors") === true) {
            alertList.append(
              ...result.errors.map(({ message }) => {
                const node = document.createElement("li");
                node.textContent = message;
                return node;
              })
            );
            alertList.classList.remove("d-none");
          }
        } else {
          alert.classList.remove("alert-warning");
          alert.classList.remove("alert-danger");
          alert.classList.add("alert-success");
          alertTxt.textContent = "The product has been entered successfully";
        }
        alert.classList.remove("d-none");
        submit.removeAttribute("disabled");
        submit.textContent = "Add";
      })
      .catch((err) => {
        console.log(err);
        alert.classList.remove("alert-warning");
        alert.classList.remove("alert-success");
        alert.classList.add("alert-danger");
        alertTxt.textContent =
          "An error occurred while trying to enter the product";
      });
  });
})();
