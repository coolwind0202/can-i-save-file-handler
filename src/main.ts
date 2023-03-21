let keys: string[] = [];

/**
 * input 要素の File オブジェクトを IndexedDB に保存します。
 */
const saveFile = async (e: Event) => {
  console.log(e);
  if (!(e.target instanceof HTMLInputElement)) return;
  console.log(e);

  const files = e.target.files;
  if (files === null || !files.length) return;

  const file = files.item(0);
  if (file === null) return;

  await save(file);
};

const save = async (obj: any) => {
  const request = window.indexedDB.open("database");

  let db: IDBDatabase | undefined = undefined;

  request.addEventListener("error", (e) => {
    console.error(e);
    alert("データベースを開くのに失敗しました。");
  });

  request.addEventListener("success", () => {
    db = request.result;
    console.log(db);

    const transaction = db.transaction("fileObjects", "readwrite");
    const key = transaction.objectStore("fileObjects").add(obj);

    transaction.addEventListener("complete", (e) => {
      console.log(e);
      keys.push(key.result.toString());
      console.log(keys);
    });
  });

  request.addEventListener("upgradeneeded", (e) => {
    // @ts-ignore
    const db = e.target.result;
    console.log(db);

    if (db === undefined) return;

    db.createObjectStore("fileObjects", { autoIncrement: true });
  });
};

const saveHandler = async () => {
  const [fileHandle] = await window.showOpenFilePicker({ multiple: false });
  save(fileHandle);
};

document.getElementById("file-input")?.addEventListener("change", saveFile);
document.getElementById("file-button")?.addEventListener("click", saveHandler);
