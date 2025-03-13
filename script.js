  
        // Mock data for demonstration
        let currentUser = null;
        let activities = [];
        let uploadedFiles = [];
        let editMode = false;
        let currentStep = 1;
        let beneficiaryCounter = 1;
        let documentCounter = 1;

        // DOM Elements
        const loginPage = document.getElementById('login-page');
        const dashboardPage = document.getElementById('dashboard-page');
        const activityFormPage = document.getElementById('activity-form-page');
        const activitiesListPage = document.getElementById('activities-list-page');

        // Form steps
const formStep1 = document.getElementById('form-step-1');
const formStep2 = document.getElementById('form-step-2');
const formStep3 = document.getElementById('form-step-3');

// Progress bar elements
const progressBarFill = document.getElementById('progress-bar-fill');
const progressStep1 = document.getElementById('step-1');
const progressStep2 = document.getElementById('step-2');
const progressStep3 = document.getElementById('step-3');
const progressLabel1 = document.getElementById('label-1');
const progressLabel2 = document.getElementById('label-2');
const progressLabel3 = document.getElementById('label-3');

// Upload elements
const uploadArea = document.getElementById('upload-area');
const fileUpload = document.getElementById('file-upload');
const previewContainer = document.getElementById('preview-container');

// Event Listeners
document.getElementById('google-login-btn').addEventListener('click', simulateGoogleLogin);
document.getElementById('logout-btn').addEventListener('click', logout);
document.getElementById('add-activity-btn').addEventListener('click', showActivityForm);
document.getElementById('edit-activities-btn').addEventListener('click', showActivitiesList);
document.getElementById('cancel-form-btn').addEventListener('click', showDashboard);

// Form navigation
document.getElementById('next-to-step-2').addEventListener('click', () => {
    // Save step 1 data
    saveFormData();
    goToStep(2);
});

document.getElementById('back-to-step-1').addEventListener('click', () => {
    goToStep(1);
});

document.getElementById('next-to-step-3').addEventListener('click', () => {
    // Save step 2 data
    saveFormData();
    goToStep(3);
});

document.getElementById('back-to-step-2').addEventListener('click', () => {
    goToStep(2);
});

// Date and location convenience buttons
document.getElementById('today-date-btn').addEventListener('click', setTodayDate);
document.getElementById('get-location-btn').addEventListener('click', getCurrentLocation);

// File upload
uploadArea.addEventListener('click', () => {
    fileUpload.click();
});

fileUpload.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('active');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('active');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
    handleFiles(e.dataTransfer.files);
});

// Functions
function simulateGoogleLogin() {
    // In a real app, this would be handled by Google OAuth
    currentUser = {
        id: 'user123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'JD'

    };

    // Update UI - only reference elements that exist
    const welcomeNameElements = document.querySelectorAll('#welcome-name');
    welcomeNameElements.forEach(el => {
        el.textContent = currentUser.name;
    });
    
    const userAvatarElements = document.querySelectorAll('.user-avatar');
    userAvatarElements.forEach(el => {
        el.textContent = currentUser.avatar;
    });

    // Save user to localStorage (in a real app)
    localStorage.setItem('ngo-current-user', JSON.stringify(currentUser));

    // Show dashboard
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');

    // Load activities
    loadActivities();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ngo-current-user');

    // Show login page
    dashboardPage.classList.add('hidden');
    activityFormPage.classList.add('hidden');
    activitiesListPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
}

function showDashboard() {
    activityFormPage.classList.add('hidden');
    activitiesListPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');

    // Reset form
    resetForm();
}

function showActivityForm() {
    editMode = false;
    document.getElementById('form-title').textContent = 'Add New Activity';
    resetForm();

    dashboardPage.classList.add('hidden');
    activitiesListPage.classList.add('hidden');
    activityFormPage.classList.remove('hidden');

    // Initialize first beneficiary form
    resetBeneficiaries();

    // Set to step 1
    goToStep(1);
}

function showActivitiesList() {
    dashboardPage.classList.add('hidden');
    activityFormPage.classList.add('hidden');
    activitiesListPage.classList.remove('hidden');

    renderEditableActivities();
}

function resetForm() {
    console.log("reset form");
    document.getElementById('activity-form').reset();
    document.getElementById('activity-id').value = '';
    document.getElementById('preview-container').innerHTML = '';
    // console.log(uploadedFiles);
    uploadedFiles = [];
    // console.log(uploadedFiles);
    resetBeneficiaries();
    currentStep = 1;
    updateProgressBar();
}

function goToStep(step) {
    // Hide all steps
    formStep1.classList.add('hidden');
    formStep2.classList.add('hidden');
    formStep3.classList.add('hidden');

    // Show the requested step
    if (step === 1) {
        formStep1.classList.remove('hidden');
    } else if (step === 2) {
        formStep2.classList.remove('hidden');
    } else if (step === 3) {
        formStep3.classList.remove('hidden');
    }

    currentStep = step;
    updateProgressBar();
}

function updateProgressBar() {
    console.log("update progress bar");
    // Update progress bar fill
    if (currentStep === 1) {
        progressBarFill.style.width = '0%';
    } else if (currentStep === 2) {
        progressBarFill.style.width = '50%';
    } else if (currentStep === 3) {
        progressBarFill.style.width = '100%';
    }

    // Update step indicators
    progressStep1.classList.remove('active', 'completed');
    progressStep2.classList.remove('active', 'completed');
    progressStep3.classList.remove('active', 'completed');

    progressLabel1.classList.remove('active');
    progressLabel2.classList.remove('active');
    progressLabel3.classList.remove('active');

    if (currentStep >= 1) {
        if (currentStep === 1) {
            progressStep1.classList.add('active');
            progressLabel1.classList.add('active');
        } else {
            progressStep1.classList.add('completed');
        }
    }

    if (currentStep >= 2) {
        if (currentStep === 2) {
            progressStep2.classList.add('active');
            progressLabel2.classList.add('active');
        } else {
            progressStep2.classList.add('completed');
        }
    }

    if (currentStep === 3) {
        progressStep3.classList.add('active');
        progressLabel3.classList.add('active');
    }
}

function setTodayDate() {
    console.log("set today date");
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    console.log("today date");

    // Format with leading zeros
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    document.getElementById('activity-date').value = `${year}-${month}-${day}`;
}

function getCurrentLocation() {
    console.log("get current location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // In a real app, you would use a reverse geocoding service
                // to convert coordinates to a human-readable address
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // For demo, just show coordinates
                document.getElementById('activity-location').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

                // Show success message
                showMessage('success', 'Location fetched successfully');
            },
            (error) => {
                console.error('Error getting location:', error);
                showMessage('error', 'Could not get your location. Please enter manually.');
            }
        );
    } else {
        showMessage('error', 'Geolocation is not supported by your browser');
    }
}

function saveFormData() {
    
    // This function saves form data between steps
    // In a real app, you might want to validate data before proceeding

    // For now, we'll just keep the data in the form fields
    // and collect everything on final submission
}

function handleFiles(files) {
    console.log("handle files");
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.match('image.*')) {
            showMessage('error', 'Only image files are supported');
            continue;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            const documentType = document.getElementById('document-type').value;

            // Create a unique ID for this file
            const fileId = Date.now() + '-' + i;

            // Store file data
            
            uploadedFiles.push({
                id: fileId,
                name: file.name,
                type: documentType,
                dataUrl: e.target.result,
                date: new Date().toISOString()
            });

            // Create preview element
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.dataset.id = fileId;

            // Create image container
            const previewImage = document.createElement('div');
            previewImage.className = 'preview-image';

            const img = document.createElement('img');
            img.src = e.target.result;
            previewImage.appendChild(img);

            // Create filename display
            const previewFilename = document.createElement('div');
            previewFilename.className = 'preview-filename';
            previewFilename.textContent = file.name;

            const removeBtn = document.createElement('div');
            removeBtn.className = 'preview-remove';
            removeBtn.innerHTML = '×';
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = this.parentNode.dataset.id;
                uploadedFiles = uploadedFiles.filter(file => file.id !== id);
                this.parentNode.remove();
            });

            previewItem.appendChild(previewImage);
            previewItem.appendChild(previewFilename);
            previewItem.appendChild(removeBtn);
            previewContainer.appendChild(previewItem);
        };

        reader.readAsDataURL(file);
    }
}

// Beneficiary functionality
document.getElementById('add-beneficiary-btn').addEventListener('click', function() {
    beneficiaryCounter++;
    addBeneficiaryForm(beneficiaryCounter);
});

function addBeneficiaryForm(id) {
    const container = document.createElement('div');
    container.className = 'beneficiary-container';
    container.dataset.id = id;

    container.innerHTML = `
        <div class="beneficiary-header">
            <div class="beneficiary-title">Beneficiary #${id}</div>
            <div class="beneficiary-remove" data-id="${id}">×</div>
        </div>

        <!-- Name split into first, middle, last -->
        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-first-name-${id}">First Name</label>
                    <input type="text" id="beneficiary-first-name-${id}" class="form-control beneficiary-first-name" required>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-middle-name-${id}">Middle Name</label>
                    <input type="text" id="beneficiary-middle-name-${id}" class="form-control beneficiary-middle-name">
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-last-name-${id}">Last Name</label>
                    <input type="text" id="beneficiary-last-name-${id}" class="form-control beneficiary-last-name" required>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-gender-${id}">Gender</label>
                    <select id="beneficiary-gender-${id}" class="form-control beneficiary-gender" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-caste-${id}">Caste</label>
                    <select id="beneficiary-caste-${id}" class="form-control beneficiary-caste" required>
                        <option value="">Select Caste</option>
                        <option value="general">General</option>
                        <option value="obc">OBC</option>
                        <option value="sc">SC</option>
                        <option value="st">ST</option>
                        <option value="ews">EWS</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-age-${id}">Age</label>
                    <input type="number" id="beneficiary-age-${id}" class="form-control beneficiary-age" min="0" required>
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-contact-${id}">Contact Number</label>
                    <input type="tel" id="beneficiary-contact-${id}" class="form-control beneficiary-contact" required>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-location-${id}">Location</label>
                    <input type="text" id="beneficiary-location-${id}" class="form-control beneficiary-location" required>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label for="beneficiary-reference-${id}">Reference Person Name</label>
            <input type="text" id="beneficiary-reference-${id}" class="form-control beneficiary-reference">
        </div>

        <div class="form-group">
            <label for="beneficiary-comment-${id}">Comments</label>
            <textarea id="beneficiary-comment-${id}" class="form-control beneficiary-comment single-line"></textarea>
        </div>

        <!-- Multiple document section -->
        <div class="form-group">
            <label>Identity Documents</label>
            <div id="beneficiary-documents-${id}" class="beneficiary-documents">
                <div class="document-row" data-doc-id="1">
                    <div class="document-row-header">
                        <div class="document-row-title">Document #1</div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <div class="form-group">
                                <label for="beneficiary-document-type-${id}-1">Document Type</label>
                                <select id="beneficiary-document-type-${id}-1" class="form-control beneficiary-document-type" required>
                                    <option value="aadhar">Aadhar</option>
                                    <option value="pan">PAN</option>
                                    <option value="dl">Driving License</option>
                                    <option value="election">Voter ID</option>
                                    <option value="passport">Passport</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-col">
                            <div class="form-group">
                                <label for="beneficiary-document-no-${id}-1">Document Number</label>
                                <input type="text" id="beneficiary-document-no-${id}-1" class="form-control beneficiary-document-no" required>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" class="add-document-btn" data-beneficiary-id="${id}">
                + Add Another Document
            </button>
        </div>
    `;

    document.getElementById('beneficiaries-container').appendChild(container);

    // Add event listener to remove button
    container.querySelector('.beneficiary-remove').addEventListener('click', function() {
        removeBeneficiary(this.dataset.id);
    });

    // Add event listener to add document button
    container.querySelector('.add-document-btn').addEventListener('click', function() {
        addDocumentRow(this.dataset.beneficiaryId);
    });
}

function addDocumentRow(beneficiaryId) {
    const documentsContainer = document.getElementById(`beneficiary-documents-${beneficiaryId}`);
    const documentCount = documentsContainer.querySelectorAll('.document-row').length + 1;

    const documentRow = document.createElement('div');
    documentRow.className = 'document-row';
    documentRow.dataset.docId = documentCount;

    documentRow.innerHTML = `
        <div class="document-row-header">
            <div class="document-row-title">Document #${documentCount}</div>
            <div class="document-row-remove" data-doc-id="${documentCount}">×</div>
        </div>
        <div class="form-row">
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-document-type-${beneficiaryId}-${documentCount}">Document Type</label>
                    <select id="beneficiary-document-type-${beneficiaryId}-${documentCount}" class="form-control beneficiary-document-type" required>
                        <option value="aadhar">Aadhar</option>
                        <option value="pan">PAN</option>
                        <option value="dl">Driving License</option>
                        <option value="election">Voter ID</option>
                        <option value="passport">Passport</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-col">
                <div class="form-group">
                    <label for="beneficiary-document-no-${beneficiaryId}-${documentCount}">Document Number</label>
                    <input type="text" id="beneficiary-document-no-${beneficiaryId}-${documentCount}" class="form-control beneficiary-document-no" required>
                </div>
            </div>
        </div>
    `;

    documentsContainer.appendChild(documentRow);

    // Add event listener to remove button
    documentRow.querySelector('.document-row-remove').addEventListener('click', function() {
        removeDocumentRow(beneficiaryId, this.dataset.docId);
    });
}

function removeDocumentRow(beneficiaryId, docId) {
    const documentsContainer = document.getElementById(`beneficiary-documents-${beneficiaryId}`);
    const documentRow = documentsContainer.querySelector(`.document-row[data-doc-id="${docId}"]`);

    if (documentsContainer.querySelectorAll('.document-row').length <= 1) {
        showMessage('error', 'At least one document is required');
        return;
    }

    if (documentRow) {
        documentRow.remove();

        // Renumber remaining documents
        const remainingRows = documentsContainer.querySelectorAll('.document-row');
        remainingRows.forEach((row, index) => {
            const newIndex = index + 1;
            row.dataset.docId = newIndex;
            row.querySelector('.document-row-title').textContent = `Document #${newIndex}`;
            row.querySelector('.document-row-remove').dataset.docId = newIndex;

            // Update IDs of form elements
            const typeSelect = row.querySelector('.beneficiary-document-type');
            const numberInput = row.querySelector('.beneficiary-document-no');

            typeSelect.id = `beneficiary-document-type-${beneficiaryId}-${newIndex}`;
            numberInput.id = `beneficiary-document-no-${beneficiaryId}-${newIndex}`;
        });
    }
}

function removeBeneficiary(id) {
    const beneficiaryContainers = document.querySelectorAll('.beneficiary-container');

    if (beneficiaryContainers.length <= 1) {
        showMessage('error', 'At least one beneficiary is required');
        return;
    }

    const container = document.querySelector(`.beneficiary-container[data-id="${id}"]`);
    if (container) {
        container.remove();

        // Renumber remaining beneficiaries
        const remainingContainers = document.querySelectorAll('.beneficiary-container');
        remainingContainers.forEach((container, index) => {
            container.querySelector('.beneficiary-title').textContent = `Beneficiary #${index + 1}`;
        });
    }
}

function resetBeneficiaries() {
    console.log("reset beneficiaries");
    beneficiaryCounter = 1;
    const container = document.getElementById('beneficiaries-container');
    container.innerHTML = '';
    addBeneficiaryForm(1);
}

// Form submission
document.getElementById('activity-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Collect activity data
    const activityId = document.getElementById('activity-id').value || Date.now().toString();
    const activityName = document.getElementById('activity-name').value;
    const activityLocation = document.getElementById('activity-location').value;
    const activityDate = document.getElementById('activity-date').value;
    const activityDescription = document.getElementById('activity-description').value;

    // Collect beneficiary data
    const beneficiaries = [];
    const beneficiaryContainers = document.querySelectorAll('.beneficiary-container');

    beneficiaryContainers.forEach((container) => {
        const id = container.dataset.id;

        // Collect documents for this beneficiary
        const documents = [];
        const documentRows = container.querySelectorAll('.document-row');

        documentRows.forEach((row) => {
            const docId = row.dataset.docId;
            documents.push({
                id: docId,
                type: document.getElementById(`beneficiary-document-type-${id}-${docId}`).value,
                number: document.getElementById(`beneficiary-document-no-${id}-${docId}`).value
            });
        });

        beneficiaries.push({
            id: id,
            firstName: document.getElementById(`beneficiary-first-name-${id}`).value,
            middleName: document.getElementById(`beneficiary-middle-name-${id}`).value,
            lastName: document.getElementById(`beneficiary-last-name-${id}`).value,
            gender: document.getElementById(`beneficiary-gender-${id}`).value,
            caste: document.getElementById(`beneficiary-caste-${id}`).value,
            age: document.getElementById(`beneficiary-age-${id}`).value,
            contact: document.getElementById(`beneficiary-contact-${id}`).value,
            location: document.getElementById(`beneficiary-location-${id}`).value,
            reference: document.getElementById(`beneficiary-reference-${id}`).value,
            comment: document.getElementById(`beneficiary-comment-${id}`).value,
            documents: documents
        });
    });

    // Create activity object
    const activity = {
        id: activityId,
        name: activityName,
        location: activityLocation,
        date: activityDate,
        contactPersonName: contactPersonName,
    contactPersonNumber: contactPersonNumber,
        description: activityDescription,
        files: [...uploadedFiles],
        beneficiaries: beneficiaries,
        createdBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Save activity
    saveActivity(activity);

    // Reset form
    document.getElementById('activity-form').reset();
    document.getElementById('preview-container').innerHTML = '';
    uploadedFiles = [];
    resetBeneficiaries();

    // Show success message
    showMessage('success', 'Activity saved successfully!');

    // In a real app, we would save to Google Sheets/Drive here
    console.log('Activity saved:', activity);
    console.log('Would save to Google Sheets/Drive in a real app');

    // Redirect to dashboard after a delay
    setTimeout(() => {
        activityFormPage.classList.add('hidden');
        dashboardPage.classList.remove('hidden');
        loadActivities(); // Refresh activities list
    }, 2000);
});

function saveActivity(activity) {
    console.log("save activity");
    const existingIndex = activities.findIndex(a => a.id === activity.id);

    if (existingIndex >= 0) {
        // Update existing activity
        activities[existingIndex] = activity;
    } else {
        // Add new activity
        activities.push(activity);
    }

    // In a real app, we would save to localStorage or a backend
    localStorage.setItem('ngo-activities', JSON.stringify(activities));
}

function loadActivities() {
    console.log("load activities");
    // In a real app, we would load from localStorage or a backend
    const storedActivities = localStorage.getItem('ngo-activities');

    if (storedActivities) {
        activities = JSON.parse(storedActivities);
    } else {
        activities = [];
    }

    renderActivities();
}

function renderActivities() {
    console.log("render activities");
    const activityList = document.getElementById('activity-list');

    if (activities.length === 0) {
        activityList.innerHTML = `
            <li class="activity-item">
                <div class="activity-info">
                    <h3>No activities found</h3>
                    <p>Add a new activity to get started</p>
                </div>
            </li>
        `;
        return;
    }

    // Sort activities by date (newest first)
    const sortedActivities = [...activities].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    // Display only the 5 most recent activities
    const recentActivities = sortedActivities.slice(0, 5);

    activityList.innerHTML = recentActivities.map(activity => `
        <li class="activity-item">
            <div class="activity-info">
                <h3>${activity.name}</h3>
                <p>${formatDate(activity.date)} | ${activity.location}</p>
                <p>${activity.beneficiaries.length} beneficiaries</p>
            </div>
            <div class="activity-actions">
                <button class="btn btn-primary view-activity" data-id="${activity.id}">View</button>
            </div>
        </li>
    `).join('');

    // Add event listeners to view buttons
    document.querySelectorAll('.view-activity').forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.dataset.id;
            editActivity(activityId);
        });
    });
}

function renderEditableActivities() {
    console.log("render editable activities");
    const activityList = document.getElementById('editable-activity-list');

    if (activities.length === 0) {
        activityList.innerHTML = `
            <li class="activity-item">
                <div class="activity-info">
                    <h3>No activities found</h3>
                    <p>Add a new activity to get started</p>
                </div>
            </li>
        `;
        return;
    }

    // Sort activities by date (newest first)
    const sortedActivities = [...activities].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    activityList.innerHTML = sortedActivities.map(activity => `
        <li class="activity-item">
            <div class="activity-info">
                <h3>${activity.name}</h3>
                <p>${formatDate(activity.date)} | ${activity.location}</p>
                <p>${activity.beneficiaries.length} beneficiaries</p>
            </div>
            <div class="activity-actions">
                <button class="btn btn-primary edit-activity" data-id="${activity.id}">Edit</button>
                <button class="btn btn-danger delete-activity" data-id="${activity.id}">Delete</button>
            </div>
        </li>
    `).join('');

    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-activity').forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.dataset.id;
            editActivity(activityId);
        });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-activity').forEach(button => {
        button.addEventListener('click', function() {
            const activityId = this.dataset.id;
            deleteActivity(activityId);
        });
    });
}

function editActivity(activityId) {
    const activity = activities.find(a => a.id === activityId);

    if (!activity) {
        showMessage('error', 'Activity not found');
        return;
    }

    editMode = true;
    document.getElementById('form-title').textContent = 'Edit Activity';

    // Fill form with activity data
    document.getElementById('activity-id').value = activity.id;
    document.getElementById('activity-name').value = activity.name;
    document.getElementById('activity-location').value = activity.location;
    document.getElementById('activity-date').value = activity.date;
    document.getElementById('activity-description').value = activity.description;

    // Reset beneficiaries and add from activity
    resetBeneficiaries();

    if (activity.beneficiaries.length > 0) {
        // Fill first beneficiary form
        const firstBeneficiary = activity.beneficiaries[0];
        document.getElementById('beneficiary-first-name-1').value = firstBeneficiary.firstName || '';
        document.getElementById('beneficiary-middle-name-1').value = firstBeneficiary.middleName || '';
        document.getElementById('beneficiary-last-name-1').value = firstBeneficiary.lastName || '';
        document.getElementById('beneficiary-gender-1').value = firstBeneficiary.gender || '';
        document.getElementById('beneficiary-caste-1').value = firstBeneficiary.caste || '';
        document.getElementById('beneficiary-age-1').value = firstBeneficiary.age || '';
        document.getElementById('beneficiary-contact-1').value = firstBeneficiary.contact || '';
    document.getElementById('beneficiary-location-1').value = firstBeneficiary.location || '';
    document.getElementById('beneficiary-reference-1').value = firstBeneficiary.reference || '';
    document.getElementById('beneficiary-comment-1').value = firstBeneficiary.comment || '';
    
    // Fill first document
    if (firstBeneficiary.documents && firstBeneficiary.documents.length > 0) {
        const firstDocument = firstBeneficiary.documents[0];
        document.getElementById('beneficiary-document-type-1-1').value = firstDocument.type || 'aadhar';
        document.getElementById('beneficiary-document-no-1-1').value = firstDocument.number || '';
        
        // Add additional documents
        for (let i = 1; i < firstBeneficiary.documents.length; i++) {
            addDocumentRow(1);
            const document = firstBeneficiary.documents[i];
            const docId = i + 1;
            document.getElementById(`beneficiary-document-type-1-${docId}`).value = document.type || 'aadhar';
            document.getElementById(`beneficiary-document-no-1-${docId}`).value = document.number || '';
        }
    }
    
    // Add additional beneficiaries
    for (let i = 1; i < activity.beneficiaries.length; i++) {
        beneficiaryCounter++;
        addBeneficiaryForm(beneficiaryCounter);
        
        const beneficiary = activity.beneficiaries[i];
        document.getElementById(`beneficiary-first-name-${beneficiaryCounter}`).value = beneficiary.firstName || '';
        document.getElementById(`beneficiary-middle-name-${beneficiaryCounter}`).value = beneficiary.middleName || '';
        document.getElementById(`beneficiary-last-name-${beneficiaryCounter}`).value = beneficiary.lastName || '';
        document.getElementById(`beneficiary-gender-${beneficiaryCounter}`).value = beneficiary.gender || '';
        document.getElementById(`beneficiary-caste-${beneficiaryCounter}`).value = beneficiary.caste || '';
        document.getElementById(`beneficiary-age-${beneficiaryCounter}`).value = beneficiary.age || '';
        document.getElementById(`beneficiary-contact-${beneficiaryCounter}`).value = beneficiary.contact || '';
        document.getElementById(`beneficiary-location-${beneficiaryCounter}`).value = beneficiary.location || '';
        document.getElementById(`beneficiary-reference-${beneficiaryCounter}`).value = beneficiary.reference || '';
        document.getElementById(`beneficiary-comment-${beneficiaryCounter}`).value = beneficiary.comment || '';
        
        // Fill documents for this beneficiary
        if (beneficiary.documents && beneficiary.documents.length > 0) {
            const firstDocument = beneficiary.documents[0];
            document.getElementById(`beneficiary-document-type-${beneficiaryCounter}-1`).value = firstDocument.type || 'aadhar';
            document.getElementById(`beneficiary-document-no-${beneficiaryCounter}-1`).value = firstDocument.number || '';
            
            // Add additional documents
            for (let j = 1; j < beneficiary.documents.length; j++) {
                addDocumentRow(beneficiaryCounter);
                const document = beneficiary.documents[j];
                const docId = j + 1;
                document.getElementById(`beneficiary-document-type-${beneficiaryCounter}-${docId}`).value = document.type || 'aadhar';
                document.getElementById(`beneficiary-document-no-${beneficiaryCounter}-${docId}`).value = document.number || '';
            }
        }
    }
}

// Reset and add file previews
document.getElementById('preview-container').innerHTML = '';
uploadedFiles = [...activity.files];

uploadedFiles.forEach(file => {
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    previewItem.dataset.id = file.id;
    
    // Create image container
    const previewImage = document.createElement('div');
    previewImage.className = 'preview-image';
    
    const img = document.createElement('img');
    img.src = file.dataUrl;
    previewImage.appendChild(img);
    
    // Create filename display
    const previewFilename = document.createElement('div');
    previewFilename.className = 'preview-filename';
    previewFilename.textContent = file.name;
    
    const removeBtn = document.createElement('div');
    removeBtn.className = 'preview-remove';
    removeBtn.innerHTML = '×';
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const id = this.parentNode.dataset.id;
        uploadedFiles = uploadedFiles.filter(file => file.id !== id);
        this.parentNode.remove();
    });
    
    previewItem.appendChild(previewImage);
    previewItem.appendChild(previewFilename);
    previewItem.appendChild(removeBtn);
    previewContainer.appendChild(previewItem);
});

// Show form
activitiesListPage.classList.add('hidden');
activityFormPage.classList.remove('hidden');

// Set to step 1
goToStep(1);
}

function deleteActivity(activityId) {
    if (confirm('Are you sure you want to delete this activity?')) {
        activities = activities.filter(a => a.id !== activityId);
        localStorage.setItem('ngo-activities', JSON.stringify(activities));
        
        showMessage('success', 'Activity deleted successfully', 'list-message');
        renderEditableActivities();
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function showMessage(type, text, targetId = 'form-message') {
    const messageContainer = document.getElementById(targetId);
    
    if (type === 'success') {
        messageContainer.innerHTML = `
            <div class="success-message">
                <span class="success-icon">✓</span>
                ${text}
            </div>
        `;
    } else if (type === 'error') {
        messageContainer.innerHTML = `
            <div class="error-message">
                <span class="error-icon">✗</span>
                ${text}
            </div>
        `;
    }
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 5000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in (in a real app)
    const savedUser = localStorage.getItem('ngo-current-user');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        simulateGoogleLogin();
    }
    
    // In a real app, we would initialize Google API here
    console.log('In a real app, we would initialize Google API for authentication and Google Sheets/Drive integration');
});

// Google API integration (conceptual)
function initGoogleAPI() {
    // This is a conceptual implementation
    // In a real app, you would load the Google API client and initialize it
    
    /*
    gapi.load('client:auth2', () => {
        gapi.client.init({
            apiKey: 'YOUR_API_KEY',
            clientId: 'YOUR_CLIENT_ID',
            discoveryDocs: [
                'https://sheets.googleapis.com/$discovery/rest?version=v4',
                'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
            ],
            scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive'
        }).then(() => {
            // Listen for sign-in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            
            // Handle the initial sign-in state
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            
            // Attach click handlers to Google sign-in button
            document.getElementById('google-login-btn').addEventListener('click', handleAuthClick);
        });
    });
    */
}

function saveToGoogleSheets(data) {
    // This is a conceptual implementation
    // In a real app, you would use the Google Sheets API to save data
    
    /*
    return gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [
                [
                    data.id,
                    data.name,
                    data.location,
                    data.date,
                    data.description,
                    JSON.stringify(data.beneficiaries),
                    new Date().toISOString()
                ]
            ]
        }
    });
    */
}

function uploadToGoogleDrive(file, metadata) {
    // This is a conceptual implementation
    // In a real app, you would use the Google Drive API to upload files
    
    /*
    const blob = dataURItoBlob(file.dataUrl);
    const fileMetadata = {
        name: file.name,
        mimeType: blob.type,
        parents: ['YOUR_FOLDER_ID'] // Optional: specify a folder
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
    form.append('file', blob);
    
    return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
        body: form
    }).then(response => response.json());
    */
}

function dataURItoBlob(dataURI) {
    // Convert a data URI to a Blob
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
}


// Fix missing elements and event listeners

document.addEventListener('DOMContentLoaded', function() {
    // Fix for missing back-to-dashboard buttons
    const backToDashboardBtns = document.querySelectorAll('.btn-secondary');
    backToDashboardBtns.forEach(btn => {
        if (btn.textContent.includes('Back') || btn.textContent.includes('Cancel')) {
            btn.addEventListener('click', showDashboard);
        }
    });

    // Fix for add-activity-btn
    const addActivityBtn = document.getElementById('add-activity-btn');
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', showActivityForm);
    }

    // Fix for edit-activities-btn
    const editActivitiesBtn = document.getElementById('edit-activities-btn');
    if (editActivitiesBtn) {
        editActivitiesBtn.addEventListener('click', showActivitiesList);
    }

    // Fix for logout buttons
    const logoutBtns = document.querySelectorAll('#logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', logout);
    });
});

// Fix 1: Make login page visible at startup
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('ngo-current-user');
    
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        simulateGoogleLogin();
    } else {
        // Show login page by default
        loginPage.classList.remove('hidden');
        dashboardPage.classList.add('hidden');
        activityFormPage.classList.add('hidden');
        activitiesListPage.classList.add('hidden');
    }
    
    // Fix 2: Add event listener for edit username button
    const editUsernameBtn = document.getElementById('edit-username-btn');
    if (editUsernameBtn) {
        editUsernameBtn.addEventListener('click', function() {
            const newName = prompt('Enter your name:', currentUser.name);
            if (newName && newName.trim() !== '') {
                currentUser.name = newName.trim();
                
                // Update UI
                const welcomeNameElements = document.querySelectorAll('#welcome-name');
                welcomeNameElements.forEach(el => {
                    el.textContent = currentUser.name;
                });
                
                // Update avatar
                const nameParts = newName.trim().split(' ');
                let initials = '';
                if (nameParts.length >= 2) {
                    initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
                } else {
                    initials = nameParts[0].charAt(0);
                }
                currentUser.avatar = initials.toUpperCase();
                
                const userAvatarElements = document.querySelectorAll('.user-avatar');
                userAvatarElements.forEach(el => {
                    el.textContent = currentUser.avatar;
                });
                
                // Save to localStorage
                localStorage.setItem('ngo-current-user', JSON.stringify(currentUser));
                
                showMessage('success', 'Name updated successfully');
            }
        });
    }
    
    // Fix 3: Correct back button behavior in form steps
    const backToStep1Btn = document.getElementById('back-to-step-1');
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', function(e) {
            e.preventDefault();
            goToStep(1);
        });
    }
    
    const backToStep2Btn = document.getElementById('back-to-step-2');
    if (backToStep2Btn) {
        backToStep2Btn.addEventListener('click', function(e) {
            e.preventDefault();
            goToStep(2);
        });
    }
    
    // Fix 4: Ensure form submission works correctly
    const activityForm = document.getElementById('activity-form');
    if (activityForm) {
        activityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const activityName = document.getElementById('activity-name').value;
            if (!activityName || activityName.trim() === '') {
                showMessage('error', 'Activity name is required');
                goToStep(1);
                return;
            }
            
            // Collect activity data
            const activityId = document.getElementById('activity-id').value || Date.now().toString();
            const activityLocation = document.getElementById('activity-location').value;
            const activityDate = document.getElementById('activity-date').value;
            const contactPersonName = document.getElementById('contact-person-name').value;
            const contactPersonNumber = document.getElementById('contact-person-number').value;
            const activityDescription = document.getElementById('activity-description').value;
            
            // Collect beneficiary data
            const beneficiaries = [];
            const beneficiaryContainers = document.querySelectorAll('.beneficiary-container');
            
            beneficiaryContainers.forEach((container) => {
                const id = container.dataset.id;
                
                // Collect documents for this beneficiary
                const documents = [];
                const documentRows = container.querySelectorAll('.document-row');
                
                documentRows.forEach((row) => {
                    const docId = row.dataset.docId;
                    documents.push({
                        id: docId,
                        type: document.getElementById(`beneficiary-document-type-${id}-${docId}`).value,
                        number: document.getElementById(`beneficiary-document-no-${id}-${docId}`).value
                    });
                });
                
                beneficiaries.push({
                    id: id,
                    firstName: document.getElementById(`beneficiary-first-name-${id}`).value,
                    middleName: document.getElementById(`beneficiary-middle-name-${id}`).value,
                    lastName: document.getElementById(`beneficiary-last-name-${id}`).value,
                    gender: document.getElementById(`beneficiary-gender-${id}`).value,
                    caste: document.getElementById(`beneficiary-caste-${id}`).value,
                    age: document.getElementById(`beneficiary-age-${id}`).value,
                    contact: document.getElementById(`beneficiary-contact-${id}`).value,
                    location: document.getElementById(`beneficiary-location-${id}`).value,
                    reference: document.getElementById(`beneficiary-reference-${id}`).value,
                    comment: document.getElementById(`beneficiary-comment-${id}`).value,
                    documents: documents
                });
            });
            
            // Create activity object
            const activity = {
                id: activityId,
                name: activityName,
                location: activityLocation,
                date: activityDate,
                contactPersonName: contactPersonName,
                contactPersonNumber: contactPersonNumber,
                description: activityDescription,
                files: [...uploadedFiles],
                beneficiaries: beneficiaries,
                createdBy: currentUser.id,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Save activity
            saveActivity(activity);
            
            // Show success message
            showMessage('success', 'Activity saved successfully!');
            
            // Redirect to dashboard after a delay
            setTimeout(() => {
                resetForm();
                activityFormPage.classList.add('hidden');
                dashboardPage.classList.remove('hidden');
                loadActivities(); // Refresh activities list
            }, 2000);
        });
    }
    
    // Fix for cancel button
    const cancelFormBtn = document.getElementById('cancel-form-btn');
    if (cancelFormBtn) {
        cancelFormBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                resetForm();
                showDashboard();
            }
        });
    }
});