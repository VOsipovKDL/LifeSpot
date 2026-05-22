function getReview() {
    // Создадим объект
    let review = {}

    // Сохраним свойство имени
    review["userName"] = prompt("Как вас зовут ?")
    if (review["userName"] == null) {
        return
    }

    // Сохраним текст отзыва
    review["comment"] = prompt("Напишите свой отзыв")
    if (review["comment"] == null) {
        return
    }

    // Сохраним текущее время
    review["date"] = new Date().toLocaleString()

    // Добавим на страницу
    writeReview(review)
}

function getComment() {
    // Создаем объект обычного комментария
    let comment = {}

    // Запросим имя
    comment.author = prompt("Как вас зовут ?")
    if (comment.author == null) {
        return
    }

    // Запросим текст
    comment.text = prompt("Оставьте отзыв")
    if (comment.text == null) {
        return
    }

    // Сохраним текущее время
    comment.date = new Date().toLocaleString()

    // Запросим, хочет ли пользователь оставить полноценный отзыв или это будет обычный комментарий
    let enableLikes = confirm('Разрешить пользователям оценивать ваш отзыв?')

    if (enableLikes) {
        // Создадим для отзыва новый объект из прототипа - комментария
        let review = Object.create(comment)
        // и добавим ему нужное свойство
        review.rate = 0;

        // Добавляем отзыв с возможностью пользовательских оценок
        writeReview(review)
    } else {
        // Добавим простой комментарий без возможности оценки
        writeReview(comment)
    }
}

const writeReview = review => {
    let likeCounter = '';

    // Если публикуется отзыв - добавляем ему кнопку с лайками.
    if (review.hasOwnProperty('rate')) {

        // Генерим идентификатор комментария.
        let commentId = Math.random();
        // Для кнопки лайков добавляем: идентификатор, атрибут onclick для передачи идентификатора в функцию, значок лайка, и само значение счётчика отделяем пробелом
        // Также мы добавили стиль, чтобы кнопка смотрелась лучше и не имела рамок
        likeCounter += '<button id="' + commentId + '" style="border: none" onclick="addLike(this.id)">' + `❤️ ${review.rate}</button>`
    }
    // Запишем результат 
    document.getElementsByClassName('reviews')[0].innerHTML += ' <div class="review-    text">\n' + `<p> <i> <b>${review['author']}</b> ${review['date']}${likeCounter}</i></p>` + `<p>${review['text']}</p>` + '</div>';
}

function Comment() {
    // Запросим имя
    this.author = prompt("Как вас зовут ?")
    if (this.author == null) {
        this.empty = true
        return
    }

    // Запросим текст
    this.text = prompt("Оставьте отзыв")
    if (this.text == null) {
        this.empty = true
        return
    }

    // Сохраним текущее время
    this.date = new Date().toLocaleString()
}

function addComment() {
    let comment = new Comment()

    // проверяем, успешно ли юзер осуществил ввод
    if (comment.empty) {
        return;
    }

    // Запросим, хочет ли пользователь оставить полноценный отзыв или это будет обычный комментарий
    let enableLikes = confirm('Разрешить пользователям оценивать ваш отзыв?')

    if (enableLikes) {
        // Создадим для отзыва новый объект из прототипа - комментария
        let review = Object.create(comment)
        // и добавим ему нужное свойство
        review.rate = 0;

        // Добавляем отзыв с возможностью пользовательских оценок
        writeReview(review)
    } else {
        // Добавим простой комментарий без возможности оценки
        writeReview(comment)
    }
}

const track = document.getElementById('track');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsBox = document.getElementById('dots');
const slides = track.querySelectorAll('.slider-slide');

let currentIndex = 0;
const gap = 12;

slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
});

function getDot(i) { return dotsBox.children[i]; }

function goTo(index) {
    const max = slides.length - 1;
    if (index < 0) index = max;
    if (index > max) index = 0;
    currentIndex = index;

    const slideWidth = slides[0].offsetWidth + gap;
    track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;

    [...dotsBox.children].forEach(d => d.classList.remove('active'));
    getDot(currentIndex).classList.add('active');
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

let startX = 0, isDragging = false;

track.addEventListener('mousedown', dragStart);
track.addEventListener('touchstart', dragStart, { passive: true });

function dragStart(e) {
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    isDragging = true;
    track.classList.add('dragging');
}

document.addEventListener('mousemove', onMove);
document.addEventListener('touchmove', onMove, { passive: true });

function onMove(e) {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = x - startX;
    const slideWidth = slides[0].offsetWidth + gap;
    const offset = -(currentIndex * slideWidth) + diff;

    track.style.transform = `translateX(${offset}px)`;
}

document.addEventListener('mouseup', onEnd);
document.addEventListener('touchend', onEnd);

function onEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('dragging');

    const endX = e.type === 'touchend'
        ? e.changedTouches[0].clientX
        : e.clientX;
    const diff = endX - startX;
    const threshold = slides[0].offsetWidth * 0.2;

    if (diff < -threshold) goTo(currentIndex + 1);
    else if (diff > threshold) goTo(currentIndex - 1);
    else goTo(currentIndex);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
});