// -------------------------------------GLOBAL VARIABLES-------------------------------------------------

const formData = {};
let expenses = [];
let paginate = { next: false, prev: false };
let fetchCount = 10;
let expensesCount = 0;

let aNode = document.getElementById("alert");

// -------------------------------------END OF VARIABLES-------------------------------------------------

//--------------------------------------METHODS----------------------------------------------------------

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//-----------------------------------------------------------------------------------------------------
function setPgButtonsDisplayMode({ next, prev }) {
    document.getElementById("next").disabled = !next;
    document.getElementById("prev").disabled = !prev;
}

//------------------------------------------------------------------------------------------------------

function setPaginate({ next, prev }) {
    paginate.next = next;
    paginate.prev = prev;
}
//------------------------------------------------------------------------------------------------------

function setExpenses(exps) {
    expenses = [...exps];
}
//------------------------------------------------------------------------------------------------------

function attachApiTokenToHeader() {
    if (!axios.defaults.headers.common["Authorization"])
        axios.defaults.headers.common["Authorization"] =
            "Bearer " + document.getElementById("key").innerHTML;
}

//------------------------------------------------------------------------------------------------------
function resetFetchCount() {
    fetchCount = 10;
}
//------------------------------------------------------------------------------------------------------

function fetchExpenses() {
    showLoading();
    attachApiTokenToHeader();

    axios
        .get(`/api/expenses/paginate/next/5`)
        .then(res => {
            setExpenses(res.data.expenses);
            fetchTotalNumberOfExpenses();
            setPaginate(res.data.paginate);
            setPgButtonsDisplayMode(paginate);
            hideLoading();
            displayExpenses(expenses);
        })
        .catch(err => console.error(err));
}

//------------------------------------------------------------------------------------------------------

function setExpensesCount({ count }) {
    expensesCount = count;
}

//------------------------------------------------------------------------------------------------------

function updateTotalExpenseNode(count) {
    document.getElementById("total").innerHTML = count;
}

//------------------------------------------------------------------------------------------------------

function fetchTotalNumberOfExpenses() {
    attachApiTokenToHeader();
    axios
        .get("/api/expenses/stat")
        .then(res => {
            setExpensesCount(res.data);
            updateTotalExpenseNode(expensesCount);
        })
        .catch(err => {
            console.error(err.response.data);
        });
}

//------------------------------------------------------------------------------------------------------

function fetchNextExpenses(count) {
    showLoading();
    attachApiTokenToHeader();

    axios
        .get(`/api/expenses/paginate/next/${count}`)
        .then(res => {
            if (res.data.paginate.next) fetchCount += 5;

            setExpenses(res.data.expenses);

            setPaginate(res.data.paginate);
            hideLoading();
            displayExpenses(expenses);
            setPgButtonsDisplayMode(paginate);
        })
        .catch(err => console.error(err.response.data));
}

//------------------------------------------------------------------------------------------------------
function fetchPreviousExpenses(count) {
    showLoading();
    attachApiTokenToHeader();

    count = fetchCount -= 5;
    axios
        .get(`/api/expenses/paginate/prev/${count}`)
        .then(res => {
            if (!res.data.paginate.prev) resetFetchCount();

            setExpenses(res.data.expenses);
            setPaginate(res.data.paginate);
            hideLoading();
            displayExpenses(expenses);
            setPgButtonsDisplayMode(paginate);
        })
        .catch(err => console.error(err.response.data));
}

//------------------------------------------------------------------------------------------------------

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
function bindFetchNextEvent() {
    document.getElementById("next").addEventListener("click", () => {
        fetchNextExpenses(getFetchCount());
    });
}
//----------------------------------------------------------------------------------------------------
function getFetchCount() {
    return fetchCount;
}
//----------------------------------------------------------------------------------------------------
function bindFetchPrevEvent() {
    document.getElementById("prev").addEventListener("click", () => {
        fetchPreviousExpenses(getFetchCount());
    });
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

function showLoading() {
    document.getElementById("loading-data").style = "display:";
}

//----------------------------------------------------------------------------------------------------
function hideLoading() {
    document.getElementById("loading-data").style = "display:none";
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
    delete axios.defaults.headers.common["Authorization"];
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

function displayExpenses(expenses) {
    if (expenses.length > 0) {
        let oldTableBodyNode = document.getElementById("t-body");
        let newTableBodyNode = document.createElement("tbody");

        for (let i = 0; i < expenses.length; ++i) {
            const expense = expenses[i];
            let rowElement = document.createElement("tr");
            let valueEuroElement = document.createElement("td");
            let reasonElement = document.createElement("td");
            let valuePoundElement = document.createElement("td");
            let vatElement = document.createElement("td");
            let dateElement = document.createElement("td");

            valueEuroElement.innerHTML = numberWithCommas(expense.exp_value);
            reasonElement.innerHTML = expense.exp_reason;
            valuePoundElement.innerHTML = numberWithCommas(
                expense.exp_value_pound
            );
            vatElement.innerHTML = numberWithCommas(expense.exp_vat);
            dateElement.innerHTML = expense.exp_date;

            rowElement.append(
                reasonElement,
                valueEuroElement,
                valuePoundElement,
                vatElement,
                dateElement
            );
            newTableBodyNode.appendChild(rowElement);
            newTableBodyNode.setAttribute("id", "t-body");
        }
        //Replace old table body by new body
        oldTableBodyNode.parentNode.replaceChild(
            newTableBodyNode,
            oldTableBodyNode
        );
    }
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
    bindFetchNextEvent();
    bindFetchPrevEvent();
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
            fetchExpenses();
        })
        .catch(err => {
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
    AOS.init();

    hideProgressAndStatusNodes();
    bindAllEvents();
    setPgButtonsDisplayMode(paginate);
    updateTotalExpenseNode(expensesCount);
    fetchTotalNumberOfExpenses();
    fetchExpenses();
}

//---------------------------------------RUN SCRIPT---------------------------------------------------

main();
