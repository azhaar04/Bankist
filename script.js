'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Azharul Islam',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2024-03-02T23:36:17.929Z',
    '2024-03-05T10:51:36.790Z',
  ],
  currency: 'BDT',
  locale: 'bn', // de-DE
};

const account2 = {
  owner: 'Tasfia Nowrin',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Tonmoy Barai',
  movements: [5070, 3700, -150, -790, -3210, -1040, 8500, -30, 40, 50, -700],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Md Shahriar Islam Rifat',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 50, -50, 100],
  interestRate: 1.8,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////functions//////////////

///Start log out timer
const startLogOutTimer = function () {
  let time = 120;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

///format currencies
const formatCur = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

////display movements date
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  else if (daysPassed === 1) return 'Yesterday';
  else if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // return `${day}/${month}/${year}`;
    return Intl.DateTimeFormat(locale).format(date);
  }
};

//displaying movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(date, acc.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const formattedMovement = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMovement}</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//displaying total balance
const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//displaying summary
const displaySummary = function (acc) {
  const totalDeposits = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(totalDeposits, acc.locale, acc.currency);

  const totalWithdraw = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(totalWithdraw),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

///////creating username on objects
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

/////////////////update ui
const updateUI = function (currentAccount) {
  displayMovements(currentAccount);
  calDisplayBalance(currentAccount);
  displaySummary(currentAccount);
};
/////////////////////////
//event handler
//////////// fake always logged
let currentAccount, timer;
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

////////Log in
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //create current date and time

    // const now = new Date();
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

/////////////transfer money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recieverAccount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance >= amount &&
    currentAccount.userName !== recieverAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//button request loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    setTimeout(function () {
      //add movement
      currentAccount.movements.push(amount);
      //add date
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 5000);
    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

//button close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.userName === inputCloseUsername.value
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

///sort button
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
  console.log(sorted);
});

//////////////////////////////////////////////////
///////lecture/////////////////////////

// console.log(23 === 23.0);
// console.log(23 === '23');
// console.log(0.2 + 0.1);
// console.log(1.0 + 3.55);
// console.log(1.5 + 1.6);

// console.log(0.1 + 0.2);

// ///convertion
// console.log(Number('23'));
// console.log(typeof +'23');

//parsing
// console.log(Number.parseInt('   253ex20'));
// console.log(Number.parseFloat('25.02502ex20'));
// console.log(Number.parseInt('101fx25fx', 10));
// console.log(Math.sqrt(25));
// console.log(8 ** (1 / 3));
// console.log(Math.max(2, '5', 3, 1, 4));
// console.log(Math.min(2, 5, 3, 1, 4));
// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt = (min, max) =>
//   Math.trunc(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

// console.log(Math.round(20.6));
// console.log(Math.round(20.2));

// console.log(Math.ceil(25.3));
// console.log(Math.ceil(25.7));

// console.log(Math.floor(25.3));
// console.log(Math.floor(25.7));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));
// const n = 10.30325;
// console.log(+n.toFixed(3));
// console.log(+(2.345).toFixed(2));
//
// const now = new Date();
// console.log(now);
// console.log(new Date('Mar 06 2024 13:05:54'));
// console.log(new Date('Dec 17 2020 12:12:20'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(account1.movementsDates[1]));
// console.log(new Date(2050, 11, 16, 12, 12, 12));
// console.log(new Date(2024, 7, 10));
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
/*
const future = new Date(2050, 11, 16, 12, 12);
console.log(future);
console.log(future.getMinutes());
console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(2554783920000));
console.log(Date.now());


console.log(new Date('Aug 02 2020 18:05:41'));
console.log(new Date(account1.movementsDates[0]));
console.log(new Date(2001, 2, 4, 10, 30, 20));
console.log(new Date(2024, 2, 4));
console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));

const future = new Date(2030, 2, 4, 12, 11, 10);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());
console.log(future.toISOString());
console.log(future.getTime());
console.log(new Date(1898835070000));
console.log(new Date(1707588123416));
console.log(Date.now());

future.setFullYear(2040);
console.log(future);

const options = {
  style: 'currency',
  currency: 'BDT',
};

const num = 2354669.33;
console.log('Bangladesh:  ', Intl.NumberFormat('bn', options).format(num));
console.log('USA:         ', Intl.NumberFormat('en-US', options).format(num));
console.log('India:       ', Intl.NumberFormat('hi-IN', options).format(num));


////////setTimeOut
const ingredients = ['Chicken', 'Meat', 'Onion'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2}🍕`),
  5000,
  ...ingredients
);
console.log('Waiting....');
if (ingredients.includes('Onion')) clearTimeout(pizzaTimer);

////////setInterval

setInterval(function () {
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  console.log(`${hour}:${min}:${sec}`);
}, 1000);
*/
