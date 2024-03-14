(function () {
	let isPause = false;
	let animationId = null;

    const speed = 3;

	const car = document.querySelector('.car');
	const trees = document.querySelectorAll('.tree');

	const tree1 = trees[0];

	animationId = requestAnimationFrame(startGame);

	function startGame() {
        treesAnimation();
		animationId = requestAnimationFrame(startGame);
	}

	// сделаем так, чтобы дерево плавно спускалось вниз

	function treesAnimation() {
        const newCoord = getYCoord(tree1) + speed;
        tree1.style.transform = `translateY(${newCoord}px)`
    }



	// вытащим расположение дерева, то есть ед. высоты окна

	function getYCoord(element) {
		const matrix = window.getComputedStyle(element).transform;
		const array = matrix.split(',');
		const lastElment = array[array.length - 1];
		coordY = parseFloat(lastElment);

		return coordY;
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
			gameButton.children[0].style.display = 'initial';
			gameButton.children[1].style.display = 'none';
		}
	});
})()