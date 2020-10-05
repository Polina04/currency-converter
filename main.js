class CurrencyConverter {
  constructor(fetchForm, history) {
    this.fetchForm = fetchForm;
    this.history = history;
  }

  async formSubmitHandler(e) {
    e.preventDefault();
    const { amount, from, to } = e.target.elements;

    const currencies = await this.fetchCurrency();
    if (currencies === null) return;

    if (this.history === null) {
      const historyMarkup =
        '<h2 class="history__title">Your history</h2><ul class="history__list"></ul>';
      this.fetchForm.insertAdjacentHTML("afterend", historyMarkup);
      this.history = document.querySelector(".history__list");
    }

    const currencyToExchange = from.value;
    const outputCurrencyValueToEUR = currencies[to.value];
    const inputCurrencyValueToEUR = currencies[from.value];
    const amountForExchange = Number(amount.value);

    const targetAmount = this.calculateOutputAmount(
      outputCurrencyValueToEUR,
      inputCurrencyValueToEUR,
      amountForExchange,
      currencyToExchange
    );
    const exchangeItemMarkup = `<li class="history__item">
    <p class="history__item-amount">${amountForExchange} 
    <span class="history__item-amount--green">${currencyToExchange}</span></p>
    <span class="history__item-arrow"></span>
    <p class="history__item-amount">${targetAmount.toFixed(
      2
    )} <span class="history__item-amount--green">${to.value}</span></p>
  </li>`;
    this.history.insertAdjacentHTML("afterbegin", exchangeItemMarkup);
  }

  async fetchCurrency() {
    try {
      const baseUrl = `http://data.fixer.io/api/latest?access_key=514197f125745d40ae92640ab3cf9b45`;
      const response = await fetch(baseUrl);
      const parsedResponse = await response.json();
      return parsedResponse.rates;
    } catch (error) {
      const errorMarkUp = `<p class="error">We are sorry...</br>Request limit exceeded</p>`;
      this.fetchForm.insertAdjacentHTML("afterend", errorMarkUp);
      return null;
    }
  }

  calculateOutputAmount(
    outputCurrValue,
    inputCurrValue,
    amount,
    exchangingCurr
  ) {
    if (exchangingCurr === "EUR") {
      const targetAmount = amount * outputCurrValue;
      return targetAmount;
    } else {
      const targetAmount = (amount / inputCurrValue) * outputCurrValue;
      return targetAmount;
    }
  }
}

const fetchForm = document.getElementById("fetch-form");
const history = document.querySelector(".history__list");

const currencyConverter = new CurrencyConverter(fetchForm, history);
fetchForm.addEventListener("submit", e =>
  currencyConverter.formSubmitHandler(e)
);
