(function () {
	let isPause = false;
	let animationId = null;

	const speed = 10;


	const car = document.querySelector('.car');
	const trees = document.querySelectorAll('.tree');

    const carCoords = getCoords(car);
    const carMoveInfo = {
			top: null,
			bottom: null,
			left: null,
			right: null,
		};


    const treesCoords = []


    for (let i = 0; i < trees.length; i++){
        const tree = trees[i]
        const coordsTree = getCoords(tree)
        treesCoords.push(coordsTree)
    }

    // отследим нажатие клавиши keydown и keyup

    document.addEventListener('keydown', (event) => {
        // получили нажатую кнопку
        const code = event.code;
    
        if (code === 'ArrowUp' && carMoveInfo.top === null){
            carMoveInfo.top = requestAnimationFrame(carMoveTop);
        }


        else if (code === 'ArrowDown' && carMoveInfo.bottom === null) {
			carMoveInfo.bottom = requestAnimationFrame(carMoveBottom);
		}


        else if (code === 'ArrowLeft' && carMoveInfo.left === null) {
            carMoveInfo.left = requestAnimationFrame(carMoveLeft);
		}


        else if (code === 'ArrowRight' && carMoveInfo.right === null) {
			carMoveInfo.right = requestAnimationFrame(carMoveRight);
		}

    })

    // когда клавиша отпускается - мы отменяем анимацию 
    document.addEventListener('keyup', (event) => {
        // получили нажатую кнопку
        const code = event.code;

        if (code === 'ArrowUp'){
            cancelAnimationFrame(carMoveInfo.top);
            carMoveInfo.top = null;
        }


        else if (code === 'ArrowDown') {
			cancelAnimationFrame(carMoveInfo.bottom);
            carMoveInfo.bottom = null;
		}


        else if (code === 'ArrowLeft') {
            cancelAnimationFrame(carMoveInfo.left);
            carMoveInfo.left = null;
		}


        else if (code === 'ArrowRight') {
			cancelAnimationFrame(carMoveInfo.right);
            carMoveInfo.right = null;
		}
    });


    // опишем движение машинки на кнопках

    function carMoveTop() {
        const newY = carCoords.y - 5;
        carCoords.y = newY;
        carToMove(carCoords.x, newY);
        carMoveInfo.top = requestAnimationFrame(carMoveTop);
    }

    function carMoveBottom() {
        const newY = carCoords.y + 5;
        carCoords.y = newY;
        carToMove(carCoords.x, newY);
        carMoveInfo.bottom = requestAnimationFrame(carMoveBottom);
    }


    function carMoveLeft() {
        const newX = carCoords.x - 5;
        carCoords.x = newX;
        carToMove(newX, carCoords.y);
        carMoveInfo.left = requestAnimationFrame(carMoveLeft);
    }


    function carMoveRight() {
        const newX = carCoords.x + 5;
        carCoords.x = newX;
        carToMove(newX, carCoords.y);
        carMoveInfo.right = requestAnimationFrame(carMoveRight);
    }

    // перезапись анимации машинки при нажатии на кнопку
    function carToMove (x, y) {
        car.style.transform = `translate(${x}px, ${y}px)`;
    }

	animationId = requestAnimationFrame(startGame);

	function startGame() {
		treesAnimation();
		animationId = requestAnimationFrame(startGame);
	}

	// сделаем так, чтобы дерево плавно спускалось вниз

	function treesAnimation() {
		// достаем коорд. по у для дерева и после прибавления координаты (speed) вписываем новое зн. по у

        for (let i = 0; i < trees.length; i++) {
			const tree = trees[i];

            // записываем координаты дерева
            const coords = treesCoords[i]

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

	const gameButton = document.querySelector('.game-button');
	addEventListener('click', () => {
		isPause = !isPause;
		// отрисовывем разные кнопки, при нажатии на паузу останавливаем анимацию
		if (isPause) {
			cancelAnimationFrame(animationId);
			gameButton.children[0].style.display = 'none';
			gameButton.children[1].style.display = 'initial';
		} else {
			animationId = requestAnimationFrame(startGame);
			gameButton.children[0].style.display = 'initial';
			gameButton.children[1].style.display = 'none';
		}
	});
})()