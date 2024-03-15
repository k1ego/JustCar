(function () {
	let isPause = false;
	let animationId = null;

	const speed = 3;


	const car = document.querySelector('.car');
	const trees = document.querySelectorAll('.tree');

    const treesCoords = []

    for (let i = 0; i < trees.length; i++){
        const tree = trees[i]
        const coordsTree = getCoords(tree)
        treesCoords.push(coordsTree)
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
                newYCoord = -tree.height;
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