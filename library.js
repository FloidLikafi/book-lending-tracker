const MiniLib = {
  get: function (id) {
    return document.getElementById(id);
  },

  create: function (tag, text, className) {
    const element = document.createElement(tag);
    if (text) {
      element.textContent = text;
    }
    if (className) {
      element.className = className;
    }
    return element;
  },

  on: function (element, eventName, handler) {
    element.addEventListener(eventName, handler);
  },

  show: function (element) {
    element.classList.remove("hidden");
  },

  hide: function (element) {
    element.classList.add("hidden");
  },

  clear: function (element) {
    element.innerHTML = "";
  },

  save: function (key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  load: function (key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  },

  today: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  },

  isEmpty: function (value) {
    return value.trim() === "";
  },

  showError: function (field, message) {
    MiniLib.get(field.id + "-error").textContent = message;
    field.classList.add("is-invalid");
  },

  clearError: function (field) {
    MiniLib.get(field.id + "-error").textContent = "";
    field.classList.remove("is-invalid");
  },

  validateField: function (field, message) {
    if (MiniLib.isEmpty(field.value)) {
      MiniLib.showError(field, message);
      return false;
    }
    MiniLib.clearError(field);
    return true;
  },

  validateForm: function (rules) {
    let isValid = true;
    for (const id in rules) {
      if (!MiniLib.validateField(MiniLib.get(id), rules[id])) {
        isValid = false;
      }
    }
    return isValid;
  },

  liveValidate: function (rules) {
    for (const id in rules) {
      const field = MiniLib.get(id);
      MiniLib.on(field, "input", function () {
        MiniLib.validateField(field, rules[id]);
      });
    }
  }
};
