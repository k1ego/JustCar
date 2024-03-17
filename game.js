(function () {
	let isPause = false;
	let animationId = null;

	const speed = 5;

	const car = document.querySelector('.car');
	const carHeight = car.clientHeight;
	const carWidth = car.clientWidth;
    const carCoords = getCoords(car);
	const carMoveInfo = {
		top: null,
		bottom: null,
		left: null,
		right: null,
	};

	const coin = document.querySelector('.coin');
	const coinCoord = getCoords(coin);
	const coinWidth = coin.clientWidth;
    const coinHeigh = coin.clientHeight;

	const danger = document.querySelector('.danger');
	// const dangerCoord = getCoords(danger);
	// const dangerWidth = danger.clientWidth;

	const arrow = document.querySelector('.arrow');
	// const arrowCoord = getCoords(arrow);
	// const arrowWidth = arrow.clientWidth;

	const road = document.querySelector('.road');
	const roadHeight = road.clientHeight;
	const roadWidth = road.clientWidth;

	const trees = document.querySelectorAll('.tree');

	const treesCoords = [];

	for (let i = 0; i < trees.length; i++) {
		const tree = trees[i];
		const coordsTree = getCoords(tree);
		treesCoords.push(coordsTree);
	}

	// отследим нажатие клавиши keydown и keyup

	document.addEventListener('keydown', event => {
		// условие, чтобы машинка не вдигалась во время паузы
		// if (isPause) return;

		// получили нажатую кнопку
		const code = event.code;

		if (code === 'ArrowUp' && carMoveInfo.top === null) {
			// первоначальный и единственный запуск анимации - как раз ее мы отменяем в keyup
			carMoveInfo.top = requestAnimationFrame(carMoveTop);
		} else if (code === 'ArrowDown' && carMoveInfo.bottom === null) {
			carMoveInfo.bottom = requestAnimationFrame(carMoveBottom);
		} else if (code === 'ArrowLeft' && carMoveInfo.left === null) {
			carMoveInfo.left = requestAnimationFrame(carMoveLeft);
		} else if (code === 'ArrowRight' && carMoveInfo.right === null) {
			carMoveInfo.right = requestAnimationFrame(carMoveRight);
		}
	});

	// когда клавиша отпускается - мы отменяем анимацию
	document.addEventListener('keyup', event => {
		// получили нажатую кнопку
		const code = event.code;

		if (code === 'ArrowUp') {
			cancelAnimationFrame(carMoveInfo.top);
			carMoveInfo.top = null;
		} else if (code === 'ArrowDown') {
			cancelAnimationFrame(carMoveInfo.bottom);
			carMoveInfo.bottom = null;
		} else if (code === 'ArrowLeft') {
			cancelAnimationFrame(carMoveInfo.left);
			carMoveInfo.left = null;
		} else if (code === 'ArrowRight') {
			cancelAnimationFrame(carMoveInfo.right);
			carMoveInfo.right = null;
		}
	});

	// опишем движение машинки на кнопках

	function carMoveTop() {
		const newY = carCoords.y - 5;
		// не даем выехать за пределы экрана вверх
		// if (newY < 0) return;

		carCoords.y = newY;
		carToMove(carCoords.x, newY);
		carMoveInfo.top = requestAnimationFrame(carMoveTop);
	}

	function carMoveBottom() {
		const newY = carCoords.y + 5;
		// не даем выехать за нижние пределы экрана
		// if (newY + carHeight > roadHeight) return;

		carCoords.y = newY;
		carToMove(carCoords.x, newY);
		carMoveInfo.bottom = requestAnimationFrame(carMoveBottom);
	}

	function carMoveLeft() {
		const newX = carCoords.x - 5;

		// if (newX < -roadWidth / 2 + carWidth / 2) return;

		carCoords.x = newX;
		carToMove(newX, carCoords.y);
		carMoveInfo.left = requestAnimationFrame(carMoveLeft);
	}

	function carMoveRight() {
		const newX = carCoords.x + 5;

		// if (newX > roadWidth / 2 - carWidth / 2) return;

		carCoords.x = newX;
		carToMove(newX, carCoords.y);
		carMoveInfo.right = requestAnimationFrame(carMoveRight);
	}

	// перезапись анимации машинки при нажатии на кнопку
	function carToMove(x, y) {
		car.style.transform = `translate(${x}px, ${y}px)`;
	}

	animationId = requestAnimationFrame(startGame);

	function startGame() {
		treesAnimation();
		elementAyimation (coin, coinCoord, coinWidth, -100);
        // elementAyimation (danger, dangerCoord, dangerWidth, -250);
        // elementAyimation (arrow, arrowCoord, arrowWidth, -600);
		animationId = requestAnimationFrame(startGame);
	}

	// сделаем так, чтобы дерево плавно спускалось вниз

	function treesAnimation() {
		// достаем коорд. по у для дерева и после прибавления координаты (speed) вписываем новое зн. по у

		for (let i = 0; i < trees.length; i++) {
			const tree = trees[i];

			// записываем координаты дерева
			const coords = treesCoords[i];

			let newYCoord = coords.y + speed;

			// доходим до конца экрана и перемещаем вверх дерево
			if (newYCoord > window.innerHeight) {
				// по большему дереву отрисовываем новые
				newYCoord = -370;
			}

			// перезаписываем координату y в массиве
			treesCoords[i].y = newYCoord;

			tree.style.transform = `translate(${coords.x}px, ${newYCoord}px)`;
		}
	}



    function elementAyimation (element, elementCoord, elementWidth, elementYInitialCoord) {

		let newYCoord = elementCoord.y + speed;
		let newXCoord = elementCoord.x;

		// условие на то, если монетка вышла за пределы экрана
		// и через сколько будет появляеться новая монетка
		if (newYCoord > window.innerHeight) {
			newYCoord = elementYInitialCoord;

			// расчитаем координату для появления новой монетки
			const direction = parseInt(Math.random() * 2);
			// дорога попалам и ширина монетки попалам, чтобы рендер был в пределах дороги
			const maxXCoord = roadWidth / 2 + 1 - elementWidth / 2;
			const randomXCoord = parseInt(Math.random() * maxXCoord);

			// if (direction === 0){ // двигаем влево
			//     newXCoord = -randomXCoord;
			// }

			// else if (direction === 1){ // двигаем вправо
			//     newXCoord = randomXCoord;
			// }  то же самое что код ниже

			newXCoord = direction === 0 
                ? -randomXCoord 
                : randomXCoord;
		}

		elementCoord.x = newXCoord;
		elementCoord.y = newYCoord;
		element.style.transform = `translate(${newXCoord}px, ${newYCoord}px)`;
    }



	// вытащим расположение дерева, то есть ед. высоты окна
	function getCoords(element) {
		const matrix = window.getComputedStyle(element).transform;
		const array = matrix.split(',');
		const y = array[array.length - 1];
		const x = array[array.length - 2];
		const numericY = parseFloat(y);
		const numericX = parseFloat(x);

		return { x: numericX, y: numericY };
	}

    // реализация коллизии для элементов
    function hasCollision () {
        const carYTop = carCoords.y;
        const carYBottom = carCoords.y + carHeight;

        const carXLeft = carCoords.x - carWidth / 2; // (-carWidth/2) тк позиционирование происходит от центра,
        const carXright = carCoords.x + carWidth / 2; // без этого берем еще половину машинки, где ее нет.

        const coinYTop = coinCoord.y;
        const coinYBottom = coinCoord.y + coinHeigh;

        const coinXLeft = coinCoord.x - coinWidth / 2;
        const coinXright = coinCoord.x + coinWidth / 2;


        if (carYTop > coinYBottom || carYBottom < coinYTop) { // условие на отсутствие коллизии по OY
            return false;
        }

        if (carXLeft > coinXright || carXright < coinXLeft) { // условие на отсутствие коллизии по OX
            return false;
        }

        return true;
    }


	const gameButton = document.querySelector('.game-button');
	addEventListener('click', () => {
		isPause = !isPause;
		// отрисовывем разные кнопки, при нажатии на паузу останавливаем анимацию
		if (isPause) {
			cancelAnimationFrame(animationId);
			cancelAnimationFrame(carMoveInfo.top);
			cancelAnimationFrame(carMoveInfo.bottom);
			cancelAnimationFrame(carMoveInfo.left);
			cancelAnimationFrame(carMoveInfo.right);

			gameButton.children[0].style.display = 'none';
			gameButton.children[1].style.display = 'initial';
		} else {
			animationId = requestAnimationFrame(startGame);
			gameButton.children[0].style.display = 'initial';
			gameButton.children[1].style.display = 'none';
		}
	});
})()