(function () {
	let isPause = false;
	let animationId = null;

	let speed = 3;
    let score = 0;

	const car = document.querySelector('.car');
    
	const carInfo = {
        ...createElementInfo(car),
        move: {
            top: null,
            bottom: null,
            left: null,
            right: null,
        },
    };


	const coin = document.querySelector('.coin');
	const coinInfo = createElementInfo(coin);

	const danger = document.querySelector('.danger');
	// const dangerInfo = createElementInfo(danger);

	const arrow = document.querySelector('.arrow');
	// const arrowInfo = createElementInfo(arrow);

	const road = document.querySelector('.road');
	const roadHeight = road.clientHeight;
	const roadWidth = road.clientWidth;

    const gameScore = document.querySelector('.game-score')

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

		if (code === 'ArrowUp' && carInfo.move.top === null) {
			// первоначальный и единственный запуск анимации - как раз ее мы отменяем в keyup
			carInfo.move.top = requestAnimationFrame(carMoveTop);
		} else if (code === 'ArrowDown' && carInfo.move.bottom === null) {
			carInfo.move.bottom = requestAnimationFrame(carMoveBottom);
		} else if (code === 'ArrowLeft' && carInfo.move.left === null) {
			carInfo.move.left = requestAnimationFrame(carMoveLeft);
		} else if (code === 'ArrowRight' && carInfo.move.right === null) {
			carInfo.move.right = requestAnimationFrame(carMoveRight);
		}
	});

	// когда клавиша отпускается - мы отменяем анимацию
	document.addEventListener('keyup', event => {
		// получили нажатую кнопку
		const code = event.code;

		if (code === 'ArrowUp') {
			cancelAnimationFrame(carInfo.move.top);
			carInfo.move.top = null;
		} else if (code === 'ArrowDown') {
			cancelAnimationFrame(carInfo.move.bottom);
			carInfo.move.bottom = null;
		} else if (code === 'ArrowLeft') {
			cancelAnimationFrame(carInfo.move.left);
			carInfo.move.left = null;
		} else if (code === 'ArrowRight') {
			cancelAnimationFrame(carInfo.move.right);
			carInfo.move.right = null;
		}
	});

    // создание элементов 
    function createElementInfo(element) {
    return {
        coords: getCoords(element),
        height: element.clientHeight,
        width: element.clientWidth,
        visible: true,
        };
    }



	// опишем движение машинки на кнопках
	function carMoveTop() {
		const newY = carInfo.coords.y - 5;
		// не даем выехать за пределы экрана вверх
		// if (newY < 0) return;

		carInfo.coords.y = newY;
		carToMove(carInfo.coords.x, newY);
		carInfo.move.top = requestAnimationFrame(carMoveTop);
	}

	function carMoveBottom() {
		const newY = carInfo.coords.y + 5;
		// не даем выехать за нижние пределы экрана
		// if (newY + carInfo.height > roadHeight) return;

		carInfo.coords.y = newY;
		carToMove(carInfo.coords.x, newY);
		carInfo.move.bottom = requestAnimationFrame(carMoveBottom);
	}

	function carMoveLeft() {
		const newX = carInfo.coords.x - 5;

		// if (newX < -roadWidth / 2 + carInfo.width / 2) return;

		carInfo.coords.x = newX;
		carToMove(newX, carInfo.coords.y);
		carInfo.move.left = requestAnimationFrame(carMoveLeft);
	}

	function carMoveRight() {
		const newX = carInfo.coords.x + 5;

		// if (newX > roadWidth / 2 - carInfo.width / 2) return;

		carInfo.coords.x = newX;
		carToMove(newX, carInfo.coords.y);
		carInfo.move.right = requestAnimationFrame(carMoveRight);
	}

	// перезапись анимации машинки при нажатии на кнопку
	function carToMove(x, y) {
		car.style.transform = `translate(${x}px, ${y}px)`;
	}

	animationId = requestAnimationFrame(startGame);

	function startGame() {
		treesAnimation();
		elementAnimation (coin, coinInfo, -100);

        if (coinInfo.visible && hasCollision(carInfo, coinInfo)) {
            score++;
            gameScore.innerText = score;
            coin.style.display = 'none';
            coinInfo.visible = false;

            // увеличиваем скорость при увеличении счета
            if (score % 3 === 0) speed += 2;
        }



        // elementAnimation (danger, dangerCoords, dangerWidth, -250);
        // elementAnimation (arrow, arrowCoord, arrowWidth, -600);

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



    function elementAnimation (element, elementInfo, elementYInitialCoord) {

		let newYCoord = elementInfo.coords.y + speed;
		let newXCoord = elementInfo.coords.x;

		// условие на то, если монетка вышла за пределы экрана
		// и через сколько будет появляеться новая монетка
		if (newYCoord > window.innerHeight) {
			newYCoord = elementYInitialCoord;

			// расчитаем координату для появления новой монетки
			const direction = parseInt(Math.random() * 2);
			// дорога попалам и ширина монетки попалам, чтобы рендер был в пределах дороги
			const maxXCoord = roadWidth / 2 + 1 - elementInfo.width / 2;
			const randomXCoord = parseInt(Math.random() * maxXCoord);

			// if (direction === 0){ // двигаем влево
			//     newXCoord = -randomXCoord;
			// }

			// else if (direction === 1){ // двигаем вправо
			//     newXCoord = randomXCoord;
			// }  то же самое что код ниже


            // элемент будет отображаться с установленным по умолчанию значением
            element.style.display = 'initial';
            // после удаления монетки она заново отрисуется за пределами экрана
            elementInfo.visible = true;

			newXCoord = direction === 0 
                ? -randomXCoord 
                : randomXCoord;
		}

		elementInfo.coords.x = newXCoord;
		elementInfo.coords.y = newYCoord;
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
    // параметры функции отвечают сразу за 6 переменных
    function hasCollision (elem1Info, elem2Info) {
        const carYTop = elem1Info.coords.y;
        const carYBottom = elem1Info.coords.y + elem1Info.height;

        const carXLeft = elem1Info.coords.x - elem1Info.width / 2; // (-carInfo.width/2) тк позиционирование происходит от центра,
        const carXright = elem1Info.coords.x + elem1Info.width / 2; // без этого берем еще половину машинки, где ее нет.

        const coinYTop = elem2Info.coords.y;
        const coinYBottom = elem2Info.coords.y + elem2Info.height;

        const coinXLeft = elem2Info.coords.x - elem2Info.width / 2;
        const coinXright = elem2Info.coords.x + elem2Info.width / 2;


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
			cancelAnimationFrame(carInfo.move.top);
			cancelAnimationFrame(carInfo.move.bottom);
			cancelAnimationFrame(carInfo.move.left);
			cancelAnimationFrame(carInfo.move.right);

			gameButton.children[0].style.display = 'none';
			gameButton.children[1].style.display = 'initial';
		} else {
			animationId = requestAnimationFrame(startGame);
			gameButton.children[0].style.display = 'initial';
			gameButton.children[1].style.display = 'none';
		}
	});
})()