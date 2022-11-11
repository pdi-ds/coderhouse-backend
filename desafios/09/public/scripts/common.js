(() => {
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
    firstName = mform.querySelector('[name="first_name"]'),
    lastName = mform.querySelector('[name="last_name"]'),
    alias = mform.querySelector('[name="alias"]'),
    age = mform.querySelector('[name="age"]'),
    avatar = mform.querySelector('[name="avatar"]'),
    message = mform.querySelector('[name="message"]'),
    invalidEmail = mform.querySelector('[name="email"] + .invalid-feedback'),
    invalidFirstName = mform.querySelector(
      '[name="first_name"] + .invalid-feedback'
    ),
    invalidLastName = mform.querySelector(
      '[name="last_name"] + .invalid-feedback'
    ),
    invalidAlias = mform.querySelector('[name="alias"] + .invalid-feedback'),
    invalidAge = mform.querySelector('[name="age"] + .invalid-feedback'),
    invalidAvatar = mform.querySelector('[name="avatar"] + .invalid-feedback'),
    invalidMsg = mform.querySelector('[name="message"] + .invalid-feedback'),
    validateEmail = (email) =>
      String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ),
    validateURL = (url) =>
      !!/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/.test(
        url
      );
  mform.addEventListener("submit", (e) => {
    e.preventDefault();
    const vEmail = validateEmail(email.value.trim()),
      vFirstName = firstName.value.trim() !== "",
      vLastName = lastName.value.trim() !== "",
      vAlias = alias.value.trim() !== "",
      vAge = age.value.trim() !== "",
      vAvatar = validateURL(avatar.value.trim()),
      vMessage = message.value.trim() !== "";
    if (
      vEmail &&
      vFirstName &&
      vLastName &&
      vAlias &&
      vAge &&
      vAvatar &&
      vMessage
    ) {
      const data = new FormData(mform);
      const values = {};
      for (let entry of data.entries()) {
        values[entry[0]] = entry[1].trim();
      }
      socket.emit("message", values);
      mform.querySelector('[name="message"]').value = "";
    }
    invalidEmail.classList[!vEmail ? "add" : "remove"]("d-block");
    invalidFirstName.classList[!vFirstName ? "add" : "remove"]("d-block");
    invalidLastName.classList[!vLastName ? "add" : "remove"]("d-block");
    invalidAlias.classList[!vAlias ? "add" : "remove"]("d-block");
    invalidAge.classList[!vAge ? "add" : "remove"]("d-block");
    invalidAvatar.classList[!vAvatar ? "add" : "remove"]("d-block");
    invalidMsg.classList[!vMessage ? "add" : "remove"]("d-block");
  });
  const buildMessagesList = (messages) => {
    if (messages.length > 0) {
      const container = document.getElementById("messages");
      container.innerHTML = messages
        .map(({ date, from, message }) => {
          return `<div style="margin-bottom: 6px;"><span style="overflow: hidden; display: inline-block; width: 24px; height: 24px; border-radius: 6px; vertical-align: middle; margin-right: 6px; background-color: #ccc;"><img src="${
            from.avatar
          }" alt="" width="24" height="24"></span><span>${
            from.email
          }</span> <span style="font-weight: bold; color: blue;">${new Date(
            date
          ).toLocaleString()}</span> <span style="font-style: italic; color: green">${message}</span></div>`;
        })
        .join("");
      container.scrollTo(0, container.scrollHeight);
    }
  };
  socket.on("messages", ({ messages }) => buildMessagesList(messages));
})();
