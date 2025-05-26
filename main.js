const app = document.getElementById('app');

const showLogin = () => {
	app.innerHTML = `
		<form class="form">
        	<h1>Авторизация</h1>
        	<input type="text" id="email" placeholder="Email" required />
       		<input type="password" id="password" placeholder="Пароль" required />
        	<button type="submit">Войти</button>
      	</form>
		`;

	document.querySelector('form').addEventListener('submit', (e) => {
		e.preventDefault();
		login();
	});
};

const login = async () => {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;

	try {
		const res = await fetch('https://reqres.in/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': 'reqres-free-v1'
			},
			body: JSON.stringify({ email, password })
		});

		if (!res.ok) throw new Error('Ошибка на стороне сервера');

		const data = await res.json();

		if (data.token) {
			localStorage.setItem('token', data.token);
			console.log('Авторизация прошла успешно', data.token);
			showDashboard();
		} else {
			console.error('Нет токена в ответе');
		}
	} catch (error) {
		console.error('Ошибка авторизации', error.message);
	}
};

const showDashboard = async () => {
	const token = localStorage.getItem('token');
	if (!token) return showLogin();

	const weatherApiKey = '7d81e4579f71c81f0ee68136ad2798b8'; // <- замените на свой реальный ключ
	const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=moscow&appid=${weatherApiKey}&units=metric&lang=ru`);

	if (!res.ok) {
		alert('Не удалось получить прогноз погоды');
		return showLogin();
	}

	const data = await res.json();

	app.innerHTML = `    
	<img class="moscow" src="moscow.jpg" alt="Москва" />
      <h1>Прогноз погоды в Москве</h1>
	  <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Погода" />
      <p>🌡 Температура: ${Math.round(data.main.temp)} °C</p>
      <p>☁️ Условия: ${data.weather[0].description}</p>
      <p>🌬 Скорость ветра: ${data.wind.speed} м/с</p>    
  `;
}

document.addEventListener('DOMContentLoaded', () => {
	const token = localStorage.getItem('token');
	if (token) {
		showDashboard();
	} else {
		showLogin();
	}
});