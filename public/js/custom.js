// -------------------------------------GLOBAL VARIABLES-------------------------------------------------

const formData = {};
const expenses = {};
let aNode = document.getElementById("alert");

// -------------------------------------END OF VARIABLES-------------------------------------------------

function formatNumberWithEur(x) {
    //Remove commas
    let pureNumbers = x
        .toString()
        .split(",")
        .join("");

    let numbParts = pureNumbers.split(" ");

    //Only two parts expected (NUMBER AND EUR)
    if (numbParts.length > 2 || pureNumbers.split(".").length > 2) {
        return null;
    }

    //Remove EUR
    return numbParts[0];
}
// ------------------------------------------------------------------------------------------------

function computeVAT(value) {
    return (parseFloat(value) * 0.2).toFixed(2);
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
    formData.euro = document.getElementById("exp_value").value;
    formData.pound = document.getElementById("exp_value_pound").value;
    formData.vat = document.getElementById("exp_vat").value;
    formData.date = document.getElementById("exp_date").value;
    formData.reason = document.getElementById("exp_reason").value;
}

//----------------------------------------------------------------------------------------------------

function bindFormEvent() {
    const form = document.getElementById("exp_form");
    form.addEventListener("submit", e => {
        e.preventDefault();
        setFormData();
        //TODO: SEND TO SERVER
        console.log(formData);
    });
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
                    updateFormData(); // This will be submitted later after
                    resetHeaders();
                })
                .catch(err => {
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
    document.getElementById(nodeId).style = "border-color:red";
}

//----------------------------------------------------------------------------------------------------

function clearError(nodeId) {
    let aNode = document.getElementById("alert");
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
    formData.vat = document.getElementById("exp_vat").value;
    formData.pound = document.getElementById("exp_value_pound").value;
}

//----------------------------------------------------------------------------------------------------

function bindAllEvents() {
    bindFormEvent();
    bindExpEuroFieldEvent();
}

// ---------------------------------------MAIN--------------------------------------------------------
function main() {
    bindAllEvents();
}
