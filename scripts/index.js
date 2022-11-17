/********************************************
 ** DECLARE ALL GLOBAL VARIABLES **
*********************************************/

// Array of employees' data
let employees = [{
		"emp_no": "10001",
		"first_name": "Georgi",
		"last_name": "Facello",
		"birth_date": "1953-09-02",
		"gender": "M",
		"hire_date": "1986-06-26",
		"title": "Senior Engineer",
		"salary": 88958
	},
	{
		"emp_no": "10002",
		"first_name": "Bezalel",
		"last_name": "Simmel",
		"birth_date": "1964-06-02",
		"gender": "F",
		"hire_date": "1985-11-21",
		"title": "Staff",
		"salary": 72527
	},
	{
		"emp_no": "10003",
		"first_name": "Parto",
		"last_name": "Bamford",
		"birth_date": "1959-12-03",
		"gender": "M",
		"hire_date": "1986-08-28",
		"title": "Senior Engineer",
		"salary": 43311
	},
	{
		"emp_no": "10004",
		"first_name": "Sally",
		"last_name": "Wise",
		"birth_date": "1979-02-13",
		"gender": "F",
		"hire_date": "2006-08-28",
		"title": "Engineer",
		"salary": 87364
	}
];

// Declare variables to store data for buttons and form modal
let employeeDetails = {}
let empNo = ''
let action = ''

/********************************************
 ** DECLARE ALL GLOBAL FUNCTIONS **
*********************************************/

// Function to convert Employee Data to HTML Table Row
const prepareRowData = function (obj) {

	// Table Actions Button
	const viewActionButton = `<button type="button" class="btn btn-outline-primary btn-sm mx-1" data-bs-toggle="modal" data-bs-target="#formModal" data-bs-action="View" data-bs-emp-no="${obj.emp_no}"><i class="bi bi-eye"></i></button>`
	const editActionButton = `<button type="button" class="btn btn-outline-warning btn-sm mx-1" data-bs-toggle="modal" data-bs-target="#formModal" data-bs-action="Edit" data-bs-emp-no="${obj.emp_no}"><i class="bi bi-pencil"></i></button>`
	const deleteActionButton = `<button type="button" class="btn btn-outline-danger btn-sm mx-1" data-bs-toggle="modal" data-bs-target="#formModal" data-bs-action="Delete" data-bs-emp-no="${obj.emp_no}"><i class="bi bi-trash"></i></button>`

	// Construct the table row HTML element for employee
	const tableRowData = 
		`<tr id="tr_${obj.emp_no}">
			<td>${obj.emp_no}</td>
			<td>${obj.first_name}</td>
			<td>${obj.last_name}</td>
			<td>${obj.birth_date}</td>
			<td>${obj.gender}</td>
			<td>${obj.hire_date}</td>
			<td>${obj.title}</td>
			<td>${viewActionButton}${editActionButton}${deleteActionButton}</td>
		</tr>`
	
	// Return the formatted HTML table row data
	return tableRowData
}

// Function to populate table body with employees information
const populateTable = function () {

	// Clear the table body before populating data
	$('tbody').empty();

	// Convert Employees array to HTML row
	employees.forEach(e => {
		const tableRowData = prepareRowData(e)

		// Append the row data to table body
		$('tbody').append(tableRowData);
	});

}

/********************************************
 ** LISTERNER AND ACTIONS AFTER DOM LOADED **
*********************************************/

$(window).on('load', function () {

	// Populate table with Employee data when the page is loaded
	populateTable();

	// When the form modal is triggered to show, perform this function
	$('#formModal').on('show.bs.modal', event => {

		// Determine which table action button triggered the modal
		const button = event.relatedTarget

		// Extract info from data-bs-* attributes
		// Assign the value to the variable so that it can be shared with other eventlisteners
		empNo = button.getAttribute('data-bs-emp-no')
		action = button.getAttribute('data-bs-action')

		// Update the form Modal Label to specific action
		$('#formModalLabel').text(`${action} Employee Details`)
		
		// Populate form fields value based on employee data
		// empNo for Add Button is undefined, so will not be populated
		if (empNo) {
			employeeDetails = employees.find(e => e.emp_no == empNo);

			$('#firstName').val(employeeDetails['first_name'])
			$('#lastName').val(employeeDetails['last_name'])
			$('#dateOfBirth').val(employeeDetails['birth_date'])
			$('#hireDate').val(employeeDetails['hire_date'])
			if (employeeDetails['gender'] == 'F')
				$('#radioFemale').prop("checked", true);
			if (employeeDetails['gender'] == 'M')
				$('#radioMale').prop("checked", true);
			$('#titleSelect').val(employeeDetails['title']).change();
			$('#salary').val(employeeDetails['salary'])
		}

		// Toggle enable / disable of the form inputs based on action type
		// For view and delete action, users will not be able to make changes to input values
		if (action == 'View' || action == 'Delete') {
			$('#formModal input, #formModal select')
				.prop('disabled', true);
		} else {
			$('#formModal input, #formModal select')
				.prop('disabled', false);
		}

		// Toggle button set of the form modal based on action type
		// Remove the hidden attribute, so that the button will show up
		if (action == 'View') {
			$('#closeButton')
				.removeAttr('hidden');
		} else if (action == 'Add') {
			$('#closeButton, #addButton')
				.removeAttr('hidden');
		} else if (action == 'Edit') {
			$('#closeButton, #editButton')
				.removeAttr('hidden');
		} else {
			$('#closeButton, #deleteButton')
				.removeAttr('hidden');
		}
	})

	// Listen to CLICK event from Delete Button
	$('#deleteButton').on('click', function() {

		const idx = employees.findIndex(e => e.emp_no == empNo)
		employees.splice(idx, 1)

		// Repopulate the table based on latest employees array
		populateTable();
	})

	// Listen to CLICK event from Edit Button
	$('#editButton').on('click', function() {

		// Get form values
		const formData = {
			"emp_no": `${empNo}`,
			"first_name": $('#firstName').val(),
			"last_name": $('#lastName').val(),
			"birth_date": $('#dateOfBirth').val(),
			"gender": $('#radioFemale').prop("checked") == true ? "F" : "M" ,
			"hire_date": $('#hireDate').val(),
			"title": $('#titleSelect').val(),
			"salary": $('#salary').val()
		}
		// Change the employee data
		const idx = employees.findIndex(e => e.emp_no == empNo)
		employees.splice(idx, 1, formData)

		// Repopulate the table based on latest employees array
		populateTable();
	})

	// Listen to CLICK event from Add Button
	$('#addButton').on('click', function() {

		// Determine the maximum emp_no from current employees array
		const maxIdx = Math.max(...employees.map((p) => p.emp_no), 0);

		// Get form values
		const formData = {
			"emp_no": `${maxIdx+1}`,
			"first_name": $('#firstName').val(),
			"last_name": $('#lastName').val(),
			"birth_date": $('#dateOfBirth').val(),
			"gender": $('#radioFemale').prop("checked") == true ? "F" : "M" ,
			"hire_date": $('#hireDate').val(),
			"title": $('#titleSelect').val(),
			"salary": $('#salary').val()
		}
		employees.push(formData)
		
		// Repopulate the table based on latest employees array
		populateTable();
	})


	// After the modal is closed / hidden, perform these actions to reset the modal
	$('#formModal').on('hidden.bs.modal', function () {
		$('#formModalLabel')
			.text('')

		$('#formModal input')
			.val('')
			.prop('checked', false)

		$('#formModal select')
			.val('').change()

		$('#closeButton, #addButton, #editButton, #deleteButton')
			.prop("hidden", true)

		employeeDetails = {}
		empNo = ''
		action = ''
	});
});