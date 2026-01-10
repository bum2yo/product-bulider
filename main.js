const generateBtn = document.getElementById('generate-btn');
const lottoNumbersContainer = document.getElementById('lotto-numbers');

generateBtn.addEventListener('click', () => {
  lottoNumbersContainer.innerHTML = '';
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

  sortedNumbers.forEach(number => {
    const numberElement = document.createElement('div');
    numberElement.classList.add('lotto-number');
    numberElement.textContent = number;
    numberElement.style.backgroundColor = getNumberColor(number);
    lottoNumbersContainer.appendChild(numberElement);
  });
});

function getNumberColor(number) {
  if (number <= 10) {
    return '#fbc400'; // Yellow
  } else if (number <= 20) {
    return '#69c8f2'; // Blue
  } else if (number <= 30) {
    return '#ff7272'; // Red
  } else if (number <= 40) {
    return '#aaa'; // Gray
  } else {
    return '#b0d840'; // Green
  }
}