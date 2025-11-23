const API_URL = "/api/bookmarks";

// 変数
const form = document.getElementById("js-form");
const jsTitle = document.getElementById("js-title");
const jsUrl = document.getElementById("js-url");
const txtTitle = document.getElementsByClassName("js-txtTitle");
const txtUrl = document.getElementsByClassName("js-txtUrl");
// true：エラー発生 false：エラーなし
let titleReturn = false;
let urtReturn = false;

// ブックマーク一覧を読み込む
async function loadBookmark() {
    // APIからデータを取得
    const res = await fetch(API_URL);
    // JSONに変換
    const data = await res.json();

    // リストを表示するコンテナを取得
    const bookmarks = document.getElementById("js-bookmarks");
    // 以前の内容をクリア
    bookmarks.innerHTML = "";

    // ヘッダーを作成
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <th>タイトル</th>
        <th>URL</th>
        <th>編集</th>
        <th>削除</th>
    `;
    // containerの中に追加
    bookmarks.appendChild(tr);

    // 取得したブックマーク一覧をループしてHTMLに追加
    data.data.forEach((bookmark, index) => {
        const tr = document.createElement("tr");

        // ブックマークのタイトル・URL・編集・削除を表示
        tr.innerHTML = `
        <td>
            <input class="js-txtTitle" type="text" value="${bookmark.title}">
        </td>
        <td>
            <input class="js-txtUrl" type="text" value="${bookmark.url}">
        </td>
        <td class="btn">
            <button class="updateBtn" onclick="updateBookmark(${bookmark.id},${index})">編集</button>
        </td>
        <td class="btn">
            <button class="deleteBtn" onclick="deleteBookmark(${bookmark.id})">削除</button>
        </td>
    `;

        // containerの中に追加
        bookmarks.appendChild(tr);
    });
}

// ブックマークを追加する
async function addBookmark(e) {
    e.preventDefault();

    // 入力値を取得
    const title = jsTitle.value;
    const url = jsUrl.value;

    // URL（https・http）の正規表現
    var regex = new RegExp('^(https?:\\/\\/)?' +
        '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' +
        '(\\/[-a-z\\d%_.~+]*)*', 'i');

    // タイトルのチェック
    if (title.length <= 0) {
        document.getElementById("titleError").innerHTML = "タイトルを入力してください";
        titleReturn = true;
    } else {
        document.getElementById("titleError").innerHTML = "";
        titleReturn = false;
    }

    // URLのチェック
    if (regex.test(url)) {
        document.getElementById('urlError').innerHTML = "";
        urtReturn = false;
    } else {
        document.getElementById('urlError').innerHTML = "有効なURLを入力してください。";
        urtReturn = true;
    }

    // エラーが表示された場合、処理を中断する
    if (titleReturn === true || urtReturn === true) {
        return;
    }

    // APIからデータを取得
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url }),
    });

    // JSONに変換
    const data = await res.json();
    alert("ブックマークを追加しました");

    // 入力値をクリアする
    jsTitle.value = "";
    jsUrl.value = "";

    // 再読み込み
    loadBookmark();
}

// ブックマークを編集する
async function updateBookmark(id, row) {
    // 入力値を取得
    const title = txtTitle[row].value;
    const url = txtUrl[row].value;

    // APIからデータを取得
    const res = await fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url }),
    });

    // JSONに変換
    const data = await res.json();
    alert("ブックマークを編集しました");

    // 再読み込み
    loadBookmark();
}

// ブックマークを削除する
async function deleteBookmark(id) {
    // APIからデータを取得
    const res = await fetch(API_URL + "/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    // JSONに変換
    const data = await res.json();
    alert("ブックマークを削除しました");

    // 再読み込み
    loadBookmark();
}

// 初期化
loadBookmark();
// イベント
form.addEventListener("submit", addBookmark);