function showSpinner(spinner, span, btnLabel){
  spinner.classList.add("show")
  span.textContent = btnLabel;
}

function removeSpinner(spinner, span, btnLabel){
    spinner.classList.remove("show");
    span.textContent = btnLabel
}

export {
    showSpinner, removeSpinner
}