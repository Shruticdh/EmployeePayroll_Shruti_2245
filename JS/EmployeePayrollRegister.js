document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("employeeForm");
    const nameInput = document.querySelector(".emp-reg-main-form-inputname input");
    const genderInputs = document.querySelectorAll("input[name='gender']");
    const departmentInputs = document.querySelectorAll("input[name='department']");
    const salarySelect = document.getElementById("selectsalary");
    const startDateSelect = {
        day: document.getElementById("selectday"),
        month: document.getElementById("selectMonth"),
        year: document.getElementById("selectYear"),
    };
    const notesTextarea = document.querySelector(".emp-reg-main-form-inputnotes input");
    const profileImageInputs = document.querySelectorAll("input[name='profile']");

    const resetButton = document.querySelector(".regResetButton"); // Or use ID if available
    const submitButton = document.getElementById("emp-reg-main-form-submit");

    let editIndex = localStorage.getItem("editEmployeeIndex");
    let editEmployeeData = localStorage.getItem("editEmployeeData");

    if (editEmployeeData) {
        editEmployeeData = JSON.parse(editEmployeeData);

        nameInput.value = editEmployeeData.name;
        salarySelect.value = editEmployeeData.salary;
        notesTextarea.value = editEmployeeData.notes || "";

        genderInputs.forEach(input => {
            input.checked = input.value === editEmployeeData.gender;
        });

        // Improved Department Handling (Use input.value directly)
        departmentInputs.forEach(input => {
            input.checked = editEmployeeData.departments.includes(input.value);
        });

        profileImageInputs.forEach(input => {
            input.checked = input.value === editEmployeeData.profileImage;
        });

        startDateSelect.day.value = editEmployeeData.startDate.day;
        startDateSelect.month.value = editEmployeeData.startDate.month;
        startDateSelect.year.value = editEmployeeData.startDate.year;

        localStorage.removeItem("editEmployeeIndex");
        localStorage.removeItem("editEmployeeData");

        editIndex = null; // Reset after populating
    }

    function validateForm() {
        let valid = true;
        // ... (your existing validation logic)
        return valid;
    }

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            form.reset();
        });
    }

    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            event.preventDefault();

            if (validateForm()) {
                const formData = {
                    name: nameInput.value,
                    profileImage: document.querySelector("input[name='profile']:checked")?.value,
                    gender: document.querySelector("input[name='gender']:checked")?.value,
                    departments: Array.from(departmentInputs).filter(input => input.checked).map(input => input.value), // Use input.value
                    salary: salarySelect.value,
                    startDate: {
                        day: startDateSelect.day.value,
                        month: startDateSelect.month.value,
                        year: startDateSelect.year.value,
                    },
                    notes: notesTextarea.value
                };

                let existingData = JSON.parse(localStorage.getItem("employeeData")) || [];

                if (editIndex !== null && editIndex !== undefined && editIndex >= 0 && editIndex < existingData.length) {
                    existingData[editIndex] = formData;
                } else {
                    existingData.push(formData);
                }

                localStorage.setItem("employeeData", JSON.stringify(existingData));

                alert("Employee data saved successfully!");
                window.location.href = "EmployeePayrollDashboard.html"; // Or window.location.reload();
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("employeeForm");
    const nameInput = document.querySelector(".emp-reg-main-form-inputname input");
    const genderInputs = document.querySelectorAll("input[name='gender']");
    const departmentInputs = document.querySelectorAll("input[name='department']");
    const salarySelect = document.getElementById("selectsalary");
    const startDateSelect = {
        day: document.getElementById("selectday"),
        month: document.getElementById("selectMonth"),
        year: document.getElementById("selectYear"),
    };
    const notesTextarea = document.querySelector(".emp-reg-main-form-inputnotes input");
    const profileImageInputs = document.querySelectorAll("input[name='profile']");

    const resetButton = document.querySelector(".regResetButton");
    const submitButton = document.getElementById("emp-reg-main-form-submit");

    let editIndex = localStorage.getItem("editEmployeeIndex");
    let employeeData = JSON.parse(localStorage.getItem("employeeData")) || [];

    if (editIndex !== null) {
        const employee = employeeData[editIndex];

        if (employee) {
            nameInput.value = employee.name;
            salarySelect.value = employee.salary;
            notesTextarea.value = employee.notes || "";

            genderInputs.forEach(input => {
                input.checked = input.value === employee.gender;
            });

            departmentInputs.forEach(input => {
                input.checked = employee.departments.includes(input.value);
            });

            profileImageInputs.forEach(input => {
                input.checked = input.value === employee.profileImage;
            });

            startDateSelect.day.value = employee.startDate.day;
            startDateSelect.month.value = employee.startDate.month;
            startDateSelect.year.value = employee.startDate.year;

            submitButton.textContent = "Update";
        } else {
            console.error("Employee not found at index:", editIndex);
            alert("Employee data not found for editing.");
            window.location.href = "employeeDashboard.html";
            return;
        }
    }

    function validateForm() {
        let valid = true;

        if (nameInput.value.trim() === "") {
            alert("Name is required.");
            valid = false;
        }

        if (![...genderInputs].some(input => input.checked)) {
            alert("Gender selection is required.");
            valid = false;
        }

        if (![...departmentInputs].some(input => input.checked)) {
            alert("At least one department must be selected.");
            valid = false;
        }

        if (salarySelect.value === "" || salarySelect.value === "Select Salary") {
            alert("Salary selection is required.");
            valid = false;
        }

        if (!startDateSelect.day.value || !startDateSelect.month.value || !startDateSelect.year.value) {
            alert("Start Date is incomplete.");
            valid = false;
        }

        return valid;
    }

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            form.reset();
        });
    }

    form.addEventListener("submit", function (event) { // Submit listener on the form
        event.preventDefault();

        if (validateForm()) {
            const formData = {
                name: nameInput.value,
                profileImage: document.querySelector("input[name='profile']:checked")?.value,
                gender: document.querySelector("input[name='gender']:checked")?.value,
                departments: Array.from(departmentInputs).filter(input => input.checked).map(input => input.value),
                salary: salarySelect.value,
                startDate: {
                    day: startDateSelect.day.value,
                    month: startDateSelect.month.value,
                    year: startDateSelect.year.value,
                },
                notes: notesTextarea.value
            };

            if (editIndex !== null) {
                employeeData[editIndex] = formData;
                localStorage.setItem("employeeData", JSON.stringify(employeeData));
                localStorage.removeItem("editEmployeeIndex");
                alert("Employee details updated successfully!");
            } else {
                employeeData.push(formData);
                localStorage.setItem("employeeData", JSON.stringify(employeeData));
                alert("New employee added successfully!");
            }

            form.reset(); // Reset the form after submit
            window.location.href = "EmployeePayrollDashboard.html";
        }
    });
});


// //JSON
// // document.addEventListener("DOMContentLoaded", function () {
// //     const form = document.getElementById("employeeForm");
// //     const nameInput = document.getElementById("name");
// //     const genderInputs = document.querySelectorAll('input[name="gender"]');
// //     const departmentInputs = document.querySelectorAll('input[name="department"]');
// //     const salarySelect = document.getElementById("salary");
// //     const startDateSelect = {
// //         day: document.getElementById("day"),
// //         month: document.getElementById("month"),
// //         year: document.getElementById("year"),
// //     };
// //     const notesTextarea = document.getElementById("notes");
// //     const profileImageInputs = document.querySelectorAll('input[name="profile"]');

// //     const resetButton = document.getElementById("resetButton");
// //     const submitButton = document.getElementById("submitButton");
// //     const cancelButton = document.getElementById("cancelButton");

// //     let editEmployeeData = JSON.parse(localStorage.getItem("editEmployeeData"));

// //     if (editEmployeeData) { // Edit mode
// //         nameInput.value = editEmployeeData.name;
// //         salarySelect.value = editEmployeeData.salary;
// //         notesTextarea.value = editEmployeeData.notes || "";

// //         genderInputs.forEach(input => {
// //             input.checked = input.value === editEmployeeData.gender;
// //         });

// //         departmentInputs.forEach(input => {
// //             input.checked = editEmployeeData.departments.includes(input.value);
// //         });

// //         profileImageInputs.forEach(input => {
// //             input.checked = input.value === editEmployeeData.profileImage;
// //         });

// //         startDateSelect.day.value = editEmployeeData.startDate.day;
// //         startDateSelect.month.value = editEmployeeData.startDate.month;
// //         startDateSelect.year.value = editEmployeeData.startDate.year;

// //         submitButton.textContent = "Update";
// //     }

// //     function validateForm() {
// //         let valid = true;

// //         if (!nameInput.value.trim()) {
// //             alert("Name is required.");
// //             valid = false;
// //         }

// //         if (![...genderInputs].some(input => input.checked)) {
// //             alert("Gender is required.");
// //             valid = false;
// //         }

// //         if (![...departmentInputs].some(input => input.checked)) {
// //             alert("At least one department must be selected.");
// //             valid = false;
// //         }

// //         if (!salarySelect.value) {
// //             alert("Salary is required.");
// //             valid = false;
// //         }

// //         if (!startDateSelect.day.value || !startDateSelect.month.value || !startDateSelect.year.value) {
// //             alert("Start Date is required.");
// //             valid = false;
// //         }

// //         if (!notesTextarea.value.trim()) {
// //             alert("Notes are required.");
// //             valid = false;
// //         }
// //         if (![...profileImageInputs].some(input => input.checked)) {
// //             alert("Profile Image is required.");
// //             valid = false;
// //         }

// //         return valid;
// //     }

// //     cancelButton.addEventListener("click", function (event) {
// //         event.preventDefault();
// //         window.location.href = "EmployeePayrollDashboard.html";
// //     });

// //     resetButton.addEventListener("click", function () {
// //         form.reset();
// //     });

// //     form.addEventListener("submit", function (event) {
// //         event.preventDefault();

// //         if (validateForm()) {
// //             const formData = {
// //                 name: nameInput.value,
// //                 profileImage: document.querySelector('input[name="profile"]:checked')?.value,
// //                 gender: document.querySelector('input[name="gender"]:checked')?.value,
// //                 departments: Array.from(departmentInputs).filter(input => input.checked).map(input => input.value),
// //                 salary: salarySelect.value,
// //                 startDate: {
// //                     day: startDateSelect.day.value,
// //                     month: startDateSelect.month.value,
// //                     year: startDateSelect.year.value,
// //                 },
// //                 notes: notesTextarea.value
// //             };

// //             const method = editEmployeeData ? "PATCH" : "POST";
// //             const url = editEmployeeData ? `http://localhost:3000/employees/${editEmployeeData.id}` : "http://localhost:3000/employees";

// //             console.log("Sending data:", formData); // Debugging: Check the data being sent

// //             fetch(url, {
// //                 method: method,
// //                 headers: {
// //                     "Content-Type": "application/json"
// //                 },
// //                 body: JSON.stringify(formData)
// //             })
// //                 .then(response => {
// //                     if (!response.ok) {
// //                         return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
// //                     }
// //                     return response.json();
// //                 })
// //                 .then(data => {
// //                     console.log("Data saved/updated:", data);
// //                     alert(editEmployeeData ? "Employee updated!" : "Employee added!");
// //                     localStorage.removeItem("editEmployeeData");
// //                     window.location.href = "EmployeePayrollDashboard.html";
// //                 })
// //                 .catch(error => {
// //                     console.error("Error saving data:", error);
// //                     alert("An error occurred. Please try again.");
// //                 });
// //         }
// //     });
// // });

// document.addEventListener("DOMContentLoaded", function () {
//     const form = document.getElementById("employeeForm");
//     const nameInput = document.querySelector('.emp-reg-main-form-inputname input');
//     const genderInputs = document.querySelectorAll('input[name="gender"]');
//     const departmentInputs = document.querySelectorAll('input[name="department"]');
//     const salarySelect = document.getElementById("selectsalary");
//     const startDateSelect = {
//         day: document.getElementById("selectday"),
//         month: document.getElementById("selectMonth"),
//         year: document.getElementById("selectYear"),
//     };
//     const notesTextarea = document.querySelector('.emp-reg-main-form-inputnotes input');
//     const profileImageInputs = document.querySelectorAll('input[name="profile"]');

//     const resetButton = document.querySelector(".regResetButton");
//     const submitButton = document.getElementById("emp-reg-main-form-submit");
//     const cancelButton = document.getElementById("emp-reg-main-form-cancel");

//     let editId = localStorage.getItem("editEmployeeId");

//     // Fetch data for editing (if editId exists)
//     if (editId) {
//         fetch(`http://localhost:5000/employees/${editId}`)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Employee data for edit:", data); // Check data in console

//                 nameInput.value = data.name;
//                 salarySelect.value = data.salary;
//                 notesTextarea.value = data.notes || "";

//                 genderInputs.forEach(input => {
//                     input.checked = input.value === data.gender;
//                 });

//                 departmentInputs.forEach(input => {
//                     input.checked = data.departments.includes(input.value);
//                 });

//                 profileImageInputs.forEach(input => {
//                     input.checked = input.value === data.profileImage;
//                 });

//                 startDateSelect.day.value = data.startDate.day;
//                 startDateSelect.month.value = data.startDate.month;
//                 startDateSelect.year.value = data.startDate.year;

//                 submitButton.textContent = "Update";
//             })
//             .catch(error => console.error("Error fetching employee data:", error));
//     }

//     function validateForm() {
//         // ... (Your validation logic - same as before)
//     }


//     if (cancelButton) {
//         cancelButton.addEventListener("click", function (event) {
//             event.preventDefault();
//             window.location.href = "employeeDashboard.html";
//         });
//     }

//     if (resetButton) {
//         resetButton.addEventListener("click", function () {
//             form.reset();
//         });
//     }

//     if (submitButton) {
//         submitButton.addEventListener("click", function (event) {
//             event.preventDefault();

//             if (validateForm()) {
//                 const formData = {
//                     name: nameInput.value,
//                     profileImage: document.querySelector('input[name="profile"]:checked')?.value,
//                     gender: document.querySelector('input[name="gender"]:checked')?.value,
//                     departments: [...departmentInputs].filter(input => input.checked).map(input => input.value),
//                     salary: salarySelect.value,
//                     startDate: {
//                         day: startDateSelect.day.value,
//                         month: startDateSelect.month.value,
//                         year: startDateSelect.year.value,
//                     },
//                     notes: notesTextarea.value
//                 };

//                 const method = editId ? "PUT" : "POST";
//                 const url = editId ? `http://localhost:5000/employees/${editId}` : "http://localhost:5000/employees";

//                 console.log("Sending data:", formData); // Check data in the console

//                 fetch(url, {
//                     method: method,
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(formData)
//                 })
//                     .then(response => {
//                         if (!response.ok) {
//                             return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
//                         }
//                         return response.json();
//                     })
//                     .then(data => {
//                         console.log("Data saved/updated:", data); // Check response data
//                         alert(editId ? "Employee updated successfully!" : "Employee added successfully!");

//                         if (editId) {
//                             localStorage.removeItem("editEmployeeId");
//                         }
//                         window.location.href = "EmployeePayrollDashboard.html"; // Redirect AFTER successful save/update
//                     })
//                     .catch(error => {
//                         console.error("Error saving/updating employee:", error);
//                         alert("An error occurred. Please try again.");
//                     });
//             }
//         });
//     }
// });