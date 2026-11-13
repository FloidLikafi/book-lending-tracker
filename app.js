const STORAGE_KEY = "loans";

const rules = {
  title: "Please enter the book title.",
  author: "Please enter the author's name.",
  borrower: "Please enter who borrowed the book.",
  dueDate: "Please choose a due date.",
  genre: "Please select a genre."
};

let loans = MiniLib.load(STORAGE_KEY);

function getStatus(loan) {
  if (loan.returned) {
    return "Returned";
  }
  if (loan.dueDate < MiniLib.today()) {
    return "Overdue";
  }
  return "On loan";
}

function getBadgeClass(status) {
  if (status === "Returned") {
    return "badge badge-success";
  }
  if (status === "Overdue") {
    return "badge badge-danger";
  }
  return "badge badge-warning";
}

function addLoan() {
  loans.push({
    id: Date.now(),
    title: MiniLib.get("title").value.trim(),
    author: MiniLib.get("author").value.trim(),
    borrower: MiniLib.get("borrower").value.trim(),
    dueDate: MiniLib.get("dueDate").value,
    genre: MiniLib.get("genre").value,
    returned: false
  });
  saveAndRender();
}

function markReturned(id) {
  for (const loan of loans) {
    if (loan.id === id) {
      loan.returned = true;
    }
  }
  saveAndRender();
}

function deleteLoan(id) {
  loans = loans.filter(function (loan) {
    return loan.id !== id;
  });
  saveAndRender();
}

function saveAndRender() {
  MiniLib.save(STORAGE_KEY, loans);
  render();
}

function render() {
  const tableBody = MiniLib.get("loan-table-body");
  MiniLib.clear(tableBody);
  let overdueCount = 0;

  for (const loan of loans) {
    const status = getStatus(loan);
    if (status === "Overdue") {
      overdueCount++;
    }

    const row = MiniLib.create("tr");
    row.appendChild(MiniLib.create("td", loan.title));
    row.appendChild(MiniLib.create("td", loan.author));
    row.appendChild(MiniLib.create("td", loan.borrower));
    row.appendChild(MiniLib.create("td", loan.dueDate));
    row.appendChild(MiniLib.create("td", loan.genre));

    const statusCell = MiniLib.create("td");
    statusCell.appendChild(MiniLib.create("span", status, getBadgeClass(status)));
    row.appendChild(statusCell);

    const actionCell = MiniLib.create("td");
    if (!loan.returned) {
      const returnButton = MiniLib.create("button", "Returned", "btn btn-sm btn-success mr-1");
      MiniLib.on(returnButton, "click", function () {
        markReturned(loan.id);
      });
      actionCell.appendChild(returnButton);
    }
    const deleteButton = MiniLib.create("button", "Delete", "btn btn-sm btn-danger");
    MiniLib.on(deleteButton, "click", function () {
      deleteLoan(loan.id);
    });
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  }

  MiniLib.get("total-loans").textContent = loans.length;
  MiniLib.get("overdue-loans").textContent = overdueCount;

  if (loans.length === 0) {
    MiniLib.show(MiniLib.get("empty-msg"));
  } else {
    MiniLib.hide(MiniLib.get("empty-msg"));
  }
}

MiniLib.on(MiniLib.get("loan-form"), "submit", function (event) {
  event.preventDefault();
  if (MiniLib.validateForm(rules)) {
    addLoan();
    MiniLib.get("loan-form").reset();
  }
});

MiniLib.liveValidate(rules);
render();
