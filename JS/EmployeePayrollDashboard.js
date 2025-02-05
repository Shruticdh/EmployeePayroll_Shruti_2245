// ///original
$(document).ready(function () {
    const empDashboardRow = $("#employeeTable");
    const searchInput = $(".emp-dash-main-searchplaceholder");
    let employeeData = JSON.parse(localStorage.getItem("employeeData")) || [];

    // Render Employee Table
    function renderTable(data) {
        empDashboardRow.empty(); // Clear existing rows

        if (data.length > 0) {
            $.each(data, function (index, employee) {
                const row = $("<tr>");
            
                    const profileImageCell = $("<td>");
                    if (employee.profileImage) {
                        const profileImage = $("<img>").attr("src", `../Assets/${employee.profileImage}`).addClass("emp-reg-main-form-profile profile-image");
                        profileImageCell.append(profileImage);
                    } else {
                        profileImageCell.text("No image");
                    }
                    row.append(profileImageCell);

                // Name, Gender, Department, Salary, Start Date
                row.append($("<td>").text(employee.name));
                row.append($("<td>").text(employee.gender));
                row.append($("<td>").text(employee.departments.join(", ")));
                row.append($("<td>").text(employee.salary));
                row.append($("<td>").text(`${employee.startDate.day}/${employee.startDate.month}/${employee.startDate.year}`));

                // Actions (Edit and Delete buttons)
                const actionsCell = $("<td>").html(`
                    <button class="edit-btn" data-index="${index}">
                        <i class="fas fa-edit"></i></button> 
                    <button class="delete-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i></button>
                `);
                row.append(actionsCell);
                empDashboardRow.append(row);
            });
        }else {
            empDashboardRow.html("<tr><td colspan='7'>No employee data found.</td></tr>");
        }
    }

    // Initial Table Render
    renderTable(employeeData);

    // Search Functionality
    searchInput.on("input", function () {
        const query = searchInput.val().toLowerCase();
        const filteredData = employeeData.filter(employee =>
            employee.name.toLowerCase().includes(query) ||
            employee.gender.toLowerCase().includes(query) ||
            employee.departments.some(dept => dept.toLowerCase().includes(query)) ||
            employee.salary.toLowerCase().includes(query) ||
            `${employee.startDate.day}/${employee.startDate.month}/${employee.startDate.year}`.includes(query)
        );

        renderTable(filteredData);
    });

    $(document).on("click", ".edit-btn", function () {
        const index = $(this).data("index");
        const employee = employeeData[index];

        // Store selected employee details and index in localStorage
        localStorage.setItem("editEmployeeIndex", index);
        localStorage.setItem("editEmployeeData", JSON.stringify(employee));

        // Navigate to registration page for editing
        window.location.href = "EmployeePayrollRegister.html";
    });

    // Delete Employee Function
    $(document).on("click", ".delete-btn", function () {
        const index = $(this).data("index");

        if (confirm("Are you sure you want to delete this employee?")) {
            employeeData.splice(index, 1);
            localStorage.setItem("employeeData", JSON.stringify(employeeData));
            renderTable(employeeData);
            alert("Employee deleted successfully!");
        }
    });

    // Hide form initially
    $("#employeeForm").hide();
});
$(document).ready(function () {
    const empDashboardRow = $("#employeeTable");
    const searchInput = $(".emp-dash-main-searchplaceholder");
    let employeeData = [];

    function fetchData() {
        fetch("http://localhost:3000/employees") // Replace with your JSON Server URL
            .then(response => {
                if (!response.ok) {
                    return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
                }
                return response.json();
            })
            .then(data => {
                console.log("Data fetched:", data); // Check fetched data in the console
                employeeData = data;
                renderTable(employeeData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                alert("Error fetching employee data. Please try again later.");
            });
    }

    function renderTable(data) {
        empDashboardRow.empty(); // Clear existing table rows

        if (data.length === 0) {
            empDashboardRow.append("<tr><td colspan='7'>No employee data found.</td></tr>");
            return; // Exit early if no data
        }

        data.forEach(employee => {
            const row = $("<tr>");

            // Profile Image
            const profileImageCell = $("<td>");
            if (employee.profileImage) {
                const profileImage = $("<img>").attr("src", `../Assets/${employee.profileImage}`).addClass("profile-image"); // Adjust path if needed
                profileImageCell.append(profileImage);
            } else {
                profileImageCell.text("No image");
            }
            row.append(profileImageCell);

            row.append($("<td>").text(employee.name));
            row.append($("<td>").text(employee.gender));
            row.append($("<td>").text(employee.departments.join(", ")));
            row.append($("<td>").text(employee.salary));
            row.append($("<td>").text(`${employee.startDate.day}/${employee.startDate.month}/${employee.startDate.year}`));

            const actionsCell = $("<td>").html(`
                <button class="edit-btn" data-id="${employee.id}">Edit</button> 
                <button class="delete-btn" data-id="${employee.id}">Delete</button>
            `);
            row.append(actionsCell);
            empDashboardRow.append(row);
        });
    }

    fetchData(); // Fetch initial data when the page loads

    searchInput.on("input", function () {
        const query = searchInput.val().toLowerCase();
        const filteredData = employeeData.filter(employee =>
            employee.name.toLowerCase().includes(query) ||
            employee.gender.toLowerCase().includes(query) ||
            employee.departments.some(dept => dept.toLowerCase().includes(query)) ||
            employee.salary.toString().includes(query) ||
            `${employee.startDate.day}/${employee.startDate.month}/${employee.startDate.year}`.includes(query)
        );
        renderTable(filteredData);
    });

    $(document).on("click", ".edit-btn", function () {
        const employeeId = $(this).data("id");
        const employee = employeeData.find(emp => emp.id === employeeId);

        if (employee) {
            localStorage.setItem("editEmployeeData", JSON.stringify(employee));
            window.location.href = "EmployeePayrollRegister.html"; // Redirect to edit page
        } else {
            console.error("Employee not found for editing.");
        }
    });

    $(document).on("click", ".delete-btn", function () {
        const employeeId = $(this).data("id");

        if (confirm("Are you sure you want to delete this employee?")) {
            fetch(`http://localhost:3000/employees/${employeeId}`, {
                method: "DELETE"
            })
                .then(response => {
                    if (!response.ok) {
                        return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
                    }
                    return response.json(); // Or just check response.ok
                })
                .then(() => {
                    alert("Employee deleted successfully!");
                    fetchData(); // Refresh the table after delete
                })
                .catch(error => {
                    console.error("Error deleting employee:", error);
                    alert("Error deleting employee. Please try again later.");
                });
        }
    });
});

// $(document).ready(function () {
//     const empDashboardRow = $("#employeeTable"); // Correct selector for your table
//     const searchInput = $(".emp-dash-main-searchplaceholder"); // Correct selector for search input
//     let employeeData = [];

//     function fetchData() {
//         fetch("http://localhost:5000/employees") // Your JSON Server URL
//             .then(response => {
//                 if (!response.ok) {
//                     return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("Data fetched:", data); // Check data in console
//                 employeeData = data;
//                 renderTable(employeeData);
//             })
//             .catch(error => {
//                 console.error("Error fetching data:", error);
//                 alert("Error fetching employee data. Please try again later.");
//             });
//     }

//     function renderTable(data) {
//         empDashboardRow.empty(); // Clear existing table rows

//         if (data.length === 0) {
//             empDashboardRow.append("<tr><td colspan='7'>No employee data found.</td></tr>");
//             return; // Exit early if no data
//         }

//         data.forEach(employee => {
//             const row = $("<tr>");

//             // Profile Image (Adjust path if needed)
//             const profileImageCell = $("<td>");
//             if (employee.profileImage) {
//                 const profileImage = $("<img>").attr("src", `../Assets/${employee.profileImage}`).addClass("profile-image");
//                 profileImageCell.append(profileImage);
//             } else {
//                 profileImageCell.text("No image");
//             }
//             row.append(profileImageCell);

//             row.append($("<td>").text(employee.name));
//             row.append($("<td>").text(employee.gender));
//             row.append($("<td>").text(employee.departments.join(", ")));
//             row.append($("<td>").text(employee.salary));
//             row.append($("<td>").text(`${employee.startDate.day}/${employee.startDate.month}/${employee.startDate.year}`));

//             const actionsCell = $("<td>").html(`
//                 <button class="edit-btn" data-id="${employee.id}">Edit</button> 
//                 <button class="delete-btn" data-id="${employee.id}">Delete</button>
//             `);
//             row.append(actionsCell);
//             empDashboardRow.append(row);
//         });
//     }

//     fetchData(); // Fetch initial data when the page loads

//     searchInput.on("input", function () {
//         const query = searchInput.val().toLowerCase();
//         const filteredData = employeeData.filter(employee =>
//             employee.name.toLowerCase().includes(query) ||
//             employee.gender.toLowerCase().includes(query) ||
//             employee.departments.some(dept => dept.toLowerCase().includes(query)) ||
//             employee.salary.toString().includes(query) ||
//             `${employee.startDate.day}/${employee.startDate.month}/${employee.startDate.year}`.includes(query)
//         );
//         renderTable(filteredData);
//     });

//     $(document).on("click", ".edit-btn", function () {
//         const employeeId = $(this).data("id");
//         localStorage.setItem("editEmployeeId", employeeId); // Store ID for editing
//         window.location.href = "EmployeePayrollRegister.html"; // Redirect to the edit form
//     });

//     $(document).on("click", ".delete-btn", function () {
//         const employeeId = $(this).data("id");

//         if (confirm("Are you sure you want to delete this employee?")) {
//             fetch(`http://localhost:5000/employees/${employeeId}`, {
//                 method: "DELETE"
//             })
//                 .then(response => {
//                     if (!response.ok) {
//                         return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
//                     }
//                     return response.json(); // Or just check response.ok
//                 })
//                 .then(() => {
//                     alert("Employee deleted successfully!");
//                     fetchData(); // Refresh the table after delete
//                 })
//                 .catch(error => {
//                     console.error("Error deleting employee:", error);
//                     alert("Error deleting employee. Please try again later.");
//                 });
//         }
//     });
// });