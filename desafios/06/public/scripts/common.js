(() => {
  const pform = document.querySelector('form[name="products"]'),
    psubmit = pform.querySelector('button[type="submit"]'),
    alert = document.querySelector(".alert"),
    alertTxt = alert.querySelector("span"),
    alertList = alert.querySelector("ul");
  let timeout;
  pform.addEventListener("submit", (e) => {
    e.preventDefault();
    clearTimeout(timeout);
    alert.classList.add("d-none");
    alertList
      .querySelectorAll("li")
      .forEach((node) => alertList.removeChild(node));
    alertList.classList.add("d-none");
    psubmit.setAttribute("disabled", "disabled");
    psubmit.textContent = "Sending...";
    const data = new FormData(pform);
    const values = {};
    for (let entry of data.entries()) {
      values[entry[0]] = entry[1];
    }
    fetch(pform.getAttribute("action"), {
      body: JSON.stringify(values),
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        psubmit.textContent = "Add";
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
          alertTxt.textContent = "Succes!";
          document
            .querySelectorAll('input[type="text"]')
            .forEach((input) => (input.value = ""));
          timeout = setTimeout(() => {
            alert.classList.add("d-none");
            alertList
              .querySelectorAll("li")
              .forEach((node) => alertList.removeChild(node));
            alertList.classList.add("d-none");
          }, 2000);
        }
        alert.classList.remove("d-none");
        psubmit.removeAttribute("disabled");
        psubmit.textContent = "Add";
      })
      .catch((err) => {
        console.log(err);
        alert.classList.remove("alert-warning");
        alert.classList.remove("alert-success");
        alert.classList.add("alert-danger");
        alertTxt.textContent = "Error";
      });
  });
  let template;
  const socket = io();
  const buildProductList = (products) => {
    if (typeof template === "undefined") {
      fetch("handlebars/products.handlebars")
        .then((result) => result.text())
        .then((result) => (template = Handlebars.compile(result)))
        .then(() => buildProductList(products));
    } else {
      document.getElementById("products").innerHTML = template({ products });
    }
  };
  socket.on("products", ({ products }) => buildProductList(products));
  const mform = document.querySelector('form[name="messages"]'),
    email = mform.querySelector('[name="email"]'),
    message = mform.querySelector('[name="message"]'),
    invalidEmail = mform.querySelector('[name="email"] + .invalid-feedback'),
    invalidMsg = mform.querySelector('[name="message"] + .invalid-feedback'),
    validateEmail = (email) =>
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
  mform.addEventListener("submit", (e) => {
    e.preventDefault();
    const vemail = validateEmail(email.value);
    const vmsg = message.value.trim() !== "";
    if (vemail && vmsg) {
      const data = new FormData(mform);
      const values = {};
      for (let entry of data.entries()) {
        values[entry[0]] = entry[1];
      }
      socket.emit("message", values);
      mform.querySelector('[name="message"]').value = "";
    }
    invalidEmail.classList[!vemail ? "add" : "remove"]("d-block");
    invalidMsg.classList[!vmsg ? "add" : "remove"]("d-block");
  });
  const buildMessagesList = (messages) => {
    if (messages.length > 0) {
      const container = document.getElementById("messages");
      container.innerHTML = messages
        .map(({ date, email, message }) => {
          return `<span>${email}</span> <span style="font-weight: bold; color: blue;">${new Date(
            date
          ).toLocaleString()}</span> <span style="font-style: italic; color: green">${message}</span>`;
        })
        .join("<br>");
      container.scrollTo(0, container.scrollHeight);
    }
  };
  socket.on("messages", ({ messages }) => buildMessagesList(messages));
})();
