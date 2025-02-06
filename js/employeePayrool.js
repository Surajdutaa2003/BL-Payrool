$(document).ready(function () {
    // Retrieve the employee ID from localStorage
    const employeeId = localStorage.getItem("employeeIdToEdit");

    // If an employee ID is present, fetch the employee data
    if (employeeId) {
        fetch(`http://localhost:3000/employees/${employeeId}`)
            .then(response => response.json())
            .then(employee => {
                // Pre-fill the form fields with employee data
                $("#name").val(employee.name);
                $(`input[name="gender"][value="${employee.gender}"]`).prop("checked", true);
                $("#salary").val(employee.salary);

                // Split the start date into day, month, and year
                const [startDay, startMonth, startYear] = employee.startDate.split("/");
                $("#startDay").val(startDay);
                $("#startMonth").val(startMonth);
                $("#startYear").val(startYear);

                // Set the profile image
                $(`input[name="profileImage"][value="${employee.profileImage}"]`).prop("checked", true);

                // Set the departments
                employee.departments.forEach(department => {
                    $(`input[name="department"][value="${department}"]`).prop("checked", true);
                });

                // Set the notes
                $("#notes").val(employee.notes);
            })
            .catch(error => console.error("Error fetching employee data:", error));
    }

    // Handle form submission
    $("#employee-form").on("submit", function (e) {
        e.preventDefault();

        // Get form values
        const name = $("#name").val();
        const gender = $("input[name='gender']:checked").val();
        const salary = $("#salary").val();
        const startDay = $("#startDay").val();
        const startMonth = $("#startMonth").val();
        const startYear = $("#startYear").val();
        const profileImage = $("input[name='profileImage']:checked").val();
        const departments = $("input[name='department']:checked").map(function () {
            return $(this).val();
        }).get();
        const notes = $("#notes").val();

        // Validate form
        if (!name || !gender || !salary || !startDay || !startMonth || !startYear || !profileImage || departments.length === 0) {
            alert("Please fill out all required fields.");
            return false;
        }

        // Validate date
        if (!isValidDate(startDay, startMonth, startYear)) {
            alert("Please enter a valid date.");
            return false;
        }

        // Create employee data object
        const employeeData = {
            name,
            gender,
            salary,
            startDate: `${startDay}/${startMonth}/${startYear}`,
            profileImage,
            departments,
            notes
        };

        // Show loading state
        $("#submit-btn").prop('disabled', true).text('Submitting...');

        // Determine if this is an edit or create operation
        const url = employeeId ? `http://localhost:3000/employees/${employeeId}` : "http://localhost:3000/employees";
        const method = employeeId ? "PUT" : "POST";

        // API call to backend
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employeeData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to save employee data");
            }
            return response.json();
        })
        .then(data => {
            console.log("Employee saved successfully:", data);
            window.location.href = "./employeeDetails.html"; // Replace with the actual path
            alert("Employee saved successfully!");
            localStorage.clear()

            // Redirect to the employee details page


        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
            $("#submit-btn").prop('disabled', false).text('Submit');
        });
    });

    // Date validation function
    function isValidDate(day, month, year) {
        const date = new Date(year, month - 1, day);
        return date.getDate() == day && 
               date.getMonth() == month - 1 && 
               date.getFullYear() == year;
    }

    // Reset button handler
    $("#reset-btn").click(function() {
        $("#employee-form")[0].reset();
    });
});