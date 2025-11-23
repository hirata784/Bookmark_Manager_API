const API_URL = "/api/bookmarks";

// 定数と変数
const bookmarks = document.getElementById("js-bookmarks");
const form = document.getElementById("js-form");
const jsTitle = document.getElementById("js-title");
const jsUrl = document.getElementById("js-url");
const txtTitle = document.getElementsByClassName("js-txtTitle");
const txtUrl = document.getElementsByClassName("js-txtUrl");
let nothing = document.getElementById("js-nothing");
// true：エラー発生 false：エラーなし
let titleReturn = false;
let urtReturn = false;

// ブックマーク一覧を読み込む
async function loadBookmark() {
    // APIからデータを取得
    const res = await fetch(API_URL);
    // JSONに変換
    const data = await res.json();

    // 以前の内容をクリア
    bookmarks.innerHTML = "";
    nothing.innerHTML = "";

    // ブックマークがない場合、文字列を表示
    if (data.data.length <= 0) {
        const p = document.createElement("p");
        p.innerHTML = `
        <p>ブックマークはありません</p>
    `;
        // containerの中に追加
        nothing.appendChild(p);
        // alert("ブックマークはありません。");
    } else {
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
            <input class="js-txtTitle" readonly type="text" value="${bookmark.title}">
        </td>
        <td>
            <input class="js-txtUrl" readonly type="text" value="${bookmark.url}">
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
    let upBtn = document.getElementsByClassName("updateBtn");
    if (upBtn[row].innerHTML === "編集") {
        // 編集ボタンが表示されているとき
        // ボタン表示を変更(編集→保存)
        upBtn[row].innerHTML = "保存";
        upBtn[row].style.background = "green";
        // テーブル値入力可能にする
        txtTitle[row].readOnly = false;
        txtUrl[row].readOnly = false;
        // 該当テキストボックスの背景を変更する
        txtTitle[row].style.background = "pink";
        txtUrl[row].style.background = "pink";
    } else {
        // 保存ボタンが表示されているとき
        // 入力値を取得
        const title = txtTitle[row].value;
        const url = txtUrl[row].value;

        // URL（https・http）の正規表現
        var regex = new RegExp('^(https?:\\/\\/)?' +
            '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' +
            '(\\/[-a-z\\d%_.~+]*)*', 'i');

        // タイトルのチェック
        if (title.length <= 0) {
            alert("タイトルを入力してください");
            return;
        }

        // URLのチェック
        if (!regex.test(url)) {
            alert("有効なURLを入力してください。");
            return;
        }

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

        // ボタン表示を変更(保存→編集)
        upBtn[row].innerHTML = "編集";
        upBtn[row].style.background = "blue";
        // テーブル値入力不可能にする
        txtTitle[row].readOnly = true;
        txtUrl[row].readOnly = true;
        // 該当テキストボックスの背景を変更する
        txtTitle[row].style.background = "white";
        txtUrl[row].style.background = "white";

        // 再読み込み
        loadBookmark();
    }
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