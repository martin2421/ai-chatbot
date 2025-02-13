import { insertData, searchData } from "./services/dynamoService";

export default function StateMachine() {
    console.log("loading");
    document.addEventListener("readystatechange", function (event) {
        if (document.readyState === 'complete') {
            console.log("Loaded");

            document.getElementById("chef").addEventListener("click", () => {
                const helpText = document.querySelector(".help-text");
                helpText.style.animation = "moveTextUp 3s linear infinite"; // Restart infinite animation if clicked
            });

            const chatCircle = document.getElementById("chat-circle");
            const chatBox = document.querySelector(".chat-box");
            const chatBoxToggle = document.querySelector(".chat-box-toggle");


            // Clear chat history
            const clearHistoryButton = document.getElementById("clearHistoryButton");
            clearHistoryButton.addEventListener("click", () => {
                localStorage.removeItem("chatHistory");
                localStorage.removeItem("currentState");
                messagesContainer.innerHTML = "";
                statemachine.currentState = "start";
                statemachine.render();
            });


            // Show/Hide chat box
            chatCircle.addEventListener("click", () => {

                chatCircle.classList.add("hidden");
                chatBox.classList.add("show");

            });

            chatBoxToggle.addEventListener("click", () => {
                chatBox.classList.remove("show");
                chatCircle.classList.remove("hidden");
            });


            // Handle form submission
            const chatForm = document.getElementById("chat-form");
            const chatInput = document.getElementById("chat-input");
            const chatLogs = document.querySelector(".chat-logs");
            const messagesContainer = document.getElementById("messages");

            var statemachine = {
                currentState: "", // Initialize the current state
                selectedService: "", // Initialize the selected service
                states: {}, // Initialize the states object
                interact: function () { }, // Initialize the interact function
                render: function (isLoadingHistory = false) { } // Initialize the render function
            }

            // Define the states and their transitions
            statemachine.states = {
                "start": {
                    "message": "Welcome to the Stir Food Chatbot! is it your first time here?",
                    "options": [
                        {
                            "title": "Yes it is my first time",
                            "next": "services"
                        },
                        {
                            "title": "No, I've been here before",
                            "next": "Previous Conversation"
                        },
                    ]
                },

                "Previous Conversation": {
                    "message": "Welcome back! How can we assist you today?",
                    "options": [
                        {
                            "title": "Submit",
                            "type": "form", // Indicate that this option is a form
                            "fields": [ // Define the fields for the form
                                { name: "email", placeholder: "Email" },
                            ],
                            "callback": async function (data) { // Define the callback function for form submission
                                let email = data.email
                                let result = await searchData({ email });

                                if (result) {
                                    statemachine.currentState = "Unregistered"; // ex. state - Replace with different state after data base check
                                    statemachine.render(); // Render the new state
                                }
                                else {
                                    statemachine.currentState = "Registered"; // ex. state - Replace with different state after data base check
                                    statemachine.render(); // Render the new state

                                }
                            }
                        },

                        {
                            "title": "Back",
                            "back": "start"
                        }
                    ],
                },


                "Registered": {
                    /*Callback function to get the conversation back to where it was*/
                    "message": "We have a few questions to establish your business state",
                    "options": [
                        {
                            "title": "Established",
                            "next": "established"
                        },
                        {
                            "title": "Scaling up",
                            "next": "Scaling up"
                        },
                        {
                            "title": "Idea Phase",
                            "next": "Idea Phase"
                        }
                    ],
                },

                "Unregistered": {
                    "message": "The email or phone number you provided is not in our system. Please try again or start a new conversation",
                    "options": [
                        {
                            "title": "Try Again",
                            "next": "Previous Conversation"
                        },
                        {
                            "title": "Start New Conversation",
                            "next": "services"
                        }
                    ],
                },

                "services": {
                    "message": "What type of service are you looking for?",
                    "options": [
                        {
                            "title": "Workstation Space",
                            "next": "workstationSpace",
                            "service": "workstationSpace"
                        },
                        {
                            "title": "Kitchen Rental",
                            "next": "kitchenRental",
                            "service": "kitchenRental"
                        },
                        {
                            "title": "Event Venue",
                            "next": "Event Venue",
                            "service": "Event Venue"
                        },
                        {
                            "title": "Business Coach",
                            "next": "information",
                            "service": "Business Coach"
                        },
                        {
                            "title": "Explain Each Service",
                            "next": "information"
                        }
                    ]
                },

                "workstationSpace": {
                    "message": "The first step to this process is signing up as a The Food Corridor",
                    "options": [
                        {
                            "title": "Next Step",
                            "next": "Contact Form"
                        }
                    ]
                },

                "kitchenRental": {
                    "message": "The first step to this process is signing up as a The Food Corridor",
                    "options": [
                        {
                            "title": "Next Step",
                            "next": "Contact Form"
                        }
                    ]
                },

                "Event Venue": {
                    /*Use checkboxes here*/
                    "message": "The first step to this process is signing up as a The Food Corridor",
                    "options": [
                        {
                            "type": "checkbox",
                            "boxes": [
                                { name: "Indoor", value: "Indoor", id: "Indoor" },
                                { name: "Outdoor", value: "Outdoor", id: "Outdoor" }
                            ]
                        },
                        {
                            "title": "Next Step",
                            "next": "Contact Form"
                        }
                    ]
                },

                "Business Coach": {
                    "message": "The first step to this process is signing up as a The Food Corridor",
                    "options": [
                        {
                            "title": "Next Step",
                            "next": "Contact Form"
                        }
                    ]
                },

                "Check Signed Up": {
                    "message": "Are you already signed up as a The Food Corridor?",
                    "options": [
                        {
                            /*Database update here with callback function similar way like above where the form is*/
                            "title": "Yes",
                            "next": "BusinessStage"
                        },
                        {
                            "title": "No",
                            "next": "Not Signed up"
                        }
                    ]
                },

                "Contact Form": {
                    "message": "Before moving onto the second phase, Please fill out the form below so we can keep track of this conversation.",
                    "options": [
                        {
                            "type": "form",
                            "fields": [
                                { name: "f_name", placeholder: "First Name" },
                                { name: "l_name", placeholder: "Last Name" },
                                { name: "email", placeholder: "Email" },
                                { name: "phone", placeholder: "Phone" },
                                { name: "message", placeholder: "Message" }
                            ],
                            "callback": async function (data) {
                                console.log("Form data 2:", data.f_name + data.email); // Log the form data to the console
                                let f_name = data.f_name;
                                let l_name = data.l_name;
                                let email = data.email;
                                let phone = data.phone;
                                let message = data.message;
                                let response = await insertData({ f_name, l_name, email, phone, message });
                                console.log(response);
                                statemachine.currentState = "Second Phase"; // ex. state - Replace with different state after data base check
                                statemachine.render(); // Render the new state
                            }
                        },
                        {
                            "title": "Back",
                            "back": "start"
                        }
                    ]
                },

                "BusinessStage": {
                    "message": "What stage is your business in?",
                    "options": [
                        {
                            "type": "dropdown",
                            "name": "stage",
                            "choices": [
                                { value: "Idea Phase", label: "Idea Phase" },
                                { value: "Established", label: "Established" },
                                { value: "Scaling up", label: "Scaling up" }
                            ],
                            "callback": function (selectedValue) {
                                if (selectedValue === "Idea Phase") {
                                    statemachine.currentState = "Idea Phase";
                                } else if (selectedValue === "Established") {
                                    statemachine.currentState = "established";
                                } else if (selectedValue === "Scaling up") {
                                    statemachine.currentState = "Scaling up";
                                }
                                statemachine.render();
                            }
                        }
                    ]
                },

                "established": {
                    "message": "Well done on being an established business. Please let move to the second phase.",
                    "options": [
                        {
                            "title": "Business Stage",
                            "next": "Second Phase",
                        },
                    ]
                },

                "Scaling up": {
                    "message": "Well done on being an Scaling up business. Please let move to the second phase.",
                    "options": [
                        {
                            "title": "Business Stage",
                            "next": "Second Phase",
                        },
                    ]
                },

                "Idea Phase": {
                    "message": "It seems as though you're still in the idea phase. Here is some information to help you move forward.",
                    "options": [
                        {
                            "title": "Information",
                            "next": "information",
                        },
                    ]
                },

                "Second Phase": {
                    "message": "Great! Let's Check the pre-rental checklist of what you have.",
                    "options": [
                        {
                            "type": "checkbox",
                            "boxes": function () {
                                return getCheckboxesForService(statemachine.selectedService);
                            }
                        }
                    ]
                },

                "information": {
                    "message": "Please contact our support team directly for further assistance.",
                    "options": [
                        {
                            "title": "Back",
                            "back": "start"
                        }]
                },

                "defaultState": {
                    "message": "All requirements are met. You can proceed to the next step.",
                    "options": [
                        {
                            "title": "Food Processing",
                            "next": "Food Processing",
                            "service": "Food Processing",
                        },
                        {
                            "title": "Food Service",
                            "next": "Food Service",
                            "service": "Food Service",
                        }
                    ]
                },

                "Food Service": {
                    "message": "Please contact our support team directly for further assistance.",
                    "options": [
                        {
                            "title": "Next Step",
                            "back": "Food Form"
                        }]
                },

                "Food Processing": {
                    "message": "Please contact our support team directly for further assistance.",
                    "options": [
                        {
                            "title": "Next Step",
                            "back": "Food Form"
                        }]
                },

                "Food Form": {
                    "message": "Please fill out the form below so we can keep track of this conversation.",
                    "options": [
                        /*{
                            "type": "checkbox",
                            "boxes": function() {
                                    return getCheckboxesForService(statemachine.selectedService);
                            }
                        },*/
                        {
                            "type": "dropdown",
                            "name": "stage",
                            "choices": [
                                { value: "Idea Phase", label: "Idea Phase" },
                                { value: "Established", label: "Established" },
                                { value: "Scaling up", label: "Scaling up" }
                            ],
                            "callback": function (selectedValue) {
                                if (selectedValue === "Idea Phase") {
                                    statemachine.currentState = "Idea Phase";
                                } else if (selectedValue === "Established") {
                                    statemachine.currentState = "established";
                                } else if (selectedValue === "Scaling up") {
                                    statemachine.currentState = "Scaling up";
                                }
                                statemachine.render();
                            }
                        },
                    ]
                },

                // Then update the handleUnchecked state to use this function:
                "handleUnchecked": {
                    "message": "You have some unchecked items. Please address them.",
                    "render": function (uncheckedItems) {
                        return handleUncheckedItems(uncheckedItems);
                    },
                    "options": []
                },
            };


            // Function to handle user interaction
            statemachine.interact = function (option) {
                var currentState = statemachine.states[statemachine.currentState]; // Get the current state
                var selectedOption = currentState.options[option]; // Get the selected option

                const lastMsgDiv = messagesContainer.lastElementChild;
                if (lastMsgDiv && lastMsgDiv.classList.contains("chat-msg")) {
                    const msgTextDiv = lastMsgDiv.querySelector(".cm-msg-text");
                    if (msgTextDiv) {
                        // Create a new message div for the reply
                        const replyMsgDiv = document.createElement("div");
                        replyMsgDiv.className = "chat-msg self"; // You can adjust the class as per your design

                        // Set the content of the new message box
                        replyMsgDiv.innerHTML = `<div class="cm-msg-text-reply">${selectedOption.title}</div>`;

                        // Append the new message box to the container
                        messagesContainer.appendChild(replyMsgDiv);
                        chatLogs.scrollTop = chatLogs.scrollHeight; // Scroll to the bottom
                        saveChatHistory(replyMsgDiv, "self"); // Save the message to chat history
                    }
                }

                if (selectedOption.back) { // If the option has a back property
                    this.currentState = selectedOption.back; // Set the current state to the back state
                    this.render(); // Render the new state
                }

                if (selectedOption.next) { // If the option has a next property
                    this.currentState = selectedOption.next; // Set the current state to the next state
                    if (selectedOption.service) { // If the option has a service property
                        this.selectedService = selectedOption.service; // Set the selected service
                    }
                    this.render(); // Render the new state
                }

                if (selectedOption.callback) { // If the option has a callback property
                    selectedOption.callback(); // Call the callback function
                }

                if (selectedOption.href) { // If the option has an href property
                    window.open(selectedOption.href, "_blank"); // Open the link in a new tab
                    return;
                }

                saveCurrentState();
            };


            // Function to render the current state
            statemachine.render = function (isLoadingHistory = false) {
                var buttoncontainer = document.getElementById("button"); // Get the buttons container
                var currentState = statemachine.states[statemachine.currentState]; // Get the current state

                if (!currentState) {
                    console.error(`State "${statemachine.currentState}" is not defined.`);
                    return;
                }

                if (!isLoadingHistory) {
                    addMessage(currentState.message, "user"); // Add the current state's message to the chat logs
                    saveChatHistory(currentState.message, "user"); // Save the message to chat history
                }

                // Then, clear the current buttons 
                buttoncontainer.innerHTML = "";

                // Create buttons for each option in the current state  
                currentState.options.forEach((option, i) => {
                    if (option.type === "form") {
                        var form = createForm(option, i); // Create a form if the option type is "form"
                        buttoncontainer.appendChild(form); // Append the form to the buttons container
                    }

                    else if (option.type === "checkbox") {
                        var checkbox = createCheckbox(option.boxes()); // Create a checkbox if the option type is "checkbox"
                        buttoncontainer.appendChild(checkbox); // Append the checkbox to the buttons container
                    }

                    else if (option.type === "dropdown") {
                        var dropdown = createDropdown(option); // Create a dropdown if the option type is "dropdown"
                        buttoncontainer.appendChild(dropdown); // Append the dropdown to the buttons container
                    }

                    else {
                        var button = document.createElement("button"); // Create a new button element
                        button.className = "titles"; // Set the class name for the button
                        button.innerText = option.title; // Set the button text to the option title
                        button.onclick = () => this.interact(i); // Set the button's onclick handler to interact with the option
                        buttoncontainer.appendChild(button); // Append the button to the buttons container
                    }
                });

                chatLogs.appendChild(buttoncontainer); // Append the buttons container to the chat logs

                // If the current state is "handleUnchecked", render the unchecked states
                if (this.currentState === "handleUnchecked" && this.uncheckedStates) {

                    // Get the additional options for unchecked items
                    const additionalOptions = currentState.render(this.uncheckedStates);

                    // Create buttons for each additional option
                    additionalOptions.forEach((option, i) => {
                        var button = document.createElement("button");
                        button.className = "titles";
                        button.innerText = option.title;
                        button.onclick = () => {
                            if (option.href) {
                                window.open(option.href, "_blank");
                            } else if (option.back) {
                                this.currentState = option.back;
                                this.render();
                            }
                        };
                        buttoncontainer.appendChild(button);
                    });
                }
            }


            // Function to add a message to the chat logs
            function addMessage(msg, type) {
                const msgDiv = document.createElement("div"); // Create a new div element for the message
                msgDiv.className = `chat-msg ${type}`; // Set the class name for the message div
                msgDiv.innerHTML = `<div class="cm-msg-text">${msg}</div>`; // Set the inner HTML of the message div
                messagesContainer.appendChild(msgDiv); // Append the message div to the chat logs
                chatLogs.scrollTop = chatLogs.scrollHeight; // Scroll to the bottom of the chat logs
            }


            // Function to create a form for the option
            function createForm(option) {
                var form = document.createElement("form"); // Create a new form element
                form.className = "form"; // Set the class name for the form
                form.onsubmit = function (event) {
                    event.preventDefault();
                    var formData = new FormData(form);
                    var data = {};
                    option.fields.forEach(field => {
                        data[field.name] = formData.get(field.name);
                    });
                    option.callback(data); // Call the callback function with the form data
                };

                option.fields.forEach(field => {
                    var input = document.createElement("input"); // Create a new input element
                    input.type = "text"; // Set the input type to text
                    input.name = field.name; // Set the input name
                    input.placeholder = field.placeholder; // Set the input placeholder
                    form.appendChild(input); // Append the input to the form
                });

                var submitButton = document.createElement("button"); // Create a new button element
                submitButton.type = "submit"; // Set the button type to submit
                submitButton.innerText = "Submit"; // Set the button text
                form.appendChild(submitButton); // Append the button to the form

                return form;
            }


            // Function to create checkboxes for the option
            function createCheckbox(boxes) {
                var form = document.createElement("form"); // Create a new form element
                form.className = "checkbox"; // Set the class name for the form
                form.onsubmit = function (event) {
                    event.preventDefault();
                    var uncheckedValues = [];
                    boxes.forEach(box => {
                        var checkbox = document.getElementById(box.id);
                        if (!checkbox.checked) {
                            uncheckedValues.push(box.value);
                        }
                    });
                    // Handle the unchecked values as needed
                    if (uncheckedValues.length > 0) {
                        statemachine.uncheckedStates = uncheckedValues; // Store unchecked values in the state machine
                        statemachine.currentState = "handleUnchecked";
                        statemachine.render();
                    }
                    else {
                        // If all checkboxes are checked, transition to a default state
                        statemachine.currentState = "defaultState";
                        statemachine.render();
                    }
                };

                boxes.forEach(box => {
                    var label = document.createElement("label");
                    var input = document.createElement("input"); // Create a new input element
                    input.type = "checkbox"; // Set the input type to checkbox
                    input.name = box.name; // Set the input name
                    input.value = box.value; // Set the input value
                    input.id = box.id; // Set the input id
                    label.appendChild(input); // Append the input to the label
                    label.appendChild(document.createTextNode(box.value)); // Append the checkbox label
                    form.appendChild(label); // Append the label to the form
                    form.appendChild(document.createElement("br")); // Add a line break
                });

                var submitButton = document.createElement("button"); // Create a new button element
                submitButton.type = "submit"; // Set the button type to submit
                submitButton.innerText = "Submit"; // Set the button text
                form.appendChild(submitButton); // Append the button to the form
                return form;
            }



            // Function to create a dropdown for the option
            function createDropdown(option) {
                var form = document.createElement("form"); // Create a new form element
                form.className = "dropdown"; // Set the class name for the form
                form.onsubmit = function (event) {
                    event.preventDefault();
                    var selectedValue = form.querySelector("select").value;
                    option.callback(selectedValue); // Call the callback function with the selected value
                };

                var select = document.createElement("select"); // Create a new select element
                select.name = option.name; // Set the select name
                option.choices.forEach(choice => {
                    var optionElement = document.createElement("option"); // Create a new option element
                    optionElement.value = choice.value; // Set the option value
                    optionElement.innerText = choice.label; // Set the option label
                    select.appendChild(optionElement); // Append the option to the select
                });
                form.appendChild(select); // Append the select to the form

                var submitButton = document.createElement("button"); // Create a new button element
                submitButton.type = "submit"; // Set the button type to submit
                submitButton.innerText = "Submit"; // Set the button text
                form.appendChild(submitButton); // Append the button to the form

                return form;
            }


            // Function to get the checkboxes based on the selected service
            function getCheckboxesForService(service) {
                if (service === "workstationSpace") {
                    return [
                        { name: "Interior Health", value: "Interior Health", id: "Interior Health" },
                        { name: "City of Kamloops Business License", value: "City of Kamloops Business License", id: "City of Kamloops Business License" },
                        { name: "Commercial Insurance", value: "Commercial Insurance", id: "Commercial Insurance" },
                        { name: "Completed Business Plan", value: "Completed Business Plan" }
                    ];
                } else if (service === "kitchenRental") {
                    return [
                        { name: "Interior Health", value: "Interior Health", id: "Interior Health" },
                        { name: "City of Kamloops Business License", value: "City of Kamloops Business License", id: "City of Kamloops Business License" },
                        { name: "Commercial Insurance", value: "Commercial Insurance", id: "Commercial Insurance" },
                    ];
                } else if (service === "Event Venue") {
                    return [
                        { name: "Interior Health", value: "Interior Health", id: "Interior Health" },
                        { name: "Insurance", value: "Insurance", id: "Insurance" },
                        { name: "Security Plan", value: "Security Plan", id: "Security Plan" }
                    ];
                } else if (service === "Business Coach") {
                    return [
                        { name: "Business Plan", value: "Business Plan", id: "Business Plan" },
                        { name: "Financial Plan", value: "Financial Plan", id: "Financial Plan" },
                        { name: "Marketing Plan", value: "Marketing Plan", id: "Marketing Plan" }
                    ];
                }
                else if (service === "Food Processing") {
                    return [
                        { name: "Interior Health", value: "Interior Health", id: "Interior Health" },
                        { name: "City of Kamloops Business License", value: "City of Kamloops Business License", id: "City of Kamloops Business License" },
                        { name: "Commercial Insurance", value: "Commercial Insurance", id: "Commercial Insurance" },
                        { name: "Completed Business Plan", value: "Completed Business Plan" }
                    ];
                }
                else if (service === "Food Service") {
                    return [
                        { name: "Interior Health", value: "Interior Health", id: "Interior Health" },
                        { name: "City of Kamloops Business License", value: "City of Kamloops Business License", id: "City of Kamloops Business License" },
                        { name: "Commercial Insurance", value: "Commercial Insurance", id: "Commercial Insurance" },
                        { name: "Completed Business Plan", value: "Completed Business Plan" }
                    ];
                }
                else {
                    return [];
                }
            }


            //-------
            function handleUncheckedItems(uncheckedItems) {
                let options = [];

                uncheckedItems.forEach(item => {
                    switch (item) {
                        case "Commercial Insurance":
                            addMessage("You need insurance to protect your business. Here are some local insurance providers:", "user");
                            options.push(
                                {
                                    "title": "Click here for interiorsavings insurance",
                                    "href": "https://www.interiorsavings.com/business/insurance"
                                },
                                {
                                    "title": "Click here for hub international insurance",
                                    "href": "https://www.hubinternational.com/en-CA/offices/ca/british-columbia/kamloops-third-avenue/"
                                }
                            );
                            break;
                        case "City of Kamloops Business License":
                            addMessage("A business license is required to operate in Kamloops. You can apply here:", "user");
                            options.push({
                                "title": "Click Here for the business license application",
                                "href": "https://www.kamloops.ca/sites/default/files/docs/252123_Application%20for%20Business%20Licence%20Fillable%20Extended.pdf"
                            });
                            break;
                        case "Interior Health":
                            addMessage("Food safety is important! You'll need Interior Health approval:", "user");
                            options.push({
                                "title": "Click Here for the Interior Health Requirements",
                                "href": "https://www.interiorhealth.ca/sites/default/files/PDFS/application-for-food-premises-health-protection.pdf"
                            });
                            break;
                        default:
                            addMessage(`You need to complete your ${item} before proceeding.`, "user");
                            options.push({
                                "title": `Complete your ${item}`,
                                "next": item.replace(/\s+/g, '')
                            });
                    }
                });

                // Add the back button as the last option
                options.push({
                    "title": "Back",
                    "back": "Second Phase"
                });

                return options;
            }


            // Load chat history from localStorage
            function loadChatHistory() {
                messagesContainer.innerHTML = ""; // Clear the chat logs
                const history = JSON.parse(localStorage.getItem("chatHistory")) || [];

                history.forEach(item => {
                    const msgDiv = document.createElement("div");
                    msgDiv.className = `chat-msg ${item.type}`;

                    // Check if the message contains the reply class
                    if (item.msg.includes("cm-msg-text-reply")) {
                        msgDiv.innerHTML = item.msg;
                    } else {
                        msgDiv.innerHTML = `<div class="cm-msg-text">${item.msg}</div>`;
                    }

                    messagesContainer.appendChild(msgDiv);
                });

                const savedState = localStorage.getItem("currentState");
                if (savedState) {
                    statemachine.currentState = savedState;
                }
                return history.length > 0;
            }


            // Function to save chat history to localStorage
            function saveChatHistory(msg, type) {
                const history = JSON.parse(localStorage.getItem("chatHistory")) || [];

                // If msg is an HTML element (replyMsgDiv)
                if (msg instanceof HTMLElement) {
                    history.push({
                        msg: `<div class="cm-msg-text-reply">${msg.querySelector('.cm-msg-text-reply').innerHTML}</div>`,
                        type: type
                    });
                } else {
                    // For regular messages
                    history.push({
                        msg: msg,
                        type: type
                    });
                }

                localStorage.setItem("chatHistory", JSON.stringify(history));
            }

            // Save the current state to localStorage
            function saveCurrentState(state) {
                localStorage.setItem("currentState", statemachine.currentState);
            }




            statemachine.currentState = "start"; // Set the initial state to start
            const hasHistory = loadChatHistory(); // Load chat history from localStorage
            if (!hasHistory) {
                statemachine.render(); // Render the initial state
            } else {
                statemachine.render(true); // Render the initial state
            }
        }
    });
}
