// -------------------------------------GLOBAL VARIABLES-------------------------------------------------

const formData = {};
const expenses = {};
let loading = false;
let paginate = { next: false, prev: false };

let aNode = document.getElementById("alert");

// -------------------------------------END OF VARIABLES-------------------------------------------------

function formatNumberWithEur(x) {
    //Remove spaces
    x = x.trim();

    //Remove commas
    let pureNumbers = x
        .toString()
        .split(",")
        .join("");

    let numbParts = pureNumbers.split(" ");

    //Only two parts expected (NUMBER AND EUR)
    if (numbParts.length !== 2 || pureNumbers.split(".").length > 2) {
        return null;
    }

    //Remove EUR
    return numbParts[0];
}
// ------------------------------------------------------------------------------------------------

function computeVAT(value) {
    return (parseFloat(value) * 0.2).toFixed(2);
}
// ------------------------------------------------------------------------------------------------

function ensureOnlySingleConsecutiveSpace() {
    //This ensures two spaces don't follow each other. e.g 1,300.45 <space> <space> EUR
    let node = document.getElementById("exp_value");
    node.addEventListener("keyup", e => {
        let val = e.target.value;
        const length = val.length;
        if (length >= 2) {
            if (
                val.charAt(length - 2) === " " &&
                val.charAt(length - 2) === val.charAt(length - 1)
            ) {
                node.value = val.substring(0, length - 1);
            }
        }
    });
}
// -------------------------------------------------------------------------------------------------

function convertEuroToPounds(euro, rate) {
    return (euro * rate).toFixed(2);
}

//----------------------------------------------------------------------------------------------------

function setVATorPoundValue(nodeId, value) {
    let node = document.getElementById(nodeId);
    node.setAttribute("value", value);
}

//----------------------------------------------------------------------------------------------------

function setFormData() {
    formData.exp_value = formatNumberWithEur(
        document.getElementById("exp_value").value
    );
    formData.exp_value_pound = document.getElementById("exp_value_pound").value;
    formData.exp_vat = document.getElementById("exp_vat").value;
    formData.exp_date = document.getElementById("exp_date").value;
    formData.exp_reason = document.getElementById("exp_reason").value;
}

//----------------------------------------------------------------------------------------------------

function bindFormEvent() {
    const form = document.getElementById("exp_form");
    form.addEventListener("submit", e => {
        e.preventDefault();
        showProgress();
        setFormData();
        sendDataToServer(formData);
    });
}

//----------------------------------------------------------------------------------------------------

function hideProgressAndStatusNodes() {
    document.getElementById("progress").style = "display:none";
    document.getElementById("status").style = "display:none";
}

//----------------------------------------------------------------------------------------------------
function showStatus(statusCode) {
    if (statusCode === "error") {
        let node = document.getElementById("status");
        node.style = "display:";
        node.innerHTML =
            "<i class='fa fa-times-circle-o' style='color:red'> </i> <small style='color:red'>Error saving expense!</small>";
    } else if (statusCode === "success") {
        let node = document.getElementById("status");
        node.style = "display:";
        node.innerHTML =
            "<i class='fa fa-check-circle-o' style='color:green'> </i> <small style='color:green'>Expense submitted successfully!</small>";
    } else {
        console.error("Unknown status code");
    }
}

//----------------------------------------------------------------------------------------------------
function hideStatusNode(statusCode) {
    if (statusCode === "error" || statusCode === "success") {
        setTimeout(() => {
            let node = document.getElementById("status");
            node.style = "display:none";
        }, 5000);
    } else {
        console.error("Unknown status code");
    }
}

//----------------------------------------------------------------------------------------------------

function showProgress() {
    let node = document.getElementById("progress");
    node.style = "display:";
}

//----------------------------------------------------------------------------------------------------

function hideProgress() {
    let node = document.getElementById("progress");
    node.style = "display:none";
}

//----------------------------------------------------------------------------------------------------

function resetHeaders() {
    axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    let token = document.head.querySelector('meta[name="csrf-token"]');

    if (token) {
        window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;
    } else {
        console.error(
            "CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token"
        );
    }
}

//----------------------------------------------------------------------------------------------------

function hideHeaders() {
    //This is done to conform with the remote api CORS rule
    //Must be reset for inbound ajax requests
    delete axios.defaults.headers.common["X-CSRF-TOKEN"];
    delete axios.defaults.headers.common["X-Requested-With"];
}

//----------------------------------------------------------------------------------------------------

function bindExpEuroFieldEvent() {
    document.getElementById("exp_value").addEventListener("blur", e => {
        let value = e.target.value;
        //Extract number value
        const euro = formatNumberWithEur(value);
        clearError("exp_value");
        //Process only if euro is valid.
        if (euro) {
            hideHeaders();
            //Fetch conversion rate from remote api
            axios
                .get(
                    `http://data.fixer.io/api/latest?access_key=edb89abec9c4dac86f4b20c7f147316f&base=EUR&symbols=GBP`
                )
                .then(res => {
                    const rate = res.data.rates.GBP.toFixed(2);
                    const pound = convertEuroToPounds(euro, rate);

                    displayPoundRate(rate);
                    updateVatAndPoundFields(pound);
                    updateFormData(); // This will be submitted later
                    resetHeaders();
                })
                .catch(err => {
                    alert(
                        "Error fetching conversion rate. Please check your connection and reload page"
                    );
                    console.error(err.response.data);
                });
        } else {
            showError("exp_value", "Error: Incorrect expense value in EUR");
        }
    });
}

//----------------------------------------------------------------------------------------------------

function displayPoundRate(rate) {
    document.getElementById(
        "rate"
    ).innerHTML = `1 EUR = ${rate} Pound sterling `;
}

//----------------------------------------------------------------------------------------------------

function showError(nodeId, message) {
    aNode.style = "";
    aNode.innerHTML = message;
    document.getElementsByName(nodeId)[0].style = "border-color:red";
}
//----------------------------------------------------------------------------------------------------

function showErrors(data) {
    aNode.style = "";
    let message = "";

    //TODO: Read sth that tells that it a data error else, just show as server error
    for (let name in data) {
        document.getElementsByName(name)[0].style = "border-color:red";
        message += `<p><small><i class='fa fa-times-circle-o' style='color:red'></i> ${
            data[name][0]
        }</small></p>`;
    }
    aNode.innerHTML = message;
}
//----------------------------------------------------------------------------------------------------
function hideError() {
    aNode.style = "display:none";
    aNode.innerHTML = "";
}

//----------------------------------------------------------------------------------------------------

function clearError(nodeId) {
    aNode.style = "display:none";
    aNode.innerHTML = "";
    document.getElementById(nodeId).style = "border-color:";
}

//----------------------------------------------------------------------------------------------------

function updateVatAndPoundFields(pound) {
    setVATorPoundValue("exp_value_pound", pound);
    setVATorPoundValue("exp_vat", computeVAT(pound));
}

//----------------------------------------------------------------------------------------------------

function updateFormData() {
    formData.exp_vat = document.getElementById("exp_vat").value;
    formData.exp_value_pound = document.getElementById("exp_value_pound").value;
}

//----------------------------------------------------------------------------------------------------

function bindAllEvents() {
    ensureOnlySingleConsecutiveSpace();
    bindFormEvent();
    bindExpEuroFieldEvent();
}

//----------------------------------------------------------------------------------------------------

function sendDataToServer(data) {
    axios
        .post("/expenses", data)
        .then(res => {
            hideError();
            hideProgress();
            showStatus("success");
            hideStatusNode("success"); //Executes after 5 seconds
        })
        .catch(err => {
            console.error(err.response.data);
            if (err.response.data.type === "inputErrors") {
                showErrors(err.response.data.errors);
            }

            hideProgress();
            showStatus("error");
            hideStatusNode("error");
        });
}

// ---------------------------------------MAIN--------------------------------------------------------

function main() {
    hideProgressAndStatusNodes();
    bindAllEvents();
}

//---------------------------------------RUN SCRIPT---------------------------------------------------

main();
