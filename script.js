const formsDiv = document.querySelector('.wishContainer');
const goToWishList = document.createElement('button');
goToWishList.classList.add('goWishList');
goToWishList.innerText = 'GoToWishList';
formsDiv.append(goToWishList);

async function allData() {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    return data;
}

async function main() {
    const userData = await allData();
    const wishList = [];
    let currentPage = 1;
    const rows = 4;

    async function dellButton(id, index) {
        try {
            await fetch(`https://fakestoreapi.com/products/${id}`, { method: "DELETE" });
            userData.splice(index, 1);
            displayList(userData, rows, currentPage);
            displayPagination(userData, rows);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function moreButton(id) {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${id}`);
            const json = await response.json();
            const moreDiv = document.createElement('div');
            const res = document.querySelector('.container');
            res.append(moreDiv);
            moreDiv.innerHTML = `<div class='aboutProductDiv'>
                <h3>${json.category.toUpperCase()}</h3>
                <span>${json.title}</span>
                <div class='descProduct'>${json.description}</div>
                <img src='${json.image}' style='width:450px;height:400px;border-radius:20px'/>
                <p>Product price ${json.price}$</p>
                <button class='backBtn'>BACK</button>
            </div>`;

            document.querySelectorAll('.backBtn').forEach(button => {
                button.addEventListener('click', () => {
                    moreDiv.remove();
                    document.querySelector('.users').style.display = 'flex';
                    document.querySelector('.pagination').style.display = 'block';
                    formsDiv.style.display = 'block';
                });
            });
        } catch (error) {
            console.error('Error', error);
        }
    }

    function displayWishlist() {
        const usersEl = document.querySelector('.users');
        const paginationEl = document.querySelector('.pagination');
        usersEl.innerHTML = '';
        paginationEl.style.display = 'none';

        if (wishList.length === 0) {
            usersEl.innerHTML = '<p>No items in wishlist.</p>';
            return;
        }

        wishList.forEach((item, index) => {
            const goodsEl = document.createElement('div');
            goodsEl.classList.add('user');
            goodsEl.innerHTML = `
                <div class='childDiv'>
                    <h3>${item.category}</h3>
                    <p>${item.title}</p>
                    <img src="${item.image}" style="width:300px;height:300px;border-radius:20px;">
                    <div class='buttonsDiv'>
                        <button class='removeWish' wish-index='${index}'>Remove</button>
                    </div>
                </div>`;
            usersEl.appendChild(goodsEl);
        });

        document.querySelectorAll('.removeWish').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = Number(e.target.getAttribute('wish-index'));
                wishList.splice(index, 1);
                displayWishlist();
            });
        });
    }

    const goToCatalog = document.createElement('button');
    goToCatalog.innerText = 'Back To All Goods';
    formsDiv.append(goToCatalog);
    goToCatalog.style.display = 'none';
    goToCatalog.classList.add('backCatalog');
    goToWishList.addEventListener('click', () => {
        displayWishlist();
        goToWishList.style.display = 'none';
        goToCatalog.style.display = 'block';
    });

    goToCatalog.addEventListener('click', () => {
        goToCatalog.style.display = 'none';
        goToWishList.style.display = 'block';
        displayList(userData, rows, currentPage);
        document.querySelector('.pagination').style.display = 'block';
    });

    function displayList(arrData, rowPerPage, page) {
        const usersEl = document.querySelector('.users');
        usersEl.innerHTML = '';
        page--;
        const start = rowPerPage * page;
        const end = start + rowPerPage;
        const paginatedData = arrData.slice(start, end);

        paginatedData.forEach((el, index) => {
            const userEl = document.createElement('div');
            userEl.classList.add('user');
            userEl.innerHTML = `<div class='childDiv'>
                <h3 style='color:#006400;'>${el.category}</h3>
                <p>Name: ${el.title}</p>
                <img src=${el.image} style='width:300px;height:300px;border-radius:20px'>
                <div class='buttonsDiv'>
                    <button class='moreBtn' elem-id='${el.id}'>More</button>
                    <button class='wishBtn' wish-id='${el.id}'>WishList</button>
                    <button class='dellBtn' data-id='${el.id}' data-index='${start + index}'>Delete</button>
                </div></div>`;
            usersEl.appendChild(userEl);
        });

        document.querySelectorAll('.moreBtn').forEach(button => {
            button.addEventListener('click', (elem) => {
                const id = elem.target.getAttribute('elem-id');
                moreButton(id);
                usersEl.style.display = 'none';
                document.querySelector('.pagination').style.display = 'none';
                formsDiv.style.display = 'none';
            });
        });

        document.querySelectorAll('.dellBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                dellButton(id, index);
            });
        });

        document.querySelectorAll('.wishBtn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = Number(e.target.getAttribute('wish-id'));
                const tmp = userData.filter(el => el.id === id);
                if (!wishList.some(el => el.id === id)) {
                    wishList.push(tmp[0]);
                }
            });
        });
    }

    function displayPagination(arrData, rowPerPage) {
        const paginationEl = document.querySelector('.pagination');
        paginationEl.innerHTML = '';
        const pagesCount = Math.ceil(arrData.length / rowPerPage);
        const ulEl = document.createElement('ul');
        ulEl.classList.add('ulPaginate');

        for (let i = 0; i < pagesCount; i++) {
            const liEl = displayPaginationBtn(i + 1);
            ulEl.appendChild(liEl);
        }

        paginationEl.append(ulEl);
    }

    function displayPaginationBtn(page) {
        const liEl = document.createElement('li');
        liEl.classList.add('lipageList');
        liEl.innerText = page;
        if (currentPage === page) liEl.classList.add('setle');

        liEl.addEventListener('click', () => {
            currentPage = page;
            displayList(userData, rows, currentPage);
            document.querySelector('li.setle').classList.remove('setle');
            liEl.classList.add('setle');
        });
        return liEl;
    }

    displayList(userData, rows, currentPage);
    displayPagination(userData, rows);
}

main();
