// Function to fetch and display employee data from the API
function loadEmployeeData() {
    fetch("http://localhost:3000/employees")
        .then(response => response.json())
        .then(employeeData => {
            const tableBody = document.getElementById('employeeTableBody');
            tableBody.innerHTML = ''; // Clear the table

            employeeData.forEach(employee => {
                let row = tableBody.insertRow();
                row.setAttribute("data-id", employee.id); // Store employee ID

                row.innerHTML = `
                    <td class="profile-image"><img src="${employee.profileImage}" alt="Profile Image"></td>
                    <td>${employee.name}</td>
                    <td>${employee.gender}</td>
                    <td class="department">${employee.departments.map(dep => `<span>${dep}</span>`).join('')}</td>
                    <td>₹ ${employee.salary}</td>
                    <td>${employee.startDate}</td>
                    <td class="actions">
                        <i class="fas fa-trash" onclick="deleteEmployee(this)" title="Delete Employee"></i>
                        <i class="fas fa-edit" onclick="editEmployee(this)" title="Edit Employee"></i>
                    </td>
                `;
            });
        })
        .catch(error => {
            console.error("Error fetching employee data:", error);
            alert("Error fetching employee data. Please try again later.");
        });
}

// Function to delete an employee (API call)
function deleteEmployee(element) {
    let row = element.parentNode.parentNode;
    let employeeId = row.getAttribute("data-id");

    fetch(`http://localhost:3000/employees/${employeeId}`, { method: "DELETE" })
        .then(response => {
            if (!response.ok) throw new Error("Failed to delete employee");
            row.remove(); // Remove row from table
            alert("Employee deleted successfully.");
        })
        .catch(error => {
            console.error("Error deleting employee:", error);
            alert("Error deleting employee. Please try again later.");
        });
}

// Function to edit an employee
function editEmployee(element) {
    let row = element.parentNode.parentNode;
    let employeeId = row.getAttribute("data-id");

    // Store employee ID in localStorage
    localStorage.setItem("employeeIdToEdit", employeeId);

    // Redirect to the form page
    window.location.href = "employeePayroll.html"; // Replace with actual form page
}

// Search employee functionality with cross button (❌)
function searchEmployee() {
    let input = document.getElementById("searchInput").value.toUpperCase();
    let table = document.getElementById("employeeTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        // Only search in name and department columns
        let name = tr[i].getElementsByTagName("td")[1].textContent.toUpperCase();
        let department = tr[i].getElementsByTagName("td")[3].textContent.toUpperCase();

        // If either name or department contains the search input, show the row
        tr[i].style.display = name.includes(input) || department.includes(input) ? "" : "none";
    }

    toggleClearButton();
}

// Function to clear search bar text
function clearSearch() {
    document.getElementById("searchInput").value = ""; // Clear text
    document.querySelector(".clear-btn").style.display = "none"; // Hide cross button
    searchEmployee(); // Reset employee list
}

// Function to show/hide cross button (❌)
function toggleClearButton() {
    const searchInput = document.getElementById("searchInput");
    const clearBtn = document.querySelector(".clear-btn");

    if (searchInput.value.length > 0) {
        clearBtn.style.display = "block"; // Show cross button
    } else {
        clearBtn.style.display = "none"; // Hide cross button
    }
}

function clearSearch() {
    document.getElementById("searchInput").value = ""; // Clear text
    document.querySelector(".clear-btn").style.display = "none"; // Hide cross button
    searchEmployee(); // Reset employee list
}

// Ensure cross button updates when typing
document.getElementById("searchInput").addEventListener("input", toggleClearButton);

// Load employee data on page load
loadEmployeeData();
