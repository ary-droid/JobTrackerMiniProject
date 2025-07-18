class jobApplication {
  constructor() {
    this.jobApplications = [];
    this.loadJobApplicationsFromLocalStorage();
  }

  addJobApplications(jobApplicationObject) {
    this.jobApplications.push(jobApplicationObject);
    this.saveJobAppToLocalStorage();
  }

  getAllJobApplication() {
    return this.jobApplications;
  }

  saveJobAppToLocalStorage() {
    localStorage.setItem(
      "jobApplications",
      JSON.stringify(this.jobApplications)
    );
  }

  loadJobApplicationsFromLocalStorage() {
    let storedJobs = JSON.parse(localStorage.getItem("jobApplications")) || [];
    this.jobApplications = storedJobs;
  }

  deleteJobApplication(index) {
    this.jobApplications.splice(index, 1);
    this.saveJobAppToLocalStorage();
  }

  editJobApplication(index, updateData) {
    this.jobApplications[index] = updateData; // ✅ FIXED TYPO
    this.saveJobAppToLocalStorage();
  }
}

//Form application
let MyjobApplication = new jobApplication();

let formElement = document.querySelector('#job-application-form');
formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Form Submitted");

  let jobApplicationData = {
    company: formElement["company"].value,
    position: formElement["position"].value,
    date: formElement["date"].value,
    status: formElement["status"].value,
    notes: formElement["notes"].value,
  };

  let editIndex = formElement.getAttribute("data-edit-mode"); // ✅ FIXED

  if (editIndex !== null) {
    MyjobApplication.editJobApplication(editIndex, jobApplicationData);
    formElement.removeAttribute("data-edit-mode");
    showAlert("form edited successfully");
  } else {
    console.log(MyjobApplication.addJobApplications(jobApplicationData));
    showAlert("form submitted successfully");
  }

  displayDataAndBuildTable();
});

/* information */
let jobApplicationTableBody = document.querySelector("#job-application-table-body");

function clearTable() {
  jobApplicationTableBody.innerHTML = "";
}

function displayDataAndBuildTable() {
  clearTable();
  let jobApplication = MyjobApplication.getAllJobApplication();

  jobApplication.forEach((jobA, index) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${jobA.company}</td>
      <td>${jobA.position}</td>
      <td>${jobA.date}</td>
      <td>${jobA.status}</td>
      <td>${jobA.notes}</td>
      <button class="delete-btn" data-index="${index}">Delete</button>
      <button class="edit-btn" data-index="${index}">Edit</button>
    `;

    jobApplicationTableBody.appendChild(row);
  });

  // ✅ Moved outside the loop to prevent multiple bindings
  let deleteBtn = document.querySelectorAll(".delete-btn");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", event => {
      let index = event.target.getAttribute("data-index");
      MyjobApplication.deleteJobApplication(index);
      displayDataAndBuildTable();
    });
  });

  let editBtn = document.querySelectorAll(".edit-btn");
  editBtn.forEach((btn) => {
    btn.addEventListener("click", event => {
      document.querySelector("#job-application-form").scrollIntoView({ behavior: "smooth" });

      let index = event.target.getAttribute("data-index");
      let jobtoEdit = MyjobApplication.getAllJobApplication()[index];

      formElement["company"].value = jobtoEdit.company;
      formElement["position"].value = jobtoEdit.position;
      formElement["status"].value = jobtoEdit.status;
      formElement["date"].value = jobtoEdit.date;
      formElement["notes"].value = jobtoEdit.notes;

      formElement.setAttribute("data-edit-mode", index);
    });
  });
}
function showAlert(message, color = "#4caf50") {
  // Remove existing alert if any
  let existing = document.querySelector(".alert-box");
  if (existing) existing.remove();

  // Create new alert
  let alertBox = document.createElement("div");
  alertBox.classList.add("alert-box");
  alertBox.style.backgroundColor = color;
  alertBox.textContent = message;

  document.body.appendChild(alertBox);
}


displayDataAndBuildTable();

