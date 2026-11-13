const LendingLib = {
  loans: [],

  messages: {
    title: "Please enter the book title.",
    author: "Please enter the author's name.",
    borrower: "Please enter who borrowed the book.",
    dueDate: "Please choose a due date.",
    genre: "Please select a genre."
  },

  init: function () {
    const form = document.getElementById("loan-form");
    LendingLib.loans = JSON.parse(localStorage.getItem("loans")) || [];

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (LendingLib.validateForm()) {
        LendingLib.addLoan();
        form.reset();
      }
    });

    for (const id in LendingLib.messages) {
      const field = document.getElementById(id);
      field.addEventListener("input", function () {
        LendingLib.validateField(field);
      });
    }

    LendingLib.render();
  },

  save: function () {
    localStorage.setItem("loans", JSON.stringify(LendingLib.loans));
  },

  today: function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  },

  getStatus: function (loan) {
    if (loan.returned) {
      return "Returned";
    }
    if (loan.dueDate < LendingLib.today()) {
      return "Overdue";
    }
    return "On loan";
  },

  validateField: function (field) {
    const error = document.getElementById(field.id + "-error");

    if (field.value.trim() === "") {
      error.textContent = LendingLib.messages[field.id];
      field.classList.add("input-invalid");
      return false;
    }

    error.textContent = "";
    field.classList.remove("input-invalid");
    return true;
  },

  validateForm: function () {
    let isValid = true;
    for (const id in LendingLib.messages) {
      const field = document.getElementById(id);
      if (!LendingLib.validateField(field)) {
        isValid = false;
      }
    }
    return isValid;
  },

  addLoan: function () {
    const loan = {
      id: Date.now(),
      title: document.getElementById("title").value.trim(),
      author: document.getElementById("author").value.trim(),
      borrower: document.getElementById("borrower").value.trim(),
      dueDate: document.getElementById("dueDate").value,
      genre: document.getElementById("genre").value,
      returned: false
    };
    LendingLib.loans.push(loan);
    LendingLib.save();
    LendingLib.render();
  },

  markReturned: function (id) {
    for (const loan of LendingLib.loans) {
      if (loan.id === id) {
        loan.returned = true;
      }
    }
    LendingLib.save();
    LendingLib.render();
  },

  deleteLoan: function (id) {
    LendingLib.loans = LendingLib.loans.filter(function (loan) {
      return loan.id !== id;
    });
    LendingLib.save();
    LendingLib.render();
  },

  createCell: function (text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
  },

  createButton: function (text, className, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    button.className = "btn btn-small " + className;
    button.addEventListener("click", onClick);
    return button;
  },

  render: function () {
    const tableBody = document.getElementById("loan-table-body");
    tableBody.innerHTML = "";
    let overdueCount = 0;

    for (const loan of LendingLib.loans) {
      const status = LendingLib.getStatus(loan);
      if (status === "Overdue") {
        overdueCount++;
      }

      const row = document.createElement("tr");
      row.appendChild(LendingLib.createCell(loan.title));
      row.appendChild(LendingLib.createCell(loan.author));
      row.appendChild(LendingLib.createCell(loan.borrower));
      row.appendChild(LendingLib.createCell(loan.dueDate));
      row.appendChild(LendingLib.createCell(loan.genre));

      const statusCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.textContent = status;
      if (status === "Returned") {
        badge.className = "badge badge-returned";
      } else if (status === "Overdue") {
        badge.className = "badge badge-overdue";
      } else {
        badge.className = "badge badge-onloan";
      }
      statusCell.appendChild(badge);
      row.appendChild(statusCell);

      const actionCell = document.createElement("td");
      if (!loan.returned) {
        actionCell.appendChild(LendingLib.createButton("Returned", "btn-success", function () {
          LendingLib.markReturned(loan.id);
        }));
      }
      actionCell.appendChild(LendingLib.createButton("Delete", "btn-danger", function () {
        LendingLib.deleteLoan(loan.id);
      }));
      row.appendChild(actionCell);

      tableBody.appendChild(row);
    }

    document.getElementById("total-loans").textContent = LendingLib.loans.length;
    document.getElementById("overdue-loans").textContent = overdueCount;

    const emptyMessage = document.getElementById("empty-msg");
    if (LendingLib.loans.length === 0) {
      emptyMessage.classList.remove("hidden");
    } else {
      emptyMessage.classList.add("hidden");
    }
  }
};

document.addEventListener("DOMContentLoaded", LendingLib.init);
