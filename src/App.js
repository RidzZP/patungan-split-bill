import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Ridwan",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Fahmi",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anton",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [items, setItems] = useState(initialFriends);
  const [toggleTambah, setToggleTambah] = useState(false);
  const [selected, setSelected] = useState(null);

  function handleToggle() {
    setToggleTambah((toggleTambah) => !toggleTambah);
  }

  function handleTambah(item) {
    setItems((items) => [...items, item]);
  }

  function handleSelection(item) {
    // setSelected(item);
    setSelected((cur) => (cur?.id === item.id ? null : item));
    setToggleTambah(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          newData={items}
          onSelection={handleSelection}
          selected={selected}
        />
        {toggleTambah && <FormTambahTeman onTambah={handleTambah} />}
        <Button onClick={handleToggle}>
          {toggleTambah === true ? "Close" : "Tambah Teman"}
        </Button>
      </div>

      {selected && <FormPatungan selected={selected} />}
    </div>
  );
}

const FriendList = ({ newData, onSelection, selected }) => {
  const data = newData;
  return (
    <ul>
      {data.map((data) => (
        <List
          dataObj={data}
          key={data.id}
          onSelection={onSelection}
          selected={selected}
        />
      ))}
    </ul>
  );
};

const List = ({ dataObj, onSelection, selected }) => {
  const isSelected = selected?.id === dataObj.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={dataObj.image} alt={dataObj.name} />
      <h3>{dataObj.name}</h3>

      {dataObj.balance < 0 && (
        <p className="red">
          Hutang Aku Ke {dataObj.name} ${Math.abs(dataObj.balance)}
        </p>
      )}
      {dataObj.balance > 0 && (
        <p className="green">
          Hutang {dataObj.name} Ke Aku ${Math.abs(dataObj.balance)}
        </p>
      )}
      {dataObj.balance === 0 && <p>Nggak ada</p>}

      <Button onClick={() => onSelection(dataObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const Button = ({ onClick, children }) => {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const FormTambahTeman = ({ onTambah }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    const id = crypto.randomUUID;
    const newData = { id, name, image: `${image}?=${id}`, balance: 0 };

    if (!name && !image) return;

    console.log(newData);

    onTambah(newData);

    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🫂Nama</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📷Link Foto</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Tambah</Button>
    </form>
  );
};

const FormPatungan = ({ selected }) => {
  const [tagihan, setTagihan] = useState("");
  const [payByUser, setPayByUser] = useState("");
  const [siapaBayar, setSiapaBayar] = useState("user");

  return (
    <form className="form-split-bill">
      <h2>Patungan Bersama {selected.name}</h2>

      <label>💰Jumlah Tagihan</label>
      <input
        type="text"
        value={tagihan}
        onChange={(e) => setTagihan(e.target.value)}
      />

      <label>💰Tagihan Aku</label>
      <input
        type="text"
        value={payByUser}
        onChange={(e) => setPayByUser(e.target.value)}
      />

      <label>💰Tagihan {selected.name}</label>
      <input type="text" disabled />

      <label>💰Mau Dibayarin Siapa?</label>
      <select
        value={siapaBayar}
        onChange={(e) => setSiapaBayar(e.target.value)}
      >
        <option value="user">Aku</option>
        <option value="teman">{selected.name}</option>
      </select>

      <Button>Patungan</Button>
    </form>
  );
};
